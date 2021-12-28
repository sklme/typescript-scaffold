import inquirer, { CheckboxQuestion } from "inquirer";
import path from "path";
import dirHandler from "./dirHandler.js";
import logUtil from "./util/logUtil.js";
import shell from "shelljs";
import PackageHandler from "./packageHandler/index.js";

export default class AppIniter {
  // 选择的功能
  feats: string[] = [];

  // 模块初始化工具
  packageHandler: PackageHandler;
  constructor(public appName: string) {
    // 初始化工具
    this.packageHandler = new PackageHandler(appName);
  }

  // 绝对路径
  get fullPath() {
    return this.appName ? path.resolve(process.cwd(), this.appName) : "";
  }

  async main() {
    // 创建目录，并且进入目录
    dirHandler.createDir(this.fullPath);
    // 进入这个目录
    shell.cd(this.fullPath);

    logUtil.info(`开始初始化${this.appName}...`);
    // 选择功能
    const feats = await this.chooseFeat();
    logUtil.info(`选择的功能:`, ...feats);

    // 初始化packge.json
    this.packageHandler.initPackageJSON();

    // 安装typescript系列
    this.packageHandler.initTypeScript();
  }

  async chooseFeat() {
    const { feature } = await inquirer.prompt([
      {
        type: "checkbox",
        name: "feature",
        message: "选择初始化的功能",
        choices: [
          {
            name: "eslint",
            value: "eslint",
            checked: true,
          },
          {
            name: "prettier",
            value: "prittier",
            checked: true,
          },
          {
            name: "husky and lint-staged",
            value: "husky",
            checked: true,
          },
          {
            name: "commitizen",
            value: "commitizen",
            checked: true,
          },
        ],
      } as CheckboxQuestion,
    ]);

    this.feats = feature as string[];

    return feature as string[];
  }
}
