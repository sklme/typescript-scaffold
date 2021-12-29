import "reflect-metadata";
import chalk from "chalk";
import figures from "figures";

enum Colors {
  error = "#e34d59",
  warn = "#d35a21",
  info = "#699ef5",
  success = "#078d5c",
}
enum BgColor {
  error = "#111111",
  warn = "",
  info = "",
  success = "",
}

// TODO: 提供一个获取前缀的方法
type LogNames = keyof typeof Colors;
function logFunc(
  target: LogUtil,
  propName: LogNames,
  descriptor: PropertyDescriptor,
) {
  // 原始方法
  const originMethod = descriptor.value;
  // 取出颜色
  const color = Colors[propName];
  // 取出背景颜色
  const bgColor = BgColor[propName];
  // 取出icon
  let icon = figures.info;
  // todo 创建一个库，同时支持不支持unicode的fallback
  switch (propName) {
    case "error":
      // icon = figures.cross;
      icon = "\u274c";
      break;
    case "warn":
      // icon = figures.warning;
      icon = "\u26a0\ufe0f ";
      // icon = "\u2757";
      break;
    case "info":
      // icon = figures.info;
      icon = "\u2139\ufe0f ";
      break;
    case "success":
      // icon = figures.tick;
      icon = "\u2705";
      break;
  }

  descriptor.value = function (this: LogUtil, ...args: unknown[]) {
    const str = args.filter((o) => typeof o === "string").join(" ");
    const capitalizeType =
      icon + propName.replace(/./, (c) => " " + c.toUpperCase());
    const prifixWord = this.prefix
      ? `${capitalizeType} - ${this.prefix}`
      : capitalizeType;
    let chalkColor = chalk.hex(color);
    if (bgColor) chalkColor = chalkColor.bgHex(bgColor);
    const logWordings = chalkColor(prifixWord);
    console.log(logWordings, str);

    originMethod.apply(this, args);
  };
}

export class LogUtil {
  prefix = "";
  constructor(prefix?: string) {
    this.prefix = prefix || "";
  }

  @logFunc
  warn(...str: string[]) {
    //
  }

  @logFunc
  error(...str: string[]) {
    //
  }

  @logFunc
  success(...str: string[]) {
    //
  }

  @logFunc
  info(...str: string[]) {
    //
  }
}

export default new LogUtil();
