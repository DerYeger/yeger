# @yeger/html-diff

[![npm](https://img.shields.io/npm/v/@yeger/html-diff?color=a1b858&label=)](https://npmjs.com/package/@yeger/html-diff)

Dependency-free HTML diffing library written in TypeScript.

> This is a fork of [diff-htmls](https://github.com/ericmakesapps/diff-htmls) and [html-diff-ts](https://github.com/deadusr/html-diff-ts), which are TypeScript ports
of [HtmlDiff.NET](https://github.com/Rohland/htmldiff.net) which is itself a C# port of
the Ruby implementation, [HtmlDiff](https://github.com/myobie/htmldiff/).
> This fork drops CJS support to fix various issues in modern ESM projects.

## Installation

`pnpm i @yeger/html-diff`

## Project Description

Comparing two HTML blocks, and returns a meshing of the two that includes `<ins>` and
`<del>` elements. The classes of these elements are `ins.diffins` for new code,
`del.diffdel` for removed code, and `del.diffmod` and `ins.diffmod` for sections of code
that have been changed.

For "special tags" (primarily style tags such as `<em>` and `<strong>`), `ins.mod`
elements are inserted with the new styles.

## API

Options:

- `blocksExpression` - list of Regular Expressions which will be treated as one block (token) instead of being divided
  - `exp` - Regular Expression for token itself
  - `compareBy` - Regular Expression for part of the token by which will be compared
    made

## Usage

### Basic

```ts
import { diff } from '@yeger/html-diff'

const oldHtml = '<p>Some <em>old</em> html here</p>'
const newHtml = '<p>Some <b>new</b> html goes here</p>'

const result = diff(oldHtml, newHtml)
```

Result:

```html
<p>
  Some <del><em>old</em></del
  ><ins><b>new</b></ins> html here
</p>
```

Visualization:

```diff
Some
- <em>old</em>
+ <b>new</b>
html here
```

### With blocksExpression

The tokenizer works by running the diff on words, but sometimes this isn't ideal.
For example, it may look clunky when a date is edited from 12 Jan 2022 to 14 Feb 2022.
It might be neater to treat the diff on the entire date rather than the independent tokens.
You can achieve this using AddBlockExpression.
Note, the Regex example is not meant to be exhaustive to cover all dates.
If text matches the expression, the entire phrase is included as a single token to be compared, and that results in a much neater output.

```ts
import { diff } from '@yeger/html-diff'

const oldHtml = '<p>12.11.2022</p>'
const newHtml = '<p>15.12.2022</p>'
const dateRegexp = /\d\d\.\d\d\.\d\d\d\d/g

const result = diff(oldHtml, newHtml, { blocksExpression: [{ exp: dateRegexp }] })
```

Result:

```html
<p>
    <p><del>12.11.2022</del> <ins>15.12.2022</ins></p>
</p>
```

Visualization:

```diff
<p>
- <em>12.11.2022</em>
+ <b>15.12.2022</b>
</p>
```

### With blocksExpression and compareBy

No diff

```ts
import { diff } from '@yeger/html-diff'

// "src" attr is different but "title" - is the same
const oldHtml = '<img src="./old.png" title="title-1" />'
// "src" attr is different but "title" - is the same
const newHtml = '<img src="./new.png" title="title-1" />'

const result = diff(oldHtml, newHtml, {
    blocksExpression: [
      {
        // match <img/> tag
        exp: /<img[\s\S]+?\/>/g,
        // compare only by title="" attribute
        compareBy: /title="[\s\S]+?"/g,
      },
    ],
  })
```

Result:
Will return the new string without comparison to old one - because title attribute is the
same

```html
<img src="./new.png" title="title-1" />
```

Has diff

```ts
import { diff } from '@yeger/html-diff'

// "title" attr is different
const oldHtml = '<img src="./old.png" title="old-title" />'
// "title" attr is different
const newHtml = '<img src="./new.png" title="new-title" />'

const result = diff(oldHtml, newHtml, {
    blocksExpression: [
      {
        // match <img/> tag
        exp: /<img[\s\S]+?\/>/g,
        // compare only by title="" attribute
        compareBy: /title="[\s\S]+?"/g,
      },
    ],
  })
```

Result:
Will return the new string with diff to old one - because title attribute has changed

```html
<del>
  <img src="./old.png" title="old-title" />
</del>
<ins>
  <img src="./new.png" title="new-title" />
</ins>
```

Visualization:

```diff
<p>
- <img src="./old.png" title="old-title" />
+ <img src="./new.png" title="new-title" />
</p>
```
