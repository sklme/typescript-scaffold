import PackgeHandler from "./index.js";
import shell from "shelljs";
import tsconfig from "./congfigTemplate/_tsconfig.js";
import eslintConfig from "./congfigTemplate/_eslintrc.js";
import prettierConfig from "./congfigTemplate/_prettierrc.js";
import { log } from "../util/decorators.js";
import { tryLogExit } from "../util/util.js";
import { trim, trimLeastSpace } from "../util/templateLiteralsHelper.js";
import gitignore from "./congfigTemplate/_gitignore.js";
import npmrc from "./congfigTemplate/_npmrc.js";
import nvmrc from "./congfigTemplate/_nvmrc.js";
import czrc from "./congfigTemplate/_czrc.js";

export default class PackageInstaller extends PackgeHandler {
  /**
   * 根据配置，安装选择的包
   */
  main() {
    // 基本配置
    this.initConfig();
    // 初始文件树
    this.initFileTree();
    // 初始化packgeJSON
    this.initPackageJSON();
    // 安装typescript
    this.initTypeScript();
    // 安装lint工具
    this.initEslintAndPrettier();
    // 选择是否安装husky
    if (this.features.includes("husky")) {
      this.initHusky();
    }
    // 选择是否安装commitizen
    if (this.features.includes("commitizen")) {
      this.initCommitizen();
    }
    // git提交初始化的文件
    this.gitCommit();
  }

  @log
  gitCommit() {
    tryLogExit(() => {
      shell.exec("git add .");
      shell.exec("git commit -m 'feat: init'");
    }, "commit提交失败");
  }

  @log("创建初始文件")
  initFileTree() {
    // 创建目录
    tryLogExit(function () {
      shell.mkdir("./src");
      shell.mkdir("./src/util");
      shell.mkdir("./src/typings");
    }, "创建初始文件失败");

    const index = trimLeastSpace`
      import log from "./util/log.js";
      log();`;

    const log = trimLeastSpace`
      export default function() {
        console.log("成功创建。");
      }`;

    this.addFile("./src/index.ts", index);
    this.addFile("./src/util/log.ts", log);
    this.addFile("./src/typings/type.d.ts", "");
  }

  @log("基本配置安装")
  initConfig() {
    // git
    tryLogExit(function () {
      shell.exec("git init");
    }, "git初始化失败");

    this.addFile(".npmrc", npmrc);
    this.addFile(".nvmrc", nvmrc);
    this.addFile(".gitignore", gitignore);
  }

  /**
   * 初始化package.json
   */
  @log
  initPackageJSON() {
    // 初始化packge.json
    this.addFile("package.json", JSON.stringify(this.initJSON, undefined, 2));
  }

  /**
   * 初始化typescript环境
   */
  @log("typeScript安装")
  initTypeScript() {
    // 安装typescript相关的包
    this.installPackages(
      [
        "typescript",
        "@tsconfig/node16", // 官方推荐node16配置
        "@tsconfig/recommended", // 官方推荐配置
        "@types/node", // node的type定义文件
        "concurrently", // 开发工具
        "nodemon", // 开发工具
      ],
      {
        saveDev: true,
      },
    );

    // 安装必要的reflect-metadata
    this.installPackage("reflect-metadata");

    // 写入typescript的配置
    this.addFile("tsconfig.json", JSON.stringify(tsconfig, undefined, 2));
    // npm 增加开发的脚本
    shell.exec('npm set-script dev "tsc -w & nodemon -w dist dist/index.js"');

    const con =
      'tsc && concurrently --kill-others --name "BUILD AND RUN "  -c "bgBlue.bold,bgMagenta.bold" "tsc -w" "nodemon -q -w dist dist/index.js"';
    shell.exec(`npm set-script dev-concurrently '${con}'`);
  }

  @log("eslint安装")
  initEslintAndPrettier() {
    // 安装所有的依赖包
    this.installPackages(
      [
        "eslint",
        "prettier",
        "@typescript-eslint/parser", // typescript eslint的parser
        "@typescript-eslint/eslint-plugin", // typescript eslint的配置
        "eslint-config-prettier", // prettier为了兼容eslint，需要用这份文件关掉一些规则
      ],
      {
        saveDev: true,
      },
    );

    // 写入eslint的配置文件
    const eslintJSON = JSON.stringify(eslintConfig, undefined, 2);
    const eslintrc = `module.exports = ${eslintJSON}`;
    this.addFile(".eslintrc.cjs", eslintrc);

    // 写入prettier的配置文件
    const prettierignore = trim`
      node_modules
      dist
      `;
    const prettierrc = JSON.stringify(prettierConfig, undefined, 2);
    this.addFile(".prettierignore", prettierignore);
    this.addFile(".prettierrc.json", prettierrc);
  }

  @log("husky安装")
  initHusky() {
    // 安装依赖
    this.installPackages(["husky", "lint-staged"], {
      saveDev: true,
    });

    // 写入lint-staged的配置文件
    const lintstagedrc = trimLeastSpace`
        {
          "**/*": "prettier --write --ignore-unknown"
        }
      `;
    this.addFile(".lintstagedrc", lintstagedrc);

    // 开始安装
    tryLogExit(function () {
      // Enable Git hooks
      shell.exec("npx husky install");
      // To automatically have Git hooks enabled after install, edit package.json
      shell.exec('npm set-script prepare "husky install"');
      // Create a hook
      shell.exec('npx husky add .husky/pre-commit "npx lint-staged"');
    }, "安装husky失败");
  }

  @log("安装commitizen")
  initCommitizen() {
    // 安装依赖
    this.installPackages(
      [
        "commitizen",
        "cz-conventional-changelog", // commitizen的雨来
        "conventional-changelog-cli", // 生成changlog的cli工具
      ],
      {
        saveDev: true,
      },
    );

    // commitizen配置文件
    this.addFile(".czrc", czrc);
    tryLogExit(() => {
      // cz命令
      shell.exec('npm set-script cz "git add . && npx cz"');
      // 生成changlog的命令
      shell.exec(
        `npm set-script changelog "conventional-changelog -p angular -i CHANGELOG.md -s -r 0 && git add CHANGELOG.md && git commit -m 'chore: CHANGELOG'"`,
      );
    });
  }
}
