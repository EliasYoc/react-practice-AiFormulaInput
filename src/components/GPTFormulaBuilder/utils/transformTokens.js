function matches(tokens, startIndex, patternValues) {
  return patternValues.every((expected, offset) => {
    const token = tokens[startIndex + offset];

    return token && token.value.toLowerCase() === expected.toLowerCase();
  });
}

export function transformTokens(tokens, patterns) {
  const result = [];

  for (let i = 0; i < tokens.length; i++) {
    let matched = false;

    for (const pattern of patterns) {
      if (matches(tokens, i, pattern.match)) {
        result.push(pattern.result);

        i += pattern.match.length - 1;
        matched = true;
        break;
      }
    }

    if (!matched) {
      result.push(tokens[i]);
    }
  }

  return result;
}
