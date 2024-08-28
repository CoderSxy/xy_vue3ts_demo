// 场景
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Options, SetData } from "./interface";
import OperateView from "./operateView.js"; 
import {
  AmbientLight,
  AxesHelper,
  Camera,
  Clock,
  DirectionalLight,
  Group,
  Mesh,
  Object3D,
  OrthographicCamera,
  PerspectiveCamera,
  PointLight,
  Renderer,
  Scene,
  Vector3,
  WebGLRenderer,
} from "three";
import CreateEarth from "./figures/Earth";
import MapShape from "./figures/MapShape.ts";
import sprite from "./figures/Sprite";
// import { update as tweenUpdate } from "@tweenjs/tween.js";
import Store from "./store/store";
import EventStore from "./store/eventStore";
import { merge } from "lodash";
import CustomOrbitControls from "./utils/controls.ts";


export default class ChartScene {
  options: Options;
  initOptions: Pick<Options, "helper" | "autoRotate" | "rotateSpeed" | "mode"> = {
    helper: false,
    autoRotate: true,
    rotateSpeed: 0.01,
    mode: "3d",
  };
  style = {
    width: 0,
    height: 0
  }
  earthHovered: boolean = false;
  camera: Camera;
  notLockFps: Function;
  mainContainer: Object3D;
  scene: Scene;
  renderer: Renderer;
  controls: CustomOrbitControls;
  _store: Store;
  _eventStore: EventStore;
  _OperateView: OperateView; // 操作视图

  /**
   * 构造函数 
   * @param {Partial<Options>} params 
   */
  constructor(params: Partial<Options>) {
    this._store = new Store();
    this._OperateView = new OperateView(this._store);
    this.options = {
      ...this.options,
      config: this._store.getConfig()
    }
    this.options = merge({}, this.options, this.initOptions, params);
    // this.options = {...this.options, ...this.initOptions, ...params};

    this.notLockFps = this.lockFps(this.options.limitFps)
    this.init();
    this._eventStore = new EventStore(this);
  }

  /**
   * 事件注册函数
   * Method to register an event.
   * @param {string} eventName - The name of the event.
   * @param {(event: Event, mesh: Object3D | Group | Mesh | undefined) => void} cb - The callback function to be executed when the event is triggered.
   */
  on(
    eventName: string,
    cb: (event: Event, mesh: Object3D | Group | Mesh | undefined) => void
  ) {
    this._eventStore.registerEventMap(eventName, cb);
  }
  /**
   * 清除threejs的对象
   * @param {any} obj - The Three.js object to be cleared.
   */
  clearThree(obj: any) {
    while (obj.children.length > 0) {
      this.clearThree(obj.children[0]);
      obj.remove(obj.children[0]);
    }
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) obj.material.dispose();
    if (obj.texture) obj.texture.dispose();
  }

  /**
   * 销毁场景
   */
  destroy() {
    this.clearThree(this.scene);
    this.options.dom.innerHTML = "";
  }


  /**
   * 初始化场景
   */
  init() {
    const {
      dom,
      cameraType = "OrthographicCamera",
      light = "DirectionalLight",
      helper = false,
      map = "world",
      config,
    } = this.options;

    this._store.setConfig(this.options);
    this.mainContainer = this.createCube();
    this.style = dom.getBoundingClientRect();
    this.scene = this.createScene();
    if (cameraType === "OrthographicCamera") {
      this.camera = this.createOrthographicCamera();
    } else {
      this.camera = this.createCamera();
    }
    this.createLight(light);
    if (helper) {
      this.createHelper();
    }
    this.renderer = this.createRender();
    const obControl = new OrbitControls(this.camera, this.renderer.domElement);
    obControl.enableRotate = false;
    obControl.enablePan = false;
    if (this._store.mode === "2d") {
      this.addFigures2d();
    } else if (this._store.mode === "3d") {
      this.addFigures3d();
    }
    this.controls = new CustomOrbitControls(
      this.mainContainer,
      this.renderer,
      this.options.config.earth?.dragConfig!
    );
    if (!this._store.config.enableZoom) {
      obControl.enableZoom = false;
    }
    this.animate();

    dom.appendChild(this.renderer.domElement);

  }

  /**
   * 创建正焦相机 
   * @returns {OrthographicCamera} The created orthographic camera.
   */
  createOrthographicCamera(): OrthographicCamera {
    const k = this.style.width / this.style.height;
    const s = 200;
    const camera = new OrthographicCamera(-s * k, s * k, s, -s, 1, 1500);
    camera.position.set(0, 0, 500);
    camera.lookAt(0, 0, 0);
    return camera;
  }

  /**
   * 创建场景
   * @returns {Scene} 
   */
  createScene(): Scene {
    return new Scene();
  }

  /**
   * 创建透视相机
   * @returns {PerspectiveCamera} The created perspective camera.
   */
  createCamera(): PerspectiveCamera {
    const camera = new PerspectiveCamera(
      95,
      this.style.width / this.style.height,
      1,
      1500
    );
    camera.position.set(350, 350, 350);
    camera.lookAt(new Vector3(0, 0, 0));
    return camera;
  }

  /**
   * 创建灯光
   * @param {string} lightType - The type of the light.
   */
  createLight(lightType: string) {
    const color: string = "#fff";
    if (lightType === "DirectionalLight") {
      const light = new DirectionalLight(color, 2.5); // 光强度， 原地光强度为1
      light.position.set(2000, 2000, 3000);
      // light.position.set(500, 500, 750);
      light.castShadow = true;
      this.scene.add(light);
    } else if (lightType === "AmbientLight") {
      const light = new AmbientLight(color, 1);
      this.scene.add(light);
    } else if (lightType == "PointLight") {
      const light = new PointLight(color, 1, 100);
      light.position.set(200, 200, 40);
      this.scene.add(light);
    }
  }

  createHelper() {
    const helper = new AxesHelper(250);
    this.scene.add(helper);
  }

  /**
   * 添加3d图形
   */
  addFigures3d() {
    const groupEarth = new CreateEarth(this._store).create();
    // 如果是混合纹理或者不使用纹理
    if (
      this.options.config.texture?.mixed ||
      !this.options.config.texture?.path
    ) {
      const mapShape = new MapShape(this);
      groupEarth.add(...mapShape.create());
    }
    if (this._store.config.spriteStyle.show) {
      this.mainContainer.add(sprite(this._store.getConfig()));
    }
    this.mainContainer.add(groupEarth);

    this.scene.add(this.mainContainer);
  }

  /**
   * 添加2d图形
   */
  addFigures2d() {
    const mapGroup = new Group();
    mapGroup.name = "mapGroup";
    const mapShape = new MapShape(this);
    mapGroup.add(...mapShape.create());
    this.mainContainer.add(mapGroup);
    this.scene.add(this.mainContainer);
  }

  /**
   * @returns {Group} The created cube.
   */
  createCube(): Group {
    const obj = new Group();
    obj.name = "mainContainer";
    return obj;
  }

  addWall(): Group {
    const obj = new Group();
    obj.name = "wall";
    return obj;
  }

  /**
   * 设置每秒的帧数
   * @param {boolean | undefined} isLimit - Whether to limit the frames per second.
   * @returns {Function} The function to check whether to render the next frame.
   */
  lockFps(isLimit: boolean = false): Function {
    const clock = new Clock();
    const FPS = 30;
    const renderT = 1 / FPS;
    let timeS = 0;
    return function () {
      if (!isLimit) return true;
      const T = clock.getDelta();
      timeS = timeS + T;
      if (timeS > renderT) {
        timeS = 0;
        return true;
      }
    };
  }
  /**
   * 创建渲染器
   * @returns {WebGLRenderer} The created renderer.
   */
  createRender(): WebGLRenderer {
    const renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(this.style.width, this.style.height);
    renderer.setClearColor(
      this.options.config.bgStyle?.color!,
      this.options.config.bgStyle?.opacity
    );
    return renderer;
  }

  /**
   * 判断场景是否需要旋转
   * @returns {boolean} Whether to rotate the scene.
   */
  shouldRotate(): boolean | undefined {
    if (this.options.mode === "3d") {
      if (this.options.config.stopRotateByHover) {
        if (this.earthHovered) {
          return false;
        } else {
          return this.options.autoRotate;
        }
      } else {
        return this.options.autoRotate;
      }
    } else {
      return false;
    }
  }

  /**
   * 场景动画
   */
  animate() {
    if (this.notLockFps()) {
      // tweenUpdate();
      this._store.updateGroup()
      if (this.shouldRotate()) {
        this.mainContainer.rotateY(this.options.rotateSpeed!);
      }
      this.renderer.render(this.scene, this.camera);
    }
    if (this.options.mode === "3d") {
      this.controls.update(); // 确保平滑效果
    }
    requestAnimationFrame(() => {
      this.animate();
    });
  }

  /**
   * 设置场景内的数据
   * @param {K} type - The type of the data.
   * @param {SetData[K]} data - The data to be set.
   */
  setData = async <K extends keyof SetData>(type: K, data: SetData[K]) => {
    try {
      const group = await this._OperateView.setData(type, data);
      this.mainContainer.add(...group);
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * 添加场景内的数据
   * @param {K} type - The type of the data.
   * @param {SetData[K]} data - The data to be added.
   */
  addData = async <K extends keyof SetData>(type: K, data: SetData[K]) => {
    try {
      const group = await this._OperateView.setData(type, data);
      this.mainContainer.add(...group);
    } catch (e) {
      console.log(e);
    }
  };

  /**
   * 移除场景内的数据
   * @param {string} type - The type of the data.
   * @param {string[] | "removeAll"} ids - The ids of the data to be removed.
   */
  remove(type: string, ids: string[] | "removeAll" = "removeAll") {
    this._OperateView.remove(this.mainContainer, type, ids);
  }
}