import * as tc from "./lib";

import { lstatSync } from "fs";

import glob from "glob";

const inputArgs = process.argv.slice(2);

const createReport = (files: string[]) => {
  const report = {};
  files.forEach((file: string) => {
    const metricMaintanability = tc.getMaintainability(file);
    // report.push({
    //   file,
    //   ...metricMaintanability,
    // });
    report[file] = metricMaintanability;
  });
  console.log(report);
};

const GLOBAL_TS_PATTERN: string = "{,!(node_modules|__mocks__|__snapshots__)/**/}*[!test][!type][!scss].+(ts|tsx)";

const createReportWithPathPattern = (
  matchPattern: string = GLOBAL_TS_PATTERN
) => {
  console.log(matchPattern);
  const options = {};

  const patternMatchAndCreateReport = (err: Error | null, files: string[]) => {
    if (err) {
      console.error("Some error occured", err);
    }
    createReport(files);
  };
  glob(matchPattern, options, patternMatchAndCreateReport);
};

if (inputArgs.length > 0) {
  const stat = lstatSync(inputArgs[0]);
  if (stat.isFile()) {
    createReport(inputArgs);
  } else if (stat.isDirectory()) {
    createReportWithPathPattern(inputArgs[0] + GLOBAL_TS_PATTERN);
  } else {
    // TODO Validate pattern
    createReportWithPathPattern(inputArgs[0]);
  }
}
