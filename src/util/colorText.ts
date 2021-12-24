import chalk from "chalk";

console.log(12121);

function listColors() {
  console.log(chalk.red("123"));
  console.log(chalk.green("123"));
  const xx = chalk.bgHex("#ccdd00")("我最厉害");
  const x = [...xx];
  console.log(x);
}
export { listColors };
