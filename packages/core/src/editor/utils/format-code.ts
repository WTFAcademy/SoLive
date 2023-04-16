function solidityFormatter(code: string) {
  const lines = code.split('\n');
  let indentLevel = 0;
  const formattedLines = lines.map(line => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('}')) {
      indentLevel -= 1;
    }

    const indentedLine = ' '.repeat(indentLevel * 4) + trimmedLine;

    if (
      trimmedLine.startsWith('{') ||
      trimmedLine.endsWith('{') ||
      trimmedLine.startsWith('contract') ||
      trimmedLine.startsWith('library') ||
      trimmedLine.startsWith('interface') ||
      trimmedLine.startsWith('function') ||
      trimmedLine.startsWith('struct') ||
      trimmedLine.startsWith('event')
    ) {
      indentLevel += 1;
    }

    return indentedLine;
  });

  return formattedLines.join('\n');
}

export default solidityFormatter;
