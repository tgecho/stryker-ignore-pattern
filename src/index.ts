import { PluginKind, declareFactoryPlugin } from "@stryker-mutator/api/plugin";

import { create } from "./ignore-pattern";

export const strykerPlugins = [
  declareFactoryPlugin(PluginKind.Checker, "ignore", create),
];

export const createTypescriptChecker = create;
