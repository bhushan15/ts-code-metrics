import { ScriptTarget, createSourceFile } from "typescript";
import { existsSync, readFileSync } from "fs";
import { isNull, mergeWith, omitBy, reduce } from "lodash";
import { getCylomaticComplexityForSource } from "./cyclomatic";
import { getHalsteadForSource } from "./halstead";
import { getSloc } from "./sloc";
import { mergeObjectPropertiesBasedOnKeys } from "../utils";
import { ICodeMetrics, IMaintainabilityIndexParams } from "../metrics.type";

const calculateMaintainabilityIndex = (
  maintainabilityIndexParams: IMaintainabilityIndexParams
) => {
  return Math.max(
    0,
    ((171 -
      5.2 * Math.log(maintainabilityIndexParams.halsteadVolume) -
      0.23 * maintainabilityIndexParams.cyclomaticComplexity -
      16.2 * Math.log(maintainabilityIndexParams.loc)) *
      100) /
      171
  );
};

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
  const metrics: { [key: string]: string } = {};

  Object.keys(perFunctionCyclomatic).forEach((functionName) => {
    const maintainabilityIndexParams: IMaintainabilityIndexParams = {
      halsteadVolume: perFunctionHalstead[functionName]?.volume,
      cyclomaticComplexity: perFunctionCyclomatic[functionName],
      loc: perFunctionLOC[functionName],
    };
    metrics[functionName] = JSON.stringify({
      ...maintainabilityIndexParams,
      maintainabilityIndex: calculateMaintainabilityIndex(
        maintainabilityIndexParams
      ),
    });
  });
  
  return metrics;
};
