// 控制应用生命周期和创建原生浏览器窗口的模组
const {
  app,
  BrowserWindow,
  desktopCapturer,
  screen,
  ipcMain,
  shell,
} = require("electron");
const Main = require("electron/main");
const path = require("path");
const Dashboard = require("../src/wins/dashboard");
// import Launch from "../src/wins/launch";
const Launch = require("../src/wins/launch");
const Suspend = require("../src/wins/ball");
const { httpServer } = require("../src/utils/server");

const NODE_ENV = process.env.NODE_ENV;

function createWindow() {
  // 创建浏览器窗口
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 加载 index.html
  mainWindow.loadURL(
    NODE_ENV === "development"
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../dist/index.html")}`
  );
}

const getSize = () => {
  const { size, scaleFactor } = screen.getPrimaryDisplay();
  return {
    width: size.width * scaleFactor,
    height: size.height * scaleFactor,
  };
};
let dashboardPage, suspendBall;
app.on("ready", async () => {
  const launchPage = new Launch({
    width: 500,
    height: 300,
  });

  launchPage.on("show", () => {
    httpServer(() => {
      console.log("server is running...");
    });
    suspendBall = new Suspend({
      width: 80,
      height: 80,
    });

    dashboardPage = new Dashboard({
      width: 1000,
      height: 800,
    });

    dashboardPage.on("show", () => {
      launchPage.close();
    });
  });
});

ipcMain.on("startRecord", () => {
  dashboardPage.getWebContents().send("record-start");
  suspendBall.getWebContents().send("record-start");
});

ipcMain.on("stopRecord", () => {
  dashboardPage.getWebContents().send("record-stop");
  suspendBall.getWebContents().send("record-stop");
});

ipcMain.on("directory-open", (event, data) => {
  console.log(4565);
  const file = path.join("d:/records", data);
  shell.showItemInFolder(file);
});

ipcMain.on("recive-desktop", async (event) => {
  const sizeInfo = getSize();
  const source = await desktopCapturer.getSources({
    types: ["window", "screen"],
    thumbnailSize: sizeInfo,
  });
  event.reply("reply-source", source[0]);
});

// 这段程序将会在 Electron 结束初始化
// 和创建浏览器窗口的时候调用
// 部分 API 在 ready 事件触发后才能使用。
// app.whenReady().then(() => {
//   createWindow();

//   app.on("activate", function() {
//     // 通常在 macOS 上，当点击 dock 中的应用程序图标时，如果没有其他
//     // 打开的窗口，那么程序会重新创建一个窗口。
//     if (BrowserWindow.getAllWindows().length === 0) createWindow();
//   });
// });

// 除了 macOS 外，当所有窗口都被关闭的时候退出程序。 因此，通常对程序和它们在
// 任务栏上的图标来说，应当保持活跃状态，直到用户使用 Cmd + Q 退出。
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") app.quit();
});

// 在这个文件中，你可以包含应用程序剩余的所有部分的代码，
// 也可以拆分成几个文件，然后用 require 导入。
