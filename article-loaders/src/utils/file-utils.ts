import fs from "fs";
import path from "path";

export function listFilesInDirectory(filePath: string, extension: string = '.pdf'): Promise<string[]> {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      if (stats.isFile()) {
        resolve([path.resolve(filePath)]);
        return;
      } else if (stats.isDirectory()) {
        fs.readdir(filePath, function (err, files) {
          //handling error
          if (err) {
            const message = "Unable to scan directory: " + err;
            console.log(message);
            return reject(message);
          }

          const extensionToUse = extension.startsWith(".") ? extension : `.${extension}`
          const matchingFiles = files.filter(el => path.extname(el) === extensionToUse);
          resolve(matchingFiles.map((file) => path.resolve(`${filePath}/${file}`)));
        });
      } else {
        console.log("Something else");
        reject("Not a file or folder");
        return;
      }
    });
  });
}

export function createBlobFromFile(filePath: string) {
  return readFileToBuffer(filePath)
      .then(buffer => new Blob([buffer]));
}

function readFileToBuffer(filePath: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
      fs.readFile(filePath, (err, data) => {
          if (err) reject(err);
          else resolve(data);   
      });
  });
}