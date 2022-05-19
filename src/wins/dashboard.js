const { BrowserWindow, ipcMain, app } = require("electron");
// import { BrowserWindow } from "electron";
const events = require("events");

const winConfig = {
  title: "录屏客户端",
  show: false,
  frame: false,
  resizable: true,
  focusable: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
};

class Dashboard extends events {
  constructor(confInfo) {
    super();
    this.confInfo = confInfo;
    this.conf = Object.assign({}, winConfig, confInfo);
    this.windowInstance = new BrowserWindow(this.conf);

    this.windowInstance.loadURL(
      //   NODE_ENV === "development"
      "http://localhost:3000/#/dashBoard"
      // : `file://${path.join(__dirname, "../dist/index.html/#/launchPage")}`
    );

    this.init();
  }

  init() {
    this.windowInstance.once("ready-to-show", () => {
      this.windowInstance.show();
    });

    this.windowInstance.on("show", () => {
      this.emit("show");
    });

    this.listenIpc();
  }

  listenIpc() {
    //最小化
    ipcMain.on("mainwin-minize", () => {
      this.windowInstance.minimize();
    });

    //最大化
    ipcMain.on("mainwin-maximize", () => {
      this.windowInstance.maximize();
    });

    //最大化还原
    ipcMain.on("mainwin-restore", () => {
      this.windowInstance.restore();
    });

    //关闭窗口
    ipcMain.on("mainwin-close", () => {
      app.quit();
    });

    ipcMain.on("move-main", (e, { x, y }) => {
      this.windowInstance && this.windowInstance.setPosition(x, y);
    });
  }
}

module.exports = Dashboard;
