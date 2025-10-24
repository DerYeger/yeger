import { Function, Model, Relation } from '../src/index'

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

const testModel = new Model(
  new Set([1, 2]),
  { a: 1, b: 1, d: 1, second: 2 },
  [
    new Function('f', 1, { '1': 2, '2': 2 }),
    new Function('myFunction', 1, { '1': 1, '2': 2 }),
    new Function('h', 2, { '1,1': 1, '1,2': 1, '2,1': 2, '2,2': 2 }),
  ],
  [
    new Relation('A', 2, new Set(['1,1'])),
    new Relation('MyRelation', 2, new Set(['1,2'])),
    new Relation('B', 1, new Set(['1'])),
    new Relation('C', 1, new Set(['1', '2'])),
    new Relation('D', 1, new Set(['2'])),
  ],
)

const validModels: Model[] = [testModel]

const invalidModels: [string, Model][] = [
  [
    'non-total function',
    new Model(
      new Set([1]),
      {},
      [new Function('f', 2, { '1,1': 1, '1,2': 1, '2,1': 1 })],
      [],
    ),
  ],
  ['out-of-range constant', new Model(new Set([1]), { c: 2 }, [], [])],
  [
    'out-of-domain function',
    new Model(new Set([1]), {}, [new Function('f', 1, { '1': 1, '2': 1 })], []),
  ],
  [
    'out-of-range function',
    new Model(new Set([1]), {}, [new Function('f', 1, { '1': 2 })], []),
  ],
]

export const TestData = {
  invalidFormulas,
  invalidModels,
  testModel,
  validFormulas,
  validModels,
} as const
