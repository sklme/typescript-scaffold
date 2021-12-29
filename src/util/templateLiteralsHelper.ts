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
    lines = lines.filter((s) => s);
  } else {
    if (options.removeEmptyHead) {
      if (!lines[0]) {
        lines.splice(0, 1);
      }
    }
    if (options.removeEmptyTail) {
      if (!lines[lines.length - 1]) {
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

export { trim };
