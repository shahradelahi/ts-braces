<h1 align="center">
  <sup>@se-oss/braces</sup>
  <br>
  <a href="https://github.com/shahradelahi/ts-braces/actions/workflows/ci.yml"><img src="https://github.com/shahradelahi/ts-braces/actions/workflows/ci.yml/badge.svg?branch=main&event=push" alt="CI"></a>
  <a href="https://www.npmjs.com/package/@se-oss/braces"><img src="https://img.shields.io/npm/v/@se-oss/braces.svg" alt="NPM Version"></a>
  <a href="/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat" alt="MIT License"></a>
  <a href="https://bundlephobia.com/package/@se-oss/braces"><img src="https://img.shields.io/bundlephobia/minzip/@se-oss/braces" alt="npm bundle size"></a>
  <a href="https://packagephobia.com/result?p=@se-oss/braces"><img src="https://packagephobia.com/badge?p=@se-oss/braces" alt="Install Size"></a>
</h1>

_@se-oss/braces_ is a high-performance, V8-safe numeric and alphabetical range expander and regular expression compiler.

---

- [Installation](#-installation)
- [Usage](#-usage)
- [Documentation](#-documentation)
- [Contributing](#-contributing)
- [License](#license)

## 📦 Installation

```bash
pnpm add @se-oss/braces
```

<details>
<summary>Install using your favorite package manager</summary>

**npm**

```bash
npm install @se-oss/braces
```

**yarn**

```bash
yarn add @se-oss/braces
```

</details>

## 📖 Usage

### Range Expansion

Expand numeric or alphabetical range patterns with optional stepping.

```ts
import { expandRange } from '@se-oss/braces';

// Numeric ranges
expandRange('1..3'); // ['1', '2', '3']

// Alphabetical ranges
expandRange('a..c'); // ['a', 'b', 'c']
```

### Step Parameters

Specify a custom step interval for the range.

```ts
import { expandRange } from '@se-oss/braces';

expandRange('1..5..2'); // ['1', '3', '5']
```

### Zero-Padding Preservation

Automatically preserves leading zeros in numeric ranges.

```ts
import { expandRange } from '@se-oss/braces';

expandRange('01..03'); // ['01', '02', '03']
```

### Expansion Limit & Errors

Enforce safety limits on large range expansions to prevent resource exhaustion.

```ts
import { BraceLimitError, expandRange } from '@se-oss/braces';

try {
  // Try to expand a huge range with a low threshold limit
  expandRange('1..10000', 10);
} catch (error) {
  if (error instanceof BraceLimitError) {
    console.error('Expansion limit exceeded!');
  }
}
```

### V8-Safe Regular Expression Compiler

Compile numeric ranges into highly optimized and V8-safe regular expression patterns.

```ts
import { compileNumericRange } from '@se-oss/braces';

const pattern = compileNumericRange(1, 250);
// returns: "[1-9]|[1-9]\d|1\d{2}|2[0-4]\d|250"

const regex = new RegExp(`^(?:${pattern})$`);
regex.test('99'); // true
regex.test('250'); // true
regex.test('251'); // false
```

## 📚 Documentation

For more information, please see the JSDoc comments or check the source code.

## 🤝 Contributing

Want to contribute? Awesome! To show your support is to star the project, or to raise issues on [GitHub](https://github.com/shahradelahi/ts-braces).

Thanks again for your support, it is much appreciated! 🙏

## License

[MIT](/LICENSE) © [Shahrad Elahi](https://github.com/shahradelahi) and [contributors](https://github.com/shahradelahi/ts-braces/graphs/contributors).
