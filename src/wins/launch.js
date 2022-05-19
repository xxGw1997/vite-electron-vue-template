const { BrowserWindow } = require("electron");
// import { BrowserWindow } from "electron";
const events = require("events");
const path = require("path");
const NODE_ENV = process.env.NODE_ENV;

const winConfig = {
  show: false,
  frame: false,
  focusable: true,
  resizeable: false,
  webPreferences: {
    nodeIntergration: true,
    contextIsolation: false,
  },
};

class Launch extends events {
  constructor(confInfo) {
    super();
    this.confInfo = confInfo;
    this.conf = Object.assign({}, winConfig, confInfo);
    this.windowInstance = new BrowserWindow(this.conf);

    this.windowInstance.loadURL(
      //   NODE_ENV === "development"
      "http://localhost:3000/#/launchPage"
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
  }

  close() {
    if (this.windowInstance && this.windowInstance.isVisible) {
      this.windowInstance.close();
      this.windowInstance = null;
    }
  }
}

module.exports = Launch;
// export default Launch;
