import { CompilerInput, CompilerInputOptions, Source } from "./types";

const makeCompilerInput = (
  sources: Source,
  opts: CompilerInputOptions
): CompilerInput => {
  const baseInput: CompilerInput = {
    language: "Solidity",
    sources: sources,
    settings: {
      optimizer: {
        enabled: opts.optimize === true || opts.optimize === 1,
        runs: opts.runs > -1 ? opts.runs : 200,
      },
      libraries: opts.libraries,
      outputSelection: {
        "*": {
          "": ["ast"],
          "*": [
            "abi",
            "metadata",
            "devdoc",
            "userdoc",
            "storageLayout",
            "evm.legacyAssembly",
            "evm.bytecode",
            "evm.deployedBytecode",
            "evm.methodIdentifiers",
            "evm.gasEstimates",
            "evm.assembly",
          ],
        },
      },
    },
  };

  if (opts.evmVersion) {
    if (opts.evmVersion.toLowerCase() == "default") {
      opts.evmVersion = null;
    } else {
      baseInput.settings.evmVersion = opts.evmVersion;
    }
  }
  if (opts.language) {
    baseInput.language = opts.language;
  }
  if (opts.language === "Yul" && baseInput.settings.optimizer.enabled) {
    if (!baseInput.settings.optimizer.details) {
      baseInput.settings.optimizer.details = {};
    }
    baseInput.settings.optimizer.details.yul = true;
  }
  return baseInput;
};

export default makeCompilerInput;
