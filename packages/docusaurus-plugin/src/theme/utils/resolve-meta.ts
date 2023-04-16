import singleFilename from './single-filename';

export type TMeta = {
  filename?: string;
  content: string;
}

function parseContent(content: string) {
  const regex = /(?:^|\s)\/\*\*?\s*\*[\s@]*filename\s+([\w.]+)\s*\*?\//gm;
  const filenames = [];
  let match;

  // eslint-disable-next-line no-cond-assign
  while ((match = regex.exec(content)) !== null) {
    filenames.push(match[1]);
  }

  const contracts = content.split(regex).filter((_, index) => index % 2 === 0).slice(1);

  return filenames.map((filename, index) => ({
    filename,
    content: contracts[index].trim(),
  }));
}

const resolveMeta = (content: string): TMeta[] => {
  const files = parseContent(content).filter((file) => file.filename);
  if (files.length === 0) {
    return [{ filename: singleFilename(), content }];
  }
  return files;
};

export default resolveMeta;
