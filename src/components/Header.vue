<template>
  <div class="header" v-mouse-drag="handleDrag">
    <div @click="close">X</div>
    <div @click="max">口</div>
    <div @click="min">一</div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const { ipcRenderer } = require("electron");

const isMax = ref(false);
const handleDrag = ({ x, y }) => {
  ipcRenderer.send("move-main", { x, y });
};

const min = () => {
  ipcRenderer.send("mainwin-minize");
};

const max = () => {
  if (isMax.value) {
    ipcRenderer.send("mainwin-restore");
  } else {
    ipcRenderer.send("mainwin-maximize");
  }
  isMax.value = !isMax.value;
};

const close = () => {
  ipcRenderer.send("mainwin-close");
};
</script>

<style scoped>
.header {
  width: 100%;
  height: 50px;
  background: sandybrown;
  display: flex;
  align-items: center;
  flex-direction: row-reverse;
}

.header > div {
  margin: 0 20px;
  cursor: pointer;
}
</style>
