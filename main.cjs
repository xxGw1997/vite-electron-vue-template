(async function() {
  globalThis.electron = await require("electron");
  await import("./electron/main.js");
})();
