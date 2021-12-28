import logUtil from "./logUtil.js";

export function tryLogExit(
  fn: (...args: any[]) => unknown,
  logStr?: string,
  ...args: unknown[]
) {
  try {
    fn(...args);
  } catch (e) {
    logStr && logUtil.error(logStr);
    console.error(e);
    process.exit(1);
  }
}
