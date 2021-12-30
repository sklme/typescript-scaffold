import inquirer, { CheckboxQuestion } from "inquirer";
import path from "path";
import dirHandler from "./dirHandler.js";
import logUtil from "./util/logUtil.js";
import shell from "shelljs";
import PackageInstaller from "./packageHandler/packInstaller.js";

interface FeatureCheckboxQuestion extends Omit<CheckboxQuestion, "choices"> {
  choices: {
    name: string;
    checked: boolean;
    value: Features;
  }[];
}

export default class AppIniter {
  // 选择的功能
  feats: string[] = [];

  // 模块初始化工具
  packageInstaller: PackageInstaller;
  constructor(public appName: string) {
    // 初始化工具
    this.packageInstaller = new PackageInstaller(appName);
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

    // 更新packageHandler的features
    this.packageInstaller.setFeatures(feats);

    // 开始安装包
    this.packageInstaller.main();
  }

  async chooseFeat() {
    const question: FeatureCheckboxQuestion = {
      type: "checkbox",
      name: "feature",
      message: "选择初始化的功能",
      choices: [
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
    };

    const { feature } = await inquirer.prompt(question);

    this.feats = feature as Features[];

    return feature as Features[];
  }
}
