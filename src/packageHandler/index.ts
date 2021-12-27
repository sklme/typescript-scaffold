import { readFileSync, writeFileSync } from "fs";
import os from "os";
import shell from "shelljs";
import pjson from "./congfigTemplate/_package.js";

interface PackageJSON {
  name: string;
  author: string;
  license: string;
  type: string;
  version: string;
  description: string;
  scripts: {};
  devDependencies: Record<string, string>;
  dependencies: Record<string, string>;
  [k: string]: any;
}

console.log(process.cwd());

export default class PackgeHandler {
  initJSON: PackageJSON;
  constructor(public appName: string) {
    this.initJSON = Object.assign({}, pjson, {
      name: appName,
      author: os.userInfo().username,
    });

    const yarnResult = shell.exec("yarn -v");
    console.log(yarnResult);
  }

  // todo 建立一个方法，决定yarn或者npm环境

  initPackageJSON() {
    // 初始化packge.json
    writeFileSync(
      "./package.json",
      JSON.stringify(this.initJSON, undefined, 2),
    );

    // 安装这些东西
  }

  initTypeScript() {}
}
