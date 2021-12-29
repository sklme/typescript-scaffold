export default {
  extends: "@tsconfig/node16/tsconfig.json",
  compilerOptions: {
    outDir: "./lib",
    module: "ESNext",
    moduleResolution: "node",
    strict: true,
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    resolveJsonModule: true,
    exactOptionalPropertyTypes: true,
    noFallthroughCasesInSwitch: true,
    pretty: true,
    declaration: true,
  },
  include: ["src/**/*"],
  exclude: ["node_modules", "dist", "lib"],
};
