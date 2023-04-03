
export type TMeta = {
  meta: {[key: string]: string};
  content: string;
}

const filterWhitespaceChars = (str: string) => {
  return str.replace(/[ \t]+/g, ' ').replace(/\n+/g, '\n').trim();
}

const resolveKeyPair = (str: string) => {
  const regex = /(.+?):\s*(.*)/g;
  let match;
  const kvPairs: {[key: string]: string} = {};
  while ((match = regex.exec(str)) !== null) {
    const [_, key, value] = match;
    kvPairs[key] = value;
  }
  return kvPairs;
}

const resolveMeta = (content: string): TMeta[] => {
  const regex = /---\n([\s\S]*?)\n---/;
  let matches = content.split(regex);
  matches = matches.filter(item => filterWhitespaceChars(item).length > 0);

  const result = [];

  for (let i = 0; i < matches.length; i += 2) {
    const match = matches[i];
    const content = matches[i + 1];

    const keyPairs = resolveKeyPair(match);
    result.push({
      meta: keyPairs,
      content,
    })
  }

  return result;
}

export default resolveMeta;
