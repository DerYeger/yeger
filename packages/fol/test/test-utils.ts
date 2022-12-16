import type { Model } from '~/fol'

const validFormulas = [
  'ff',
  'tt',
  '!tt',
  '!ff',
  'tt || tt',
  'tt && tt',
  'tt -> tt',
  'tt <-> tt',
  'tt || ff && tt',
  '(tt || ff) && tt',
  'exists a . tt',
  'forall a. tt',
  'Relation(x)',
  'myConstant = myConstant',
  'myRelation(MyFunction(someConstant, AnotherConstant))',
  '!tt && !(ff && tt)',
  '!(tt && !(ff) && tt)',
  '!(tt && !ff) && tt',
  'a = b',
  'f(x) = y',
  'a = f(a,b)',
  'f(a) = a',
  'f(g(x)) = y',
  'A(x)',
  'A(x,y)',
  '!A(x)',
  'A(x) && B(x)',
  'A(x) & B(x)',
  'A(x) || B(x)',
  'A(x) | B(x)',
  'A(x) -> B(x)',
  'A(x) <-> B(x)',
  'exists x. A(x)',
  'forall x. A(x)',
  'forall x. forall y. A(x, y)',
  '(forall x. A(x)) && (exists x. B(x))',
  'forall x. exists y. forall z. f(x) = y && R(y,z) && R(z,y) || (f(x) = x -> f(z) = a <-> ff)',
  'forall x. forall y. h(x,y) = x',
]

const invalidFormulas = [
  'tt)',
  '(tt || ff',
  'exists . A(x)',
  'exists x.',
  'exists x. exists x. x == x',
  '(tt',
  '(tt &&',
  'y = f(x,y',
]

const validModels: Model[] = [
  {
    nodes: new Set([1, 2]),
    functions: {
      binary: {
        h: {
          1: {
            1: 1,
            2: 1,
          },
          2: {
            1: 2,
            2: 2,
          },
        },
      },
      constants: {
        a: 1,
        b: 2,
        d: 1,
        second: 2,
      },
      unary: {
        f: {
          1: 2,
          2: 2,
        },
        myFunction: {
          1: 1,
          2: 2,
        },
      },
    },
    relations: {
      binary: {
        A: {
          1: new Set([1]),
        },
        MyRelation: {
          1: new Set([2]),
        },
      },
      unary: {
        B: new Set([2]),
        C: new Set([1, 2]),
      },
    },
  },
]

const invalidModels: [string, Model][] = [
  [
    'invalid constant',
    {
      nodes: new Set([1, 2]),
      functions: {
        binary: {},
        constants: {
          a: 3,
        },
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'non-total unary function',
    {
      nodes: new Set([1, 2]),
      functions: {
        binary: {},
        constants: {},
        unary: {
          f: {
            1: 1,
          },
        },
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'non-total binary function',
    {
      nodes: new Set([1, 2]),
      functions: {
        binary: {
          f: {
            1: {
              1: 1,
              2: 1,
            },
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'non-total curried binary function',
    {
      nodes: new Set([1, 2]),
      functions: {
        binary: {
          f: {
            1: {
              1: 1,
              2: 1,
            },
            2: {
              1: 1,
            },
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial constant',
    {
      nodes: new Set([1]),
      functions: {
        binary: {},
        constants: {
          c: undefined,
        },
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'out-of-domain constant',
    {
      nodes: new Set([1]),
      functions: {
        binary: {},
        constants: {
          c: 2,
        },
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial unary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {},
        constants: {},
        unary: {
          f: undefined,
        },
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial-range unary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {},
        constants: {},
        unary: {
          f: {
            1: undefined,
          },
        },
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'out-of-domain unary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {},
        constants: {},
        unary: {
          f: {
            1: 1,
            2: 1,
          },
        },
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'out-of-range unary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {},
        constants: {},
        unary: {
          f: {
            1: 2,
          },
        },
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial-domain binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: undefined,
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial-domain-curried binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: {
            1: undefined,
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: undefined,
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'partial-range binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: {
            1: {
              1: undefined,
            },
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'out-of-domain binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: {
            1: {
              1: 1,
            },
            2: {
              1: 1,
            },
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'out-of-domain curried binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: {
            1: {
              1: 1,
              2: 1,
            },
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
  [
    'out-of-range binary function',
    {
      nodes: new Set([1]),
      functions: {
        binary: {
          f: {
            1: {
              1: 2,
            },
          },
        },
        constants: {},
        unary: {},
      },
      relations: {
        binary: {},
        unary: {},
      },
    },
  ],
]

export const TestData = {
  invalidFormulas,
  invalidModels,
  validFormulas,
  validModels,
} as const
