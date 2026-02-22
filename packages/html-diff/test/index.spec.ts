import { describe, test } from 'vitest'

import { diff } from '../src/index'

describe('diff', () => {
  test('should be a function', ({ expect }) => {
    expect(typeof diff).toBe('function')
  })

  test('take two strings and return one', ({ expect }) => {
    expect(typeof diff(' ', ' ')).toBe('string')
  })

  test('take third parameter as array of objects with blocksExpression field in them', ({
    expect,
  }) => {
    expect(() => diff(' ', ' ', { blocksExpression: [] })).not.toThrowError()
  })

  test('if two strings are the same - return same string', ({ expect }) => {
    expect(diff(' same ', ' same ', { blocksExpression: [] })).toBe(' same ')
  })

  test('when blocksExpression.exp specified - will group part of string that match to that regexp into one token', ({
    expect,
  }) => {
    const dateRegexp = /\d\d\.\d\d\.\d\d\d\d/g
    expect(
      diff(` text 19.12.2022`, ` text 20.12.2022`, {
        blocksExpression: [
          {
            exp: dateRegexp,
          },
        ],
      }),
    ).toBe(' text <del class="diffmod">19.12.2022</del><ins class="diffmod">20.12.2022</ins>')
  })

  test(`when blocksExpression.compareBy specified - will group part of string that match (blocksExpression.exp)
        into one token and compare by match from (blocksExpression.compareBy)`, ({ expect }) => {
    expect(
      diff(
        `<img src="./image.png" title="title-1" />`, // "title" attr the same; "src" - attr - not
        `<img src="./other.png" title="title-1" />`, // "title" attr the same; "src" - attr - not
        {
          blocksExpression: [
            {
              exp: /<img[\s\S]+?\/>/g, // match <img/> tag
              compareBy: /title="[\s\S]+?"/g, // compare only by title="" attribute
            },
          ],
        },
      ),
    ).toBe(`<img src="./other.png" title="title-1" />`) // same, because we compared by title

    expect(
      diff(
        `<img src="./image.png" title="title-1" />`, // "title" attr now different;
        `<img src="./other.png" title="other-title" />`, // "title" attr now different;
        {
          blocksExpression: [
            {
              exp: /<img[\s\S]+?\/>/g, // match <img/> tag
              compareBy: /title="[\s\S]+?"/g, // compare only by title="" attribute
            },
          ],
        },
      ),
    ).toBe(
      `<del class="diffmod"><img src="./image.png" title="title-1" /></del><ins class="diffmod"><img src="./other.png" title="other-title" /></ins>`,
    ) // different, because we compared by title
  })
})
