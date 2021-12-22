#!/usr/bin/env node
import { program } from "commander";
import createNewApp from "./create";
// import pjson from "../package.json";
// console.log(pjson.version);

program
  .version("1.0.")
  .command("create <appName>")
  .description("创建新的项目")
  .action((name: string) => {
    createNewApp(name);
  })
  .parse();
