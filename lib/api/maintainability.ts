import { ScriptTarget, createSourceFile } from "typescript";
import { existsSync, readFileSync } from "fs";
import { isNull, mergeWith, omitBy, reduce } from "lodash";
import { getCylomaticComplexityForSource } from "./cyclomatic";
import { getHalsteadForSource } from "./halstead";
import { getSloc } from "./sloc";
import { Project, StructureKind } from "ts-morph";
import { mergeObjectPropertiesBasedOnKeys } from "../utils";

export const getMaintainabilityForFile = (
  filePath: string,
  target: ScriptTarget
) => {
  if (!existsSync(filePath)) {
    throw new Error(`File "${filePath}" does not exists`);
  }
  const sourceText = readFileSync(filePath).toString();
  const source = createSourceFile(filePath, sourceText, target, true);

  const perFunctionHalstead = getHalsteadForSource(source);
  const perFunctionCyclomatic = getCylomaticComplexityForSource(source);
  const perFunctionLOC = getSloc(source);
  const metrics = {};

  Object.keys(perFunctionCyclomatic).forEach((functionName) => {
    metrics[functionName] = {
      volume: perFunctionHalstead[functionName]?.volume,
      cyclomatic: perFunctionCyclomatic[functionName],
      loc: perFunctionLOC[functionName],
    };
  });

  // const maximumMatrics = reduce(
  //   perFunctionMerged,
  //   (result, value) => {
  //     result.volume = Math.max(result.volume, value.volume);
  //     result.cyclomatic = Math.max(result.cyclomatic, value.cyclomatic);
  //     return result;
  //   },
  //   perFunctionMerged[functions[0]]
  // );

  // const averageMatrics = { cyclomatic: 0, volume: 0, n: 0 };
  // functions.forEach((aFunction) => {
  //   const matric = perFunctionMerged[aFunction];
  //   averageMatrics.cyclomatic += matric.cyclomatic;
  //   averageMatrics.volume += matric.volume;
  //   averageMatrics.n++;
  // });
  // averageMatrics.cyclomatic /= averageMatrics.n;
  // averageMatrics.volume /= averageMatrics.n;

  // const averageMaintainability = Number.parseFloat(
  //   (
  //     171 -
  //     5.2 * Math.log(averageMatrics.volume) -
  //     0.23 * averageMatrics.cyclomatic -
  //     16.2 * Math.log(sourceCodeLength)
  //   ).toFixed(2)
  // );

  // const minMaintainability = Number.parseFloat(
  //   (
  //     171 -
  //     5.2 * Math.log(maximumMatrics.volume) -
  //     0.23 * maximumMatrics.cyclomatic -
  //     16.2 * Math.log(sourceCodeLength)
  //   ).toFixed(2)
  // );

  return { averageMaintainability: 1, minMaintainability: 1 };
};
