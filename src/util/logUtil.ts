import "reflect-metadata";
import chalk from "chalk";
import figures from "figures";

enum Colors {
  error = "#e34d59",
  warn = "#d35a21",
  info = "#f3f3f3",
  success = "##078d5c",
}
enum BgColor {
  error = "#242424",
  warn = "",
  info = "",
  success = "",
}

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
  switch (propName) {
    case "error":
      icon = figures.cross;
      break;
    case "warn":
      icon = figures.warning;
      break;
    case "info":
      icon = figures.info;
      break;
    case "success":
      icon = figures.tick;
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
