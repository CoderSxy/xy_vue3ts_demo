import {
  Group,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  MeshMatcapMaterial,
  MeshPhongMaterial,
  SphereGeometry,
  TextureLoader,
} from "three";
import type { StoreConfig } from "../interface.d.ts";
import Store from "../store/store.ts";
import { Texture } from "three";

class CreateEarth {
  // 材质映射 各种材质
  materialMap: Record<string, any> = {
    MeshPhongMaterial: () => {
      return new MeshPhongMaterial({
        ...this._config.earth
      });
      // const res = new MeshPhongMaterial({
      //   ...this._config.earth
      // });
      // console.log('res',res )
      // return res 
    },
    MeshBasicMaterial: () => {
      return new MeshBasicMaterial({
        ...this._config.earth,
      });
    },
    MeshLambertMaterial: () => {
      return new MeshLambertMaterial({
        ...this._config.earth,
      });
    },
    MeshMatcapMaterial: () => {
      return new MeshMatcapMaterial({
        ...this._config.earth,
      });
    },

    // 默认用光泽材质 反光好看一点
    default: () => {
      return new MeshPhongMaterial({
        ...this._config.earth,
      });
    },
  }
  private _config: StoreConfig;
  constructor(store: Store) {
    this._config = store.getConfig();
  }
  createSphereMesh() {
    // three.js创建球体
    const geometry = new SphereGeometry(this._config.R - 1 , 39, 39);
    // 获取材质
    const material = this.materialMap[this._config.earth.material]();
    // 网格模型对象Mesh
    const earthMesh = new Mesh(geometry, material); 
    earthMesh.castShadow = true;
    earthMesh.name = "earthMesh";
    return earthMesh;
  }
  // 创建球体纹理
  createTextureSphereMesh() {
    const materialConfig: { map: Texture} = {
      // 地图纹理路径
      map: new TextureLoader().load(this._config.texture?.path)
    }
    // 设置颜色空间
    materialConfig.map.colorSpace = "srgb";
    // 创建一个球体 与 上面创建球体实例一样
    const geometry = new SphereGeometry(this._config.R - 1, 39, 39);
    // 材质
    const material = new MeshBasicMaterial({...materialConfig});
    // 带纹理材质的球体网格
    const earthMesh = new Mesh(geometry, material);
    earthMesh.castShadow = true;
    earthMesh.name = "earthMesh";
    return earthMesh;
  }
  // 创建一个地球总对象earthGroup
  create() {
    const earthGroup = new Group();
    if(this._config.texture?.path) {
      // 存在路径 创建一个带路径的球体
      earthGroup.add(this.createTextureSphereMesh());
    }else {
      // 普通光泽球体
      earthGroup.add(this.createSphereMesh());
    }
    earthGroup.name = "mapGroup";
    return earthGroup;
  }
}
export default CreateEarth;