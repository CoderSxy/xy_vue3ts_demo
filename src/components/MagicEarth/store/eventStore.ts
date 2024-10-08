import ChartScene from "../chartScene";
import {
  Color,
  Group,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Raycaster,
  Vector2,
} from "three";
import world from "../assets/map/world.json";

class EventStore {
  // 事件映射
  eventMap: Record<
    string,
    (event: Event, mesh: Object3D | Group | Mesh | undefined) => void
  > = {};
  // buildIn事件映射
  buildInEventMap: Record<
    string,
    (event: Event, mesh: Object3D | Group | Mesh | undefined) => void
  > = {};
  _chartScene: ChartScene;
  currentMesh: Mesh | null = null;
  currentColor: Color = {} as Color;
  areaColorNeedChange: boolean | undefined = false;
  constructor(chartScene: ChartScene) {
    this._chartScene = chartScene;
    //需要hover事件
    this.areaColorNeedChange =
      this._chartScene.options.config &&
      this._chartScene.options.config.hoverRegionStyle &&
      Object.keys(this._chartScene.options.config?.hoverRegionStyle).length > 0;
    // 注册mousemove事件
    this.registerBuildInEventMap("mousemove", () => {
      // this.registerBuildInEventMap("mouseup", () => {
      if (this.areaColorNeedChange) {
        if (this.currentMesh) { 
          (this.currentMesh.material as MeshBasicMaterial).color.set(
            this.currentMesh.userData.backupColor
          );
          (this.currentMesh.material as MeshBasicMaterial).opacity =
            this.currentMesh.userData.opacity;
        }
      }
    });
    // this.registerBuildInEventMap("mouseup", () => {
    //   if (this.currentMesh&&this.currentMesh.userData?.name) { 
    //     console.log('this.currentMesh', this.currentMesh)
    //     const countryData = this.getCountryJson(this.currentMesh.userData.name)
    //     if(countryData){
    //       // this._chartScene.remove("mapStreamLine");
    //       countryData.forEach((item: any) => {
    //         this._chartScene.addData("mapStreamLine", {
    //           data: item,
    //           style: {
    //             opacity: 1,
    //           },
    //         });
    //       });
    //     }
    //   }
    // })
  }
  // 注册事件
  registerEventMap(
    eventName: string,
    cb: (event: Event, mesh: Object3D | Group | Mesh | undefined) => void
  ) {
    this.eventMap[eventName] = cb;
    this._chartScene.options.dom.addEventListener(eventName, ((
      event: MouseEvent
    ) => {
      this.notification(event);
    }) as EventListener);
  }
  // 注册buildIn事件
  registerBuildInEventMap(eventName: string, cb: () => void) {
    this._chartScene.options.dom.addEventListener(eventName, ((
      event: MouseEvent
    ) => {
      const eventMesh = this.handleRaycaster(event);
      //说明hover的是地球
      if (eventMesh && eventMesh.type !== "TransformControlsPlane") {
        this._chartScene.earthHovered = true;
      } else {
        this._chartScene.earthHovered = false;
      }
      cb();
      if (
        eventMesh &&
        eventMesh.userData.type === "country" &&
        this.areaColorNeedChange
      ) {
        this.buildInEventMap[eventName] = cb;

        this.currentMesh = eventMesh;
        (this.currentMesh.material as MeshBasicMaterial).color.set(
          this._chartScene.options.config!.hoverRegionStyle!.areaColor!
        );

        (this.currentMesh.material as MeshBasicMaterial).opacity =
          this._chartScene.options.config!.hoverRegionStyle!.opacity!;
      } else {
        this.currentMesh = null;
      }
    }) as EventListener);
  }
  //  通知响应对应事件的函数
  notification(event: MouseEvent) {
    const eventMesh = this.handleRaycaster(event);
    if (eventMesh) {
      this.eventMap[event.type](event, eventMesh);
    }
  }
  // 获取鼠标位置
  getMousePosition(event: MouseEvent) {
    const rect = this._chartScene.renderer.domElement.getBoundingClientRect();
    return {
      clientX: ((event.clientX - rect.left) / rect.width) * 2 - 1,
      clientY: -((event.clientY - rect.top) / rect.height) * 2 + 1,
    };
  }

  handleRaycaster(event: MouseEvent) {
    const mouse = this.getMousePosition(event);
    const Sx = mouse.clientX; //鼠标单击位置横坐标
    const Sy = mouse.clientY; //鼠标单击位置纵坐标
    //屏幕坐标转WebGL标准设备坐标
    const raycaster = new Raycaster();
    raycaster.setFromCamera(new Vector2(Sx, Sy), this._chartScene.camera);
    const intersects = raycaster.intersectObjects(
      this._chartScene.scene.children,
      true
    );
    if (intersects.length > 0) {
      // if(intersects[0].object.isTransformControls)
      return intersects[0].object as Mesh;
    }
  }

  getCountryJson(name: string) {
    const countryData = world.features.find((item: any) => {
      return item.properties.name === name;
    })!.geometry.coordinates as any;
    return countryData
  }
}
export default EventStore;
