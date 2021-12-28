import { writeFileSync } from "fs";
import os from "os";
import path from "path";
import shell from "shelljs";
import pjson from "./congfigTemplate/_package.js";
import { log } from "../util/decorators.js";

interface PackageJSON {
  name: string;
  author: string;
  license: string;
  type: string;
  version: string;
  description: string;
  scripts: Record<string, unknown>;
  devDependencies: Record<string, string>;
  dependencies: Record<string, string>;
  [k: string]: unknown;
}

export default class PackgeHandler {
  // 初始package.json
  initJSON: PackageJSON;
  // env
  env: "yarn" | "npm" | undefined;
  // 项目的绝对地址
  appAbsPath: string;

  constructor(public appName: string) {
    this.initJSON = Object.assign({}, pjson, {
      name: appName,
      author: os.userInfo().username,
    });

    this.appAbsPath = path.resolve(process.cwd(), appName);

    // 监测环境
    this.detectYarnOrNPM();
  }

  // 检查环境，决定使用npm或者yarn
  detectYarnOrNPM() {
    const yarnResult = shell.exec("yarn -v");
    if (yarnResult.code === 0) {
      this.env = "yarn";
      return "yarn";
    }

    const npmResult = shell.exec("npm -v");
    if (npmResult.code === 0) {
      this.env = "npm";
      return "npm";
    }

    process.exit(1);
  }

  /**
   * 初始化package.json
   */
  @log
  initPackageJSON() {
    // 初始化packge.json
    writeFileSync(
      path.resolve(this.appAbsPath, "./package.json"),
      JSON.stringify(this.initJSON, undefined, 2),
    );
  }

  /**
   * 初始化typescript环境
   */
  // initTypeScript() {}
}
