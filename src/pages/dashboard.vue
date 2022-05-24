<script setup>
import { ref } from "vue";
import Header from "../components/Header.vue";
import { saveVideo, directoryFiles } from "../utils/helper";
const { ipcRenderer } = require("electron");
const getSource = () => {
  return new Promise((resolve) => {
    ipcRenderer.send("recive-desktop");
    ipcRenderer.on("reply-source", (event, data) => {
      resolve(data);
    });
  });
};

const previewImg = ref("");
const getPreview = async () => {
  const source = await getSource();
  previewImg.value = source.thumbnail.toDataURL();
};

getPreview();

const timer = ref(null);
const timestamp = ref(0);

const countDown = () => {
  timestamp.value++;
  timer.value = setTimeout(() => {
    countDown();
  }, 1000);
};

const transTime = (time) => {
  const h = Math.floor(time / 3600);
  const m = Math.floor((time % 3600) / 60);
  const s = Math.floor((time % 3600) % 60);
  return `${h > 10 ? h : "0" + h}:${m > 10 ? m : "0" + m}:${
    s > 10 ? s : "0" + s
  }`;
};

const recorder = ref(null);
const isRecord = ref(false);
const showFiles = ref([]);
showFiles.value = directoryFiles();
const recordStart = (stream) => {
  countDown();
  isRecord.value = true;
  let blobSlice = [];
  recorder.value = new MediaRecorder(stream, {
    mimeType: "video/webm",
  });
  if (recorder.value) {
    recorder.value.start(1000);
    recorder.value.ondataavailable = (e) => {
      blobSlice.push(e.data);
    };

    recorder.value.onstop = async () => {
      isRecord.value = false;
      const blob = new Blob([...blobSlice], {
        type: "video/webm",
      });
      saveVideo(blob).then(() => {
        alert("保存成功");
        showFiles.value = directoryFiles();
      });
    };

    recorder.value.onerror = (e) => {};
  }
};

const sourceStart = async () => {
  if (isRecord.value) {
    ipcRenderer.send("stopRecord");
    return;
  }
  ipcRenderer.send("startRecord");
};

ipcRenderer.on("record-stop", () => {
  timer.value && clearTimeout(timer.value);
  timestamp.value = 0;
  recorder.value && recorder.value.stop();
});

ipcRenderer.on("record-start", async () => {
  const source = await getSource();

  const stream = await navigator.mediaDevices.getUserMedia({
    video: {
      mandatory: {
        chromeMediaSource: "desktop",
        chromeMediaSourceId: source.id,
        minWidth: 1280,
        maxWidth: 1280,
        minHeight: 720,
        maxHeight: 720,
      },
    },
  });
  recordStart(stream);
});

const videoUrl = ref("");
const handlePlay = (file) => {};

const openDir = (item) => {
  ipcRenderer.send("directory-open", item);
};
</script>
<template>
  <Header />
  <div class="home-content">
    <div class="container">
      <div class="screen-record">
        <div class="record-operate">
          <div class="button" @click="sourceStart">
            <p class="start">{{ isRecord ? "结束" : "开始" }}</p>
          </div>
          <div class="time-box">
            <p class="time">{{ transTime(timestamp) }}</p>
          </div>
        </div>
        <div class="list-box">
          <div class="video-list">
            <div
              class="video-item"
              v-for="(file, index) in showFiles"
              :key="index"
            >
              <p class="item-opt name">{{ file }}</p>
              <p class="item-opt play" @click="handlePlay(file)">播放</p>
              <p class="item-opt play" @click="openDir(file)">打开文件目录</p>
              <p></p>
            </div>
          </div>
        </div>
      </div>
      <div class="screen-preview">
        <div class="img">
          <img :src="previewImg" v-if="videoUrl === ''" />
          <video
            :src="`http://localhost:9000/${videoUrl}`"
            controls
            v-else
          ></video>
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
