<template>
  <div id="econtainer"></div>
</template>

<script lang="ts" setup>
import { onMounted } from "vue";
import world from "./assets/map/world.json";
import chart from "./index";
import ChartScene from "./chartScene";

// initdata
const initData = [
  {
    from: {
      id: "1",
      lon: -23.0075,
      lat: 50.4296,
      style: {
        color: "#ff0000",
        duration: 2000,
        delay: 0,
        repeat: Infinity,
        onComplete: (data: any) => {
          //do something
        },
      },
    },
    to: { id: 2, lon: 26.1223, lat: -7.8756 },
  },
];
const initData1 = [
  {
    from: {
      id: "1",
      lon: -23.0075,
      lat: 50.4296,
    },
    to: { id: 2, lon: 26.1223, lat: -7.8756 },
  },
  {
    from: {
      lon: 142.8123,
      lat: -58.9813,
      style: {
        color: "yellow",
      },
    },
    to: {
      lon: 157.0064,
      lat: 10.7816,
      style: {
        color: "yellow",
      },
    },
    style: {
      pathStyle: {
        color: "yellow",
      },
      flyLineStyle: {
        color: "yellow",
      },
    },
  },
  {
    from: { lon: -175.6286, lat: 72.8359 },
    to: { lon: -39.071, lat: -35.438 },
  },
  {
    from: { lon: 178.7439, lat: 25.8303 },
    to: { lon: 137.19, lat: 17.118 },
  },
  {
    from: { lon: -162.6725, lat: 37.277 },
    to: { lon: -37.1681, lat: 38.5162 },
  },
  {
    from: { lon: -7.5945, lat: 37.2754 },
    to: { lon: 41.4114, lat: 41.5946 },
  },
];

let chartInstance1: ChartScene;
// 注册地图
chart.registerMap("world", world as any);
onMounted(() => {
  const dom = document.getElementById("econtainer");
  if (dom) {
    chartInstance1 = chart.init({
      dom: dom,
      helper: false,
      map: "world",
      autoRotate: true,
      mode: "3d",
      config: {
        enableZoom: true,
        stopRotateByHover: true,
        R: 120,
        earth: {
          color: "#13162c",
          dragConfig: {
            disableY: true,
          },
        },
        flyLineStyle: {
          duration: 5000,
        },
        bgStyle: {
          color: "#0e0c15",
        },
        spriteStyle: {
          // color: "#272335",
          color: "#797eff",
          show: true,
        },
      },
    });

    // 设置一根飞线
    chartInstance1.setData("flyLine", initData);

    // 设置多根飞线
    let i = 0;
    function polling() {
      setTimeout(() => {
        i++;
        if (i < initData1.length) {
          polling();
          chartInstance1.addData("flyLine", [initData1[i]]);
        }
      }, 1000);
    }
    polling();
  }
});
</script>

<style lang="scss" scoped>
#econtainer {
  width: 100%;
  height: 100vh;
}
</style>
