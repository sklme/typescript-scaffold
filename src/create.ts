import { resolve } from "path";
import { existsSync } from "fs";
import { listColors } from "./util/colorText";

listColors();

export default function createNewApp(name: string) {
  console.log("项目名字是", name);

  // 检查目录是否存在
  checkDirIsExist(name);
}

// 检查文件路径是否已经存在
function checkDirIsExist(appName: string) {
  const fullPath = resolve(process.cwd(), appName);
  if (existsSync(fullPath)) {
    console.log(`${fullPath} 目录已经存在`);
    process.exit(1);
  }
  console.log(fullPath);
}
