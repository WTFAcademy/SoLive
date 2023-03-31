import {
  CompilationResult,
  visitContractsCallbackParam,
  visitContractsCallbackInterface,
  ErrorMarker,
  MarkerSeverity,
  SearchResultLine,
  SearchResultLineLine,
} from "./types";

/**
 * @dev Get contract obj of given contract name from last compilation result.
 * @param contractName
 * @param contracts 'contracts' object from last compilation result
 */

export const getContract = (
  contractName: string,
  contracts: CompilationResult["contracts"]
): Record<string, any> | null => {
  for (const file in contracts) {
    if (contracts[file][contractName]) {
      return { object: contracts[file][contractName], file: file };
    }
  }
  return null;
};

/**
 * @dev call the given callback for all contracts from last compilation result, stop visiting when cb return true
 * @param contracts - 'contracts' object from last compilation result
 * @param cb    - callback
 */

export const visitContracts = (
  contracts: CompilationResult["contracts"],
  cb: visitContractsCallbackInterface
): void => {
  for (const file in contracts) {
    for (const name in contracts[file]) {
      const param: visitContractsCallbackParam = {
        name: name,
        object: contracts[file][name],
        file: file,
      };
      if (cb(param)) return;
    }
  }
};

// ^ e.g:
// browser/gm.sol: Warning: Source file does not specify required compiler version! Consider adding "pragma solidity ^0.6.12
// https://github.com/OpenZeppelin/openzeppelin-contracts/blob/release-v3.2.0/contracts/introspection/IERC1820Registry.sol:3:1: ParserError: Source file requires different compiler version (current compiler is 0.7.4+commit.3f05b770.Emscripten.clang) - note that nightly builds are considered to be strictly less than the released version
export const getPositionDetails = (msg: string) => {
  const result = {} as Record<string, number | string>;

  // To handle some compiler warning without location like SPDX license warning etc
  if (!msg.includes(":")) return { errLine: -1, errCol: -1, errFile: "" };

  if (msg.includes("-->")) msg = msg.split("-->")[1].trim();

  // extract line / column
  let pos = msg.match(/^(.*?):([0-9]*?):([0-9]*?)?/);
  result.errLine = pos ? parseInt(pos[2]) - 1 : -1;
  result.errCol = pos ? parseInt(pos[3]) : -1;

  // extract file
  pos = msg.match(/^(https:.*?|http:.*?|.*?):/);
  result.errFile = pos ? pos[1] : msg;
  return result;
};

export const createErrorMarker = (
  error: any,
  filePath: string,
  lineColumn: any
): ErrorMarker => {
  return {
    message: error.formattedMessage,
    severity:
      error.severity === "error"
        ? MarkerSeverity.Error
        : MarkerSeverity.Warning,
    position: {
      start: {
        line: ((lineColumn.start && lineColumn.start.line) || 0) + 1,
        column: ((lineColumn.start && lineColumn.start.column) || 0) + 1,
      },
      end: {
        line: ((lineColumn.end && lineColumn.end.line) || 0) + 1,
        column: ((lineColumn.end && lineColumn.end.column) || 0) + 1,
      },
    },
    file: filePath,
  };
};

export const getLinebreakPositions = (source: any) => {
  const ret = [];
  for (
    let pos = source.indexOf("\n");
    pos >= 0;
    pos = source.indexOf("\n", pos + 1)
  ) {
    ret.push(pos);
  }
  return ret;
};

export const convertOffsetToLineColumn = (
  sourceLocation: any,
  lineBreakPositions: any
) => {
  if (sourceLocation.start >= 0 && sourceLocation.length >= 0) {
    return {
      start: convertFromCharPosition(sourceLocation.start, lineBreakPositions),
      end: convertFromCharPosition(
        sourceLocation.start + sourceLocation.length,
        lineBreakPositions
      ),
    };
  }
  return { start: null, end: null };
};

export const convertFromCharPosition = (pos: any, lineBreakPositions: any) => {
  let line = findLowerBound(pos, lineBreakPositions);
  if (lineBreakPositions[line] !== pos) {
    line = line + 1;
  }
  const beginColumn = line === 0 ? 0 : lineBreakPositions[line - 1] + 1;
  const column = pos - beginColumn;
  return { line, column };
};

export const findLowerBound = (target: any, array: any) => {
  let start = 0;
  let length = array.length;
  while (length > 0) {
    const half = length >> 1;
    const middle = start + half;
    if (array[middle] <= target) {
      length = length - 1 - half;
      start = middle + 1;
    } else {
      length = half;
    }
  }
  return start - 1;
};

export const getPositionForImportErrors = async (
  importedFileName: string,
  text: string
) => {
  const re = new RegExp(escapeRegExp(importedFileName), "gi");
  const result: SearchResultLine[] = findLinesInStringWithMatch(text, re);
  return result;
};

export const findLinesInStringWithMatch = (str: string, re: RegExp) => {
  return str
    .split(/\r?\n/)
    .map((line, i) => {
      const matchResult = matchesInString(line, re);
      if (matchResult.length) {
        return {
          lines: splitLines(matchResult, i),
        };
      }
      return null;
    })
    .filter(Boolean) as SearchResultLine[];
};

const matchesInString = (str: string, re: RegExp) => {
  let a: RegExpExecArray;
  const results: RegExpExecArray[] = [];
  // @ts-ignore
  while ((a = re.exec(str || "")) !== null) {
    results.push(a);
  }
  return results;
};

const splitLines = (matchResult: RegExpExecArray[], lineNumber: number) => {
  return matchResult.map((matchResultPart, i) => {
    const result: SearchResultLineLine = {
      left: matchResultPart.input.substring(0, matchResultPart.index),
      right: matchResultPart.input.substring(
        matchResultPart.index + matchResultPart[0].length
      ),
      center: matchResultPart[0],
      position: {
        start: {
          line: lineNumber,
          column: matchResultPart.index,
        },
        end: {
          line: lineNumber,
          column: matchResultPart.index + matchResultPart[0].length,
        },
      },
    };
    return result;
  });
};

const escapeRegExp = (str: string) => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
