import { resolve } from "path";
import { existsSync } from "fs";
import logUtil from "./util/logUtil.js";
import shell from "shelljs";

export class DirHanlder {
  checkDirIsExist(appName: string) {
    const fullPath = resolve(process.cwd(), appName);
    if (existsSync(fullPath)) {
      logUtil.error(`${fullPath} 路径已经已经存在`);
      process.exit(1);
    }
    logUtil.info(`路径 ${fullPath} 可以使用`);
    return fullPath;
  }

  createDir(path: string) {
    if (this.checkDirIsExist(path)) {
      shell.mkdir(path);
    }
  }
}

export default new DirHanlder();
