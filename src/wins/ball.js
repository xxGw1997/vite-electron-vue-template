const { BrowserWindow, ipcMain } = require("electron");
const events = require("events");

const winConfig = {
  frame: false,
  transparent: true,
  alwaysOnTop: true,
  focusable: false,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false,
  },
};

class SuspendBall extends events {
  constructor(confInfo) {
    super();
    this.confInfo = confInfo;
    this.conf = Object.assign({}, winConfig, confInfo);
    this.windowInstance = new BrowserWindow(this.conf);

    this.windowInstance.loadURL(
      //   NODE_ENV === "development"
      "http://localhost:3000/#/suspend"
      // : `file://${path.join(__dirname, "../dist/index.html/#/suspend")}`
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
    this.listIpc();
  }

  listIpc() {
    ipcMain.on("move-suspend", (event, pos) => {
      this.windowInstance && this.windowInstance.setPosition(pos.x, pos.y);
    });
  }

  getWebContents() {
    return this.windowInstance.webContents;
  }
}

module.exports = SuspendBall;
