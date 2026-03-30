function matches(tokens, startIndex, pattern) {
  return pattern.every((expected, offset) => {
    const token = tokens[startIndex + offset];

    return (
      token && token.type === expected.type && token.value === expected.value
    );
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
