#!/usr/bin/env node
import { program } from "commander";
import createNewApp from "./create.js";

program
  .version("1.0.0")
  .command("create <appName>", {
    isDefault: true,
  })
  .description("创建新的项目")
  .action((name: string) => {
    createNewApp(name);
  })
  .parse();
