import { InitConfig, Options, StoreConfig, configType } from "../interface.d.ts";
import { Tween, Group} from "@tweenjs/tween.js";
class Store {
  mode: "2d" | "3d" = "3d";
  config: any = {
    ...InitConfig
  };
  // 存储已存在的飞线
  flyLineMap: Record<any, true> = {};
  TweenGroup: Group = new Group();

  setConfig(options: Partial<Options>) {
    this.mode = options.mode || "3d"; 
    this.config = {...this.config, ...options.config};
  }
  getConfig(): StoreConfig {
    return this.config as StoreConfig;
  }
  addTween(tween: Tween) {
    this.TweenGroup.add(tween);
  }
  updateGroup() {
    this.TweenGroup.update();
  }
}

export default Store