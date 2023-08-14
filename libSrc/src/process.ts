import { head } from "lodash-es";
import qs from "query-string";
import {
  OssProcess,
  OssProcessCommandsMap,
  OssProcessParamsMap,
} from "../typings";

/**
 * @see https://help.aliyun.com/document_detail/99372.html?spm=a2c4g.11186623.6.737.53f128fbYQN7wk
 * @param processStr process的字符串
 */
export function parse(processStr: string) {
  // 模块之间以|隔开
  const moduleStrs = processStr.split("|");
  return Object.fromEntries(
    moduleStrs.map((moduleStr) => {
      // 命令之间以/隔开
      const commandStrs = moduleStr.split("/");
      const moduleName = commandStrs.shift();
      if (!moduleName || !commandStrs.length) {
        throw new Error("parse error");
      }
      return [
        moduleName,
        Object.fromEntries(
          commandStrs.map((commandStr) => {
            // 参数之间以,隔开
            const paramStrs = commandStr.split(",");
            const commandName = paramStrs.shift();
            if (!commandName || !paramStrs.length) {
              throw new Error("parse error");
            }
            return [
              commandName,
              paramStrs.length === 1
                ? paramStrs[0]
                : Object.fromEntries(
                    paramStrs.map((paramStr) => {
                      // 参数名与参数值之间用_隔开
                      return paramStr.split("_");
                    })
                  ),
            ];
          })
        ),
      ];
    })
  ) as OssProcess;
}

export function parseUrl(url: string) {
  let process: OssProcess = {};
  const {
    query: { "x-oss-process": xOssProcessArr, ...query },
    url: outputUrl,
  } = qs.parseUrl(url);
  const xOssProcess = head(xOssProcessArr);
  if (xOssProcess) {
    process = parse(xOssProcess);
  }
  return { url: outputUrl, process, query };
}

export function stringify(process: OssProcess) {
  return Object.entries(process)
    .filter(
      (entry): entry is [string, string | number | OssProcessCommandsMap] => {
        return !!entry[1];
      }
    )
    .map(([moduleName, commandsMap]) => {
      if (typeof commandsMap !== "object") {
        return `${moduleName}/${commandsMap}`;
      }
      return `${moduleName}/${Object.entries(commandsMap)
        .filter(
          (entry): entry is [string, string | number | OssProcessParamsMap] => {
            return !!entry[1];
          }
        )
        .map(([commandName, paramsMap]) => {
          if (typeof paramsMap !== "object") {
            return `${commandName},${paramsMap}`;
          }
          return `${commandName},${
            typeof paramsMap === "string"
              ? paramsMap
              : Object.entries(paramsMap)
                  .map(([paramName, paramValue]) => {
                    return `${paramName}_${paramValue}`;
                  })
                  .join(",")
          }`;
        })
        .join("/")}`;
    })
    .join("|");
}

export function merge(process: OssProcess, mergeProcess: OssProcess) {
  process = { ...process };
  Object.entries(mergeProcess).forEach(([moduleName, commandsMap]) => {
    const oldModule = process[moduleName];
    if (typeof oldModule === "object" && typeof commandsMap === "object") {
      process[moduleName] = {
        ...oldModule,
        ...commandsMap,
      };
    } else {
      process[moduleName] = commandsMap;
    }
  });
  return process;
}

export function stringifyUrl({
  url,
  process,
}: {
  url: string;
  process: OssProcess;
}) {
  const parsed = parseUrl(url);
  return qs.stringifyUrl({
    url: parsed.url,
    query: {
      ...parsed.query,
      "x-oss-process": stringify(merge(parsed.process, process)),
    },
  });
}
