import { PluginKind, declareFactoryPlugin } from "@stryker-mutator/api/plugin";

import {
  createIgnorePatternChecker,
  IgnorePatternChecker,
} from "./ignore-pattern";
import strykerValidationSchema from "./ignore-pattern-options.json";

const strykerPlugins = [
  declareFactoryPlugin(
    PluginKind.Checker,
    "ignore-pattern",
    createIgnorePatternChecker
  ),
];

export {
  strykerPlugins,
  createIgnorePatternChecker,
  IgnorePatternChecker,
  strykerValidationSchema,
};
