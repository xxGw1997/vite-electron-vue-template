<script setup>
import { ref } from "vue";
import Header from "../components/Header.vue";
const { ipcRenderer } = require("electron");
const getSource = () => {
  return new Promise((resolve) => {
    ipcRenderer.send("recive-desktop");
    ipcRenderer.on("reply-source", (event, data) => {
      resolve(data);
    });
  });
};


const previewImg = ref('')
const getPreview = async () => {
  const source = await getSource();
  previewImg.value = source.thumbnail.toDataURL()
};

getPreview();
</script>
<template>
  <Header />
  <div class="home-content">
    <div class="container">
      <div class="screen-record">
        <div class="record-operate">
          <div class="button">
            <p class="start">结束</p>
          </div>
          <div class="time-box">
            <p class="time">123</p>
          </div>
        </div>
        <div class="list-box">
          <div class="video-list">
            <div class="video-item" v-for="item in 5" :key="item">
              <p class="item-opt name">456</p>
              <p class="item-opt play">播放</p>
              <p class="item-opt play">打开文件目录</p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <div class="screen-preview">
        <div class="img">
          <img :src="previewImg">
          <!-- <video :src="`http://localhost:9000/${videoUrl}`" controls v-else></video> -->
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.home-content {
  width: 100%;
  height: 100%;
  padding: 20px;
  .container {
    height: 100%;
    display: flex;
    border-radius: 4px;
  }
  .screen-record {
    flex: 1;
    height: 100%;
    position: relative;
    .record-operate {
      padding: 35px 20px;
      .button {
        width: 100px;
        height: 100px;
        margin: 0 auto;
        border-radius: 50%;
        overflow: hidden;
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        background: #f50101;
        cursor: pointer;
        .start {
          user-select: none;
          font-size: 20px;
          color: #fff;
        }
        &:hover {
          background: #ff5858;
        }
      }
      .time-box {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 20px;
        .time {
          font-size: 22px;
          font-weight: bold;
          color: #e34646;
        }
      }
    }
    .list-box {
      position: absolute;
      width: 100%;
      top: 218px;
      bottom: 0;
      .video-list {
        width: 100%;
        height: 1000px;
        border: 1px solid red;
        border-radius: 4px;
        padding: 0 20px;
        overflow-y: auto;
        .video-item {
          display: flex;
          padding: 0 20px;
          height: 50px;
          align-items: center;
          border-bottom: 1px solid #1d1d1d;
          .item-opt {
            flex: 1;
            text-align: center;
            &.play {
              cursor: pointer;
            }
          }
        }
      }
    }
  }
  .screen-preview {
    margin-left: 12px;
    width: 60%;
    height: 100%;
    background: #ccc;
    .img {
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      video {
        width: 100%;
      }
    }
    img {
      display: block;
      width: 100%;
    }
  }
}
</style>
