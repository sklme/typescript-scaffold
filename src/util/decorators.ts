import chalk from "chalk";

function logCyan(...str: string[]) {
  str = str.map((s) => chalk.cyan(s));
  console.log(...str);
}

/**
 * log的装饰器构造函数
 * @param name log的名字
 */
function log(name: string): (...args: any[]) => any;
/**
 * log装饰器
 * @param target 装饰的原型
 * @param pName 属性名
 * @param descriptor 属性描述
 */
function log(
  target: unknown,
  pName: string,
  descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
): void;
function log(
  targetOrName: unknown,
  pName?: string,
  descriptor?: TypedPropertyDescriptor<(...args: any[]) => any>,
) {
  // 传递进来的是函数的log name，返回一个装饰器
  if (typeof targetOrName === "string") {
    return function (
      target: unknown,
      pName: string,
      descriptor: TypedPropertyDescriptor<(...args: any[]) => any>,
    ) {
      const originMethod = descriptor.value;
      descriptor.value = function (...args: unknown[]) {
        logCyan(
          `执行 ${targetOrName}(${pName})， 参数: [${args.join(", ")}]...`,
        );
        originMethod && originMethod.apply(this, args);
        logCyan(`结束执行 ${targetOrName}(${pName})`);
      };
    };
  }

  if (descriptor && pName) {
    const originMethod = descriptor?.value;
    descriptor.value = function (...args: unknown[]) {
      logCyan(`开始执行 ${pName || ""}，参数: [${args.join(", ")}]...`);
      originMethod && originMethod.apply(this, args);
      logCyan(`结束执行 ${pName || ""}`);
    };
  }
}

export { log };
export default {
  log,
};
