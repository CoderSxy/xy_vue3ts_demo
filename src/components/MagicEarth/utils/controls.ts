import { Object3D, Raycaster, Renderer, Vector2, Vector3 } from "three";
import { DragConfig } from "../interface.d.ts";

// 地球控制类
export default class EarthController {
  earth: Object3D;
  isDragging: boolean;
  previousMousePosition: {
    x: number;
    y: number;
  };
  raycaster: Raycaster;
  options: DragConfig = {
    rotationSpeed: 1,
    inertiaFactor: 0.95,
    disableX: false,
    disableY: false,
  };
  rotationVelocity: {
    x: number;
    y: number;
  };
  mouse: Vector2 = {} as Vector2;
  deviceType: string = "pc";
  constructor(
    earth: Object3D,
    renderer: Renderer,
    options: Partial<DragConfig>
  ) {
    this.earth = earth;
    this.isDragging = false;
    this.previousMousePosition = { x: 0, y: 0 };
    Object.assign(this.options, options);
    this.options.inertiaFactor > 1
      ? (this.options.inertiaFactor = 1)
      : this.options.inertiaFactor;
    this.raycaster = new Raycaster();
    this.rotationVelocity = { x: 0, y: 0 };
    renderer.domElement.addEventListener(
      "mousedown", 
      this.onMouseDown.bind(this),
      false
    );
    renderer.domElement.addEventListener(
      "mousemove",
      this.onMouseMove.bind(this),
      false
    );
    renderer.domElement.addEventListener(
      "mouseup",
      this.onMouseUp.bind(this),
      false
    );
    renderer.domElement.addEventListener(
      "touchstart", 
      this.onMouseDown.bind(this),
      false
    );
    renderer.domElement.addEventListener(
      "touchmove",
      this.onMouseMove.bind(this),
      false
    );
    renderer.domElement.addEventListener(
      "touchend",
      this.onMouseUp.bind(this),
      false
    );
  }
  onMouseDown(event: MouseEvent | TouchEvent) {
    this.isDragging = true;
    // this.previousMousePosition.x = event.clientX;
    // this.previousMousePosition.y = event.clientY;
    if (event instanceof MouseEvent) {
      // 处理 MouseEvent
      this.previousMousePosition.x = event.clientX;
      this.previousMousePosition.y = event.clientY;
      this.deviceType = "pc";

    } else if (event instanceof TouchEvent) {
      // 处理 TouchEvent
      // 假设我们只处理第一个触摸点
      if (event.touches.length > 0) {
          const touch = event.touches[0];
          this.previousMousePosition.x = touch.clientX;
          this.previousMousePosition.y = touch.clientY;
      }
      this.deviceType = "mobile";
    }
  }
  // onMouseMove(event: MouseEvent) {
  //   if (this.isDragging) {
  //     const deltaX = event.clientX - this.previousMousePosition.x;
  //     const deltaY = event.clientY - this.previousMousePosition.y;
  //     if (!this.options.disableY) {
  //       this.rotationVelocity.x = deltaY * this.options.rotationSpeed * 0.005;
  //     }
  //     if (!this.options.disableX) {
  //       this.rotationVelocity.y = deltaX * this.options.rotationSpeed * -0.005;
  //     }

  //     this.earth.rotateOnWorldAxis(
  //       new Vector3(0, 1, 0),
  //       -this.rotationVelocity.y
  //     );
  //     this.earth.rotateX(this.rotationVelocity.x);

  //     this.previousMousePosition.x = event.clientX;
  //     this.previousMousePosition.y = event.clientY;
  //   }
  // }
  onMouseMove(event: MouseEvent | TouchEvent) {

    if (!this.isDragging) {
        return; // 如果不是拖拽状态，则不执行任何操作
    }
    let clientX = 0;
    let clientY = 0;

    // 判断事件类型并获取坐标
    if (event instanceof MouseEvent) {
        clientX = event.clientX;
        clientY = event.clientY;
    } else if (event instanceof TouchEvent && event.touches.length > 0) {
        // 获取第一个触摸点的坐标
        const touch = event.touches[0];
        clientX = touch.clientX;
        clientY = touch.clientY;
    }

    // 计算位移
    const deltaX = clientX - this.previousMousePosition.x;
    const deltaY = clientY - this.previousMousePosition.y;

    // 根据选项调整旋转速度
    if (!this.options.disableY) {
        this.rotationVelocity.x = deltaY * this.options.rotationSpeed * 0.005;
    }
    if (!this.options.disableX) {
        this.rotationVelocity.y = deltaX * this.options.rotationSpeed * -0.005;
    }

    // 旋转地球
    this.earth.rotateOnWorldAxis(new Vector3(0, 1, 0), -this.rotationVelocity.y);
    this.earth.rotateX(this.rotationVelocity.x);

    // 更新上一次鼠标/触摸位置
    this.previousMousePosition.x = clientX;
    this.previousMousePosition.y = clientY;
  }   
  onMouseUp(event: MouseEvent | TouchEvent) {
    // console.log('mouseup', event instanceof MouseEvent, event instanceof TouchEvent)

    // if (event instanceof MouseEvent) {
    //   this.isDragging = false;
    // } else if (event instanceof TouchEvent && event.touches.length > 0) {
    //   console.log('event.touches',event.touches)
    //   if (event.touches.length > 1) {
    //     this.isDragging = false;
    //   }else {
    //     this.isDragging = false ;
    //   }
    // }
    if(this.deviceType === 'mobile'){
      this.isDragging = false;
      console.log('mouseup', this.deviceType, event instanceof MouseEvent, event instanceof TouchEvent)
      if(event instanceof MouseEvent) {
        event.preventDefault()
        return 
      }
    }else if(this.deviceType === 'pc') {
      this.isDragging = false;
      console.log('mouseup', this.deviceType, event instanceof MouseEvent, event instanceof TouchEvent)
    }
    // this.isDragging = false;
  }

  isDraggingEarth(event: MouseEvent) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 更新射线与摄像机和鼠标位置
    // raycaster.setFromCamera(this.mouse, camera);

    // 检查射线与地球的交点
    const intersects = this.raycaster.intersectObject(this.earth);
    return intersects.length > 0;
  }

  update() {
    if (!this.isDragging) {
      this.earth.rotateOnWorldAxis(
        new Vector3(0, 1, 0),
        -this.rotationVelocity.y
      );
      this.earth.rotateX(this.rotationVelocity.x);
      this.rotationVelocity.x *= this.options.inertiaFactor;
      this.rotationVelocity.y *= this.options.inertiaFactor;
    }
  }
}