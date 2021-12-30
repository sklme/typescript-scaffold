type TrimOption = {
  removeEmptyLine: boolean;
  removeEmptyHead: boolean;
  removeEmptyTail: boolean;
  trimStart: boolean;
  trimEnd: boolean;
};

// 获取原来的模板字符串
function getLiteral(
  raws: readonly string[],
  substitutions: unknown[] = [],
): string {
  if (!substitutions.length) return raws.join("");

  const strs = substitutions.reduce(
    (result: string[], current: unknown, currentIndex) => {
      result.push(String(current));
      result.push(raws[currentIndex + 1]);

      return result;
    },
    [raws[0]],
  );

  return strs.join("");
}

function trimLiteralByLine(literal: string, options?: Partial<TrimOption>) {
  options = Object.assign(
    {
      removeEmptyLine: false,
      removeEmptyHead: true,
      removeEmptyTail: true,
      trimStart: true,
      trimEnd: true,
    },
    options,
  );

  let lines = literal
    .replace(/\r\n/g, "\n") // 去除windows的换行
    .split("\n");

  //#region 空行的处理
  if (options.removeEmptyLine) {
    lines = lines.filter((s) => {
      return !s.match(/^\s*$/);
    });
  } else {
    if (options.removeEmptyHead) {
      if (lines[0].match(/^\s*$/)) {
        lines.splice(0, 1);
      }
    }
    if (options.removeEmptyTail) {
      if (lines[lines.length - 1].match(/^\s*$/)) {
        lines.splice(lines.length - 1, 1);
      }
    }
  }

  //#endregion 空行的处理
  lines = lines.map((s) => {
    if (options?.trimStart) {
      s = s.trimStart();
    }
    if (options?.trimEnd) {
      s = s.trimEnd();
    }
    return s;
  });

  return lines.join("\n");
}

function trim(options: Partial<TrimOption>): () => unknown;
function trim(
  strings: TemplateStringsArray,
  ...substitutions: unknown[]
): string;
function trim(
  optionsOrStrings: TemplateStringsArray | Partial<TrimOption>,
  ...substitutions: unknown[]
): unknown {
  // 是构造函数
  if (!Array.isArray(optionsOrStrings)) {
    return function (
      strings: TemplateStringsArray,
      ...substitutions: unknown[]
    ) {
      const str = getLiteral(strings, substitutions);
      return trimLiteralByLine(str, optionsOrStrings as Partial<TrimOption>);
    };
  }

  // 是tagged函数
  const str = getLiteral(
    optionsOrStrings as TemplateStringsArray,
    substitutions,
  );
  return trimLiteralByLine(str);
}

function trimLeastSpace(
  strings: TemplateStringsArray,
  ...substitutions: unknown[]
) {
  const str = trimLiteralByLine(getLiteral(strings, substitutions), {
    trimStart: false,
    removeEmptyHead: true,
    removeEmptyTail: true,
  }).replace(/\t/g, "  "); // 替换tab为space
  let lines = str.split("\n");
  const leastSpaceLine = lines.reduce((pre, current) => {
    const matchResult = current.match(/^(\s*)/);
    const startSpace = matchResult ? matchResult[1] : "";
    const preMatchResult = pre.match(/^(\s*)/);
    const preStartSpace = preMatchResult ? preMatchResult[1] : "";
    return preStartSpace.length > startSpace.length ? current : pre;

    // return startSpace.length < compare.length ? startSpace : compare;
  });

  const match = leastSpaceLine.match(/^(\s*)/);
  const trimSpace = match ? match[1] : "";

  // 去掉对应的缩进
  lines = lines.map((line) => {
    // return line.replace(/^/)
    const regex = new RegExp(`^${trimSpace}`);
    return line.replace(regex, "");
  });

  return lines.join("\n");
}

export { trim, trimLeastSpace };
