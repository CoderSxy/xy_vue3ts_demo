<template>
  <div ref="ctnRef" class="comtainer">
    <section
      class="ctn-item"
      v-for="item in dataList"
      :style="{ backgroundImage: 'url(src/assets/img/' + item.url + ')' }"
    >
      <h1 style="color: #fff">{{ item.title }}</h1>
    </section>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
const ctnRef = ref<HTMLDivElement | null>(null);
gsap.registerPlugin(ScrollTrigger);
const props = defineProps({
  dataList: {
    type: Object,
    default: () => {
      return [
        {
          title: "只因你太美？",
          url: "bingImg1.jpg",
        },
        {
          title: "oh baby",
          url: "bingImg2.jpg",
        },
        {
          title: "所有人都在看着你",
          url: "bingImg3.jpg",
        },
        {
          title: "再多一眼看一眼就会爆炸",
          url: "bingImg4.jpg",
        },
        {
          title: "再近一点靠近点快被融化",
          url: "bingImg5.jpg",
        },
      ];
    },
  },
});
onMounted(() => {
  if (ctnRef.value && ctnRef.value.children) {
    const array: Element[] = Array.from(ctnRef.value.children);
    console.log(array);
    array.forEach((dom) => {
      gsap.fromTo(
        dom,
        {
          backgroundPositionY: `-${window.innerHeight / 2}px`,
        },
        {
          backgroundPositionY: `${window.innerHeight / 2}px`,
          ease: "none",
          scrollTrigger: {
            trigger: dom,
            scrub: true,
          },
        }
      );
    });
  }
});
</script>

<style lang="scss" scoped>
.comtainer {
  padding: 0;
  margin: 0;
  width: 100%;
  .ctn-item {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
}
</style>
