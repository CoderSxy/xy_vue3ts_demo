import { Feature } from "geojson";

class MapStore {
  hashMap: Record<any, Feature[]> = {};
  /**
   * 注册地图
   *
   * @param name 地图名称
   * @param json 地图特征数组
   */
  registerMap(name: string, json: Feature[]) {
    this.hashMap[name] = json;
  }
}
export default new MapStore();
