const path = require("path");
const fs = require("fs");

const savePath = "d:/records";
const mkdirDirectory = (path) => {
  return new Promise((resolve) => {
    if (!fs.existsSync(path)) {
      const res = fs.mkdirSync(path, { recursive: true });
      if (res) resolve(true);
    } else {
      resolve(true);
    }
  });
};

export const saveVideo = (blob) => {
  return new Promise((resolve, reject) => {
    const times = new Date().getTime();
    mkdirDirectory(savePath).then(() => {
      const videoPath = path.join(savePath, `${times}.mp4`);
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        const buffer = Buffer.from(reader.result);
        fs.writeFile(videoPath, buffer, {}, (err, res) => {
          if (err) return;
        });
      };
      reader.onerror = (err) => {
        reject(err);
      };

      reader.onloadend = () => {
        resolve();
      };
    });
  });
};

export const directoryFiles = () => {
  if (!fs.existsSync(savePath)) {
    return [];
  }
  const filenames = fs.readdirSync(savePath);
  const files = filenames.filter((file) => {
    const filePath = path.join(savePath, file);
    return fs.statSync(filePath).isFile();
  });

  return files
};
