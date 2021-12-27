import { resolve } from "path";
import { existsSync } from "fs";
import log from "./util/logUtil.js";

export default function createNewApp(name: string) {
  console.log("项目名字是", name);

  // 检查目录是否存在
  checkDirIsExist(name);
}

// 检查文件路径是否已经存在
function checkDirIsExist(appName: string) {
  const fullPath = resolve(process.cwd(), appName);
  if (existsSync(fullPath)) {
    log.error(`${fullPath} 路径已经已经存在`);
    process.exit(1);
  }
}
