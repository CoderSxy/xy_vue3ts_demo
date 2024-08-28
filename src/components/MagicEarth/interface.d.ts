// 类型声明文件 

import { Group } from "three";
import { Position } from "geojson";
// 颜色
type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX | string;

// 地图初始化配置类型
export const InitConfig = {
  R: 160,
  enableZoom: true,
  earth: {
    color: "#13162c",
    material: "MeshPhongMaterial",
    dragConfig: {
      rotationSpeed: 1,
      inertiaFactor: 0.95,
      disableX: false,
      disableY: false,
    },
  },
  map: "world",
  stopRotateByHover: true,
  texture: {
    path: "",
    mixed: false,
  },
  bgStyle: {
    color: "#040D21",
    opacity: 1,
  },
  mapStyle: {
    areaColor: "#2e3564",
    lineColor: "#797eff",
    opacity: 1.0,
  },
  spriteStyle: {
    color: "#797eff",
    show: true,
  }, //光圈
  pathStyle: {
    color: "#cd79ff", //飞线路径配置
    show: true,
    size: 500
  },
  flyLineStyle: {
    //飞线样式配置
    color: "#cd79ff",
  },
  roadStyle: {
    //道路样式配置
    flyLineStyle: {
      color: "#cd79ff",
    },
    pathStyle: {
      color: "#cd79ff",
    },
  },
  hoverRegionStyle: {
    areaColor: "#cd79ff",
    opacity: 1,
  },
  scatterStyle: {
    //涟漪
    color: "#cd79ff",
  },
  wallStyle: {
    color: "#cd79ff",
    opacity: 0.5,
    height: 2,
    width: 2,
  },
  mapStreamStyle: {
    color: "#f0f0f0",
    opacity: 0.5,
    speed: 1,
    splitLine: 3,
  },
};

// 地图实例选项
export interface Options {
  dom: HTMLElement;
  map: string;
  cameraType?: string;
  mode?: "2d" | "3d";
  helper?: boolean;
  limitFps?: boolean;
  autoRotate?: boolean;
  rotateSpeed?: number;
  light?: "AmbientLight" | "PointLight" | "DirectionalLight" | "RectAreaLight";
  config: Partial<configType>;
}
export type StoreConfig = typeof InitConfig & configType;
// 动画实例动画效果参数类型
export interface TweenParams {
  from: {
    size?: number;
    color?: Color;
    opacity?: number;
  };
  to: {
    size?: number | number[];
    color?: Color | Color[];
    opacity?: number | number[];
  };
}
// 动画属性配置参数
export interface TweenConfig {
  duration?: number;
  delay?: number;
  repeat?: number;
  onComplete?: (data: any) => void;
  customFigure?: {
    texture: string;
    animate?: false | TweenParams;
  };
}
export interface PathStyle {
  color: Color;
  size: number;
  show: boolean;
}
export interface FlyLineStyle extends TweenConfig {
  color: Color;
  size: number;
}
export interface ScatterStyle extends TweenConfig {
  color: Color;
  size?: number;
}
// 点位 经纬度？
export interface LessCoordinate {
  lon: number;
  lat: number;
}
export interface Coordinates extends LessCoordinate {
  id?: string | number;
  style?: ScatterStyle;
  [key: string]: any;
}
export interface LineStyle {
  flyLineStyle: Partial<FlyLineStyle>;
  pathStyle: Partial<PathStyle>;
}
export interface RoadStyle {
  flyLineStyle: Partial<FlyLineStyle>;
  pathStyle: Partial<PathStyle>;
}
export interface SpriteStyle {
  color: Color;
  show?: boolean;
  size?: number;
}
// 拖拽配置
export interface DragConfig {
  rotationSpeed: number;
  inertiaFactor: number;
  disableX: boolean;
  disableY: boolean;
}
// 地球
export interface Earth {
  color: Color;
  material?:
    | "MeshPhongMaterial"
    | "MeshBasicMaterial"
    | "MeshLambertMaterial"
    | "MeshMatcapMaterial"
    | "MeshNormalMaterial";
  dragConfig?: Partial<DragConfig>;
}

interface MapStyle {
  areaColor?: Color;
  lineColor?: Color;
  opacity?: number | undefined;
}
// 地区基础样式
export interface RegionBaseStyle {
  areaColor?: Color;
  opacity?: number | undefined;
  show?: boolean;
}
// 地区样式映射
type RegionsStyle = Record<string, RegionBaseStyle>;
// 整体配置类型
export interface configType {
  R: number;
  map: string;
  texture?: {
    path: string;
    mixed: boolean;
  };
  enableZoom?: boolean;
  stopRotateByHover: boolean;
  bgStyle: {
    color: Color;
    opacity?: number;
  };
  earth: Earth;
  mapStyle: MapStyle;
  spriteStyle: SpriteStyle;
  pathStyle: Partial<PathStyle>;
  flyLineStyle: Partial<FlyLineStyle>;
  scatterStyle: Partial<ScatterStyle>;
  roadStyle: Partial<RoadStyle>;
  regions?: RegionsStyle;
  hoverRegionStyle?: RegionBaseStyle;
  wallStyle: Partial<WallStyle>;
  mapStreamStyle: Partial<MapStreamStyle>;
}
// 3d点位
export interface Coordinates3D {
  x: number;
  y: number;
  z: number;
}
// 飞线数据类型
export interface FlyLineData {
  from: Coordinates;
  to: Coordinates;
  style?: Partial<LineStyle>;
  [key: string]: any;
}
// 路线数据
export interface RoadData {
  path: LessCoordinate[];
  style?: Partial<RoadStyle>;
  id: string | number;
}
// 地图流线类型
export interface WallStyle {
  color: Color;
  opacity: number;
  height: number;
  width: number;
}
export interface MapStreamStyle {
  color: Color;
  opacity: number;
  speed: number;
  splitLine: number;
}
// 设置数据中参数的实例
export interface SetData {
  flyLine: FlyLineData[];
  point: Coordinates[];
  road: RoadData[];
  wall: {
    data: Position[][];
    style?: Partial<WallStyle>;
  };
  mapStreamLine: {
    data: Position[][];
    style?: Partial<MapStreamStyle>;
  };
}
export type OptDataFunc = (
  type: keyof SetData,
  data: any,
  mainContainer?: Group
) => Promise<Group[]>;
