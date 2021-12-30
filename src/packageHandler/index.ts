import { writeFileSync } from "fs";
import os from "os";
import path from "path";
import shell from "shelljs";
import pjson from "./congfigTemplate/_package.js";
import { log } from "../util/decorators.js";
import logUtil from "../util/logUtil.js";
import { tryLogExit } from "../util/util.js";

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

  constructor(public appName: string, public features: Features[] = []) {
    this.initJSON = Object.assign({}, pjson, {
      name: appName,
      author: os.userInfo().username,
    });

    this.appAbsPath = path.resolve(process.cwd(), appName);

    // 检查yarn还是npm环境
    this.detectYarnOrNPM();
  }

  setFeatures(features: Features[]) {
    // features
    this.features = features;
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

    logUtil.error("没有监测到npm或yarn");
    process.exit(1);
  }

  /**
   * 在项目根目录写入文件
   * @param fileName 文件名称
   * @param content 文件内容
   */
  protected addFile(fileName: string, content: string) {
    writeFileSync(path.resolve(this.appAbsPath, `./${fileName}`), content);
  }

  protected installPackages(
    packageNames: string[],
    options: {
      saveDev?: boolean;
      save?: boolean;
    } = {
      saveDev: false,
      save: true,
    },
  ) {
    const packageNamesStr = packageNames.join(" ");
    let command = "";
    if (this.env === "yarn") {
      command = `yarn add ${packageNamesStr} ${options.saveDev ? "--dev" : ""}`;
    } else if (this.env === "npm") {
      command = `npm install ${packageNamesStr} ${
        options.saveDev ? "--save-dev" : ""
      }`;
    } else {
      logUtil.error("没有检测到yarn或者npm");
      process.exit(1);
    }

    tryLogExit(function () {
      shell.exec(command);
    }, `${packageNames.join(", ")}安装失败`);
  }

  @log
  protected installPackage(
    packageName: string,
    options: {
      saveDev?: boolean;
      save?: boolean;
      version?: string;
    } = {
      saveDev: false,
      save: true,
      version: "latest",
    },
  ) {
    if (this.env) {
      let command = "";
      if (this.env === "yarn") {
        command = `yarn add ${packageName}@${options.version ?? ""} ${
          options.saveDev ? "--dev" : ""
        }`;
      } else if (this.env === "npm") {
        command = `npm install ${packageName}@${options.version ?? ""} ${
          options.saveDev ? "--save-dev" : ""
        }`;
      }

      tryLogExit(shell.exec, `${packageName}安装失败`, command);
    } else {
      logUtil.error("没有检测到yarn或者npm");
      process.exit(1);
    }
  }
}
