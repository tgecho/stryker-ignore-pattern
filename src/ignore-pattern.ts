import { Checker, CheckResult, CheckStatus } from "@stryker-mutator/api/check";
import {
  PluginKind,
  declareClassPlugin,
  tokens,
  commonTokens,
  Injector,
  PluginContext,
  Scope,
} from "@stryker-mutator/api/plugin";
import { Logger } from "@stryker-mutator/api/logging";
import { Mutant, StrykerOptions } from "@stryker-mutator/api/core";
import { readFile } from "fs/promises";

create.inject = tokens(commonTokens.injector);
export function create(injector: Injector<PluginContext>): IgnoreChecker {
  return injector.injectClass(IgnoreChecker);
}

type IgnoreRange = { pattern: string; start: number; end: number };
type IgnoreOptions = { ignorePatterns?: string[] };

export class IgnoreChecker implements Checker {
  public static inject = tokens(commonTokens.logger, commonTokens.options);

  private files: { [path: string]: Promise<IgnoreRange[]> } = {};
  private patterns?: RegExp[];

  constructor(
    private readonly logger: Logger,
    options: StrykerOptions & IgnoreOptions
  ) {
    this.patterns = options.ignorePatterns?.map(
      (pattern: string) => new RegExp(pattern, "g")
    );
  }

  public async init(): Promise<void> {
    // pass
  }

  private async scanFile(fileName: string): Promise<IgnoreRange[]> {
    if (!this.patterns) return [];

    const content = (await readFile(fileName)).toString();
    const ranges = [];

    for (const pattern of this.patterns) {
      let match;
      while ((match = pattern.exec(content)) !== null) {
        ranges.push({
          pattern: pattern.toString(),
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }
    return ranges;
  }

  public async check(mutant: Mutant): Promise<CheckResult> {
    if (this.patterns) {
      const ignoreRanges = await (this.files[mutant.fileName] ??= this.scanFile(
        mutant.fileName
      ));
      for (const range of ignoreRanges) {
        if (mutant.range[0] >= range.start && mutant.range[1] <= range.end) {
          return {
            reason: `Mutation is inside ignored pattern: ${range.pattern}`,
            status: CheckStatus.CompileError,
          };
        }
      }
    }
    return { status: CheckStatus.Passed };
  }
}
