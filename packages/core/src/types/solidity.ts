export type CompilerBuild = {
  path: string;
  version: string;
  longVersion: string;
  keccak256: string;
  urls: string[];
  sha256: string;
};

export type CompilerVersion = Record<string, string>;

export type CompilerInfo = {
  builds: CompilerBuild[];
  latestRelease: string;
  releases: CompilerVersion;
};
