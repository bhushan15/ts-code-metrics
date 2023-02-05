import { ScriptTarget, createSourceFile } from "typescript";
import { existsSync, readFileSync } from "fs";
import { isNull, mergeWith, omitBy, reduce } from "lodash";
import { getCylomaticComplexityForSource } from "./cyclomatic";
import { getHalsteadForSource } from "./halstead";
import { getSloc } from "./sloc";
import { Project, StructureKind } from "ts-morph";
import { mergeObjectPropertiesBasedOnKeys } from "../utils/name";

// initialize
const project = new Project({
  // tsConfigFilePath: "./tsconfig.json",
  // skipAddingFilesFromTsConfig: true,
});
project.addSourceFilesAtPaths("lib/**/*.ts");

export const getMaintainabilityForFile = (
  filePath: string,
  target: ScriptTarget
) => {
  if (!existsSync(filePath)) {
    throw new Error(`File "${filePath}" does not exists`);
  }
  const sourceText = readFileSync(filePath).toString();
  const source = createSourceFile(filePath, sourceText, target, true);
  // const sourceFile = project.createSourceFile(filePath, "", {
  //   overwrite: true,
  // });
  const sourceFile = project.createSourceFile(filePath, sourceText, {
    overwrite: true,
  });

  const perFunctionHalstead = getHalsteadForSource(source);
  const perFunctionCyclomatic = getCylomaticComplexityForSource(source);
  // console.log(sourceFile);
  const sourceCodeLength = getSloc(source);

  console.log(sourceCodeLength);

  // console.log(`Source ${JSON.stringify(source)}`);
  // console.log(`Cyclomatic ${JSON.stringify(perFunctionCyclomatic)}`);
  // console.log(`Halstead ${JSON.stringify(perFunctionHalstead)}`);

  const customizer = (src, val) => {
    if (!!src && Object.keys(src).length !== 0 && !!val) {
      return { volume: src.volume, cyclomatic: val };
    }
    return null;
  };
  const merged = mergeWith(
    perFunctionHalstead,
    perFunctionCyclomatic,
    customizer
  );

  // console.log(`merged ${JSON.stringify(merged)}`);
  const perFunctionMerged = omitBy(merged, isNull);

  // console.log(perFunctionMerged);

  // const functions = Object.keys(perFunctionMerged);
  // if (functions.length === 0) {
  //   return { averageMaintainability: -1, minMaintainability: -1 };
  // }

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
