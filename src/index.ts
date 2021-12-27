#!/usr/bin/env node
import { program } from "commander";
import Initer from "./create.js";

program
  .version("1.0.0")
  .command("create <appName>", {
    isDefault: true,
  })
  .description("创建新的项目")
  .action(async (name: string) => {
    const initer = new Initer(name);
    await initer.main();
  })
  .parseAsync();
