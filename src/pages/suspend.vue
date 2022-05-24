<script setup>
import { ref, onMounted } from "vue";
// import { timestampToTime } from "@/utils/utils";
const { ipcRenderer } = require("electron");
const timestamp = ref(0);
const timer = ref(null);
const isRecord = ref(false);
const countDown = () => {
  timestamp.value++;
  timer.value = setTimeout(() => {
    countDown();
  }, 1000);
};
const startCount = () => {
  if (!isRecord.value) {
    isRecord.value = true;
    countDown();
  }
};
// const timeFormat = (timestamp) => {
//   return timestampToTime(timestamp);
// };
ipcRenderer.on("record-start", () => {
  startCount();
});
ipcRenderer.on("record-stop", () => {
  clearTimeout(timer.value);
  timestamp.value = 0;
  isRecord.value = false;
});
const handleDrag = (pos) => {
  ipcRenderer.send("move-suspend", {
    x: pos.x,
    y: pos.y,
  });
};
const ballRef = ref();
onMounted(() => {
  ballRef.value.addEventListener("dblclick", function(e) {
    console.log("双击");
    e.preventDefault();
    ipcRenderer.send("main-show");
  });
});
</script>
<template>
  <div class="suspend-page" v-mouse-drag="handleDrag">
    <div class="ball" ref="ballRef">{{timestamp}}</div>
  </div>
</template>
<style lang="scss">
html,
body {
  position: relative;
  .suspend-page {
    width: 100%;
    height: 100%;
    position: absolute;
    user-select: none;
    padding: 3px;
    .ball {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #5bc6ef;
      box-shadow: 0 0 2px 2px #fcfeff;
      color: #fff;
    }
  }
}
</style>
