export type VariableAssignment = Record<string, number>

export type UnsafeRecord<T extends string | number, U> = Partial<Record<T, U>>

export type Constants = UnsafeRecord<string, number>
type UnaryFunctions = UnsafeRecord<string, UnsafeRecord<number, number>>

type BinaryFunctions = UnsafeRecord<
  string,
  UnsafeRecord<number, UnsafeRecord<number, number>>
>

type UnaryRelations = UnsafeRecord<string, Set<number>>

type BinaryRelations = UnsafeRecord<string, UnsafeRecord<number, Set<number>>>

export interface Model {
  readonly nodes: Set<number>
  readonly functions: {
    readonly binary: BinaryFunctions
    readonly constants: Constants
    readonly unary: UnaryFunctions
  }
  readonly relations: {
    readonly binary: BinaryRelations
    readonly unary: UnaryRelations
  }
}

export interface TreeNode {
  symbol: string
  children: TreeNode[] | undefined
}

export interface FOLFragment {
  toFormattedString(): string
}

export interface Formula extends FOLFragment {
  evaluate(model: Model, variableAssignment: VariableAssignment): boolean
  toTree(): TreeNode
}

export class ParenthesizedFormula implements Formula {
  public constructor(public readonly inner: Formula) {}

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return this.inner.evaluate(model, variableAssignment)
  }

  public toFormattedString(): string {
    return `(${this.inner.toFormattedString()})`
  }

  public toTree(): TreeNode {
    return {
      symbol: '()',
      children: [this.inner.toTree()],
    }
  }
}

export abstract class BinaryFormula implements Formula {
  public constructor(
    public readonly left: Formula,
    public readonly operator: string,
    public readonly right: Formula
  ) {}

  public abstract evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean

  public toFormattedString(): string {
    return `${this.left.toFormattedString()} ${
      this.operator
    } ${this.right.toFormattedString()}`
  }

  public abstract toTree(): TreeNode
}

const orSymbol = '\u2228'
export class OrFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, orSymbol, right)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return (
      this.left.evaluate(model, variableAssignment) ||
      this.right.evaluate(model, variableAssignment)
    )
  }

  public toTree(): TreeNode {
    return {
      symbol: orSymbol,
      children: [this.left.toTree(), this.right.toTree()],
    }
  }
}

const andSymbol = '\u2227'
export class AndFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, andSymbol, right)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return (
      this.left.evaluate(model, variableAssignment) &&
      this.right.evaluate(model, variableAssignment)
    )
  }

  public toTree(): TreeNode {
    return {
      symbol: andSymbol,
      children: [this.left.toTree(), this.right.toTree()],
    }
  }
}

const implSymbol = '\u2192'
export class ImplFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, implSymbol, right)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return (
      !this.left.evaluate(model, variableAssignment) ||
      this.right.evaluate(model, variableAssignment)
    )
  }

  public toTree(): TreeNode {
    return {
      symbol: implSymbol,
      children: [this.left.toTree(), this.right.toTree()],
    }
  }
}

const biImplSymbol = '\u2194'
export class BiImplFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, biImplSymbol, right)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const left = this.left.evaluate(model, variableAssignment)
    const right = this.right.evaluate(model, variableAssignment)
    return (left && right) || (!left && !right)
  }

  public toTree(): TreeNode {
    return {
      symbol: biImplSymbol,
      children: [this.left.toTree(), this.right.toTree()],
    }
  }
}

export abstract class UnaryFormula implements Formula {
  public constructor(
    public readonly inner: Formula,
    public readonly operator: string
  ) {}

  public abstract evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean

  public toFormattedString(): string {
    return `${this.operator}(${this.inner.toFormattedString()})`
  }

  public abstract toTree(): TreeNode
}

const notSymbol = '\u00AC'
export class NotFormula extends UnaryFormula {
  public constructor(inner: Formula) {
    super(inner, notSymbol)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return !this.inner.evaluate(model, variableAssignment)
  }

  public toTree(): TreeNode {
    return {
      symbol: notSymbol,
      children: [this.inner.toTree()],
    }
  }
}

export abstract class QuantorFormula implements Formula {
  public constructor(
    public readonly variable: BoundVariable,
    public readonly inner: Formula,
    public readonly quantor: string
  ) {}

  public abstract evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean

  public toFormattedString(): string {
    return `${
      this.quantor
    } ${this.variable.toFormattedString()}. ${this.inner.toFormattedString()}`
  }

  public abstract toTree(): TreeNode
}

const universalQuantorSymbol = '\u2200'
export class UniversalQuantorFormula extends QuantorFormula {
  public constructor(variable: BoundVariable, inner: Formula) {
    super(variable, inner, universalQuantorSymbol)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    for (const node of model.nodes.values()) {
      const newAssignment = {
        ...variableAssignment,
        [this.variable.name]: node,
      }
      if (!this.inner.evaluate(model, newAssignment)) {
        return false
      }
    }
    return true
  }

  public toTree(): TreeNode {
    return {
      symbol: universalQuantorSymbol,
      children: [this.inner.toTree()],
    }
  }
}

const existentialQuantorSymbol = '\u2203'
export class ExistentialQuantorFormula extends QuantorFormula {
  public constructor(variable: BoundVariable, inner: Formula) {
    super(variable, inner, existentialQuantorSymbol)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    for (const node of model.nodes.values()) {
      const newAssignment = {
        ...variableAssignment,
        [this.variable.name]: node,
      }
      if (this.inner.evaluate(model, newAssignment)) {
        return true
      }
    }
    return false
  }

  public toTree(): TreeNode {
    return {
      symbol: existentialQuantorSymbol,
      children: [this.inner.toTree()],
    }
  }
}

export interface Relation extends Formula {}

export class BooleanLiteral implements Formula {
  private constructor(
    public readonly stringRepresentation: string,
    public readonly value: boolean
  ) {}

  public evaluate(): boolean {
    return this.value
  }

  public toFormattedString(): string {
    return this.stringRepresentation
  }

  public toTree(): TreeNode {
    return {
      symbol: this.toFormattedString(),
      children: [],
    }
  }

  public static readonly True = new BooleanLiteral('tt', true)
  public static readonly False = new BooleanLiteral('ff', false)
}

export class UnaryRelation implements Relation {
  public constructor(
    public readonly name: string,
    public readonly expression: Expression
  ) {}

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const relation = model.relations.unary[this.name]
    if (!relation) {
      throw new Error(`Missing unary relation ${this.name}`)
    }
    const interpreted = this.expression.interpret(model, variableAssignment)
    return relation.has(interpreted)
  }

  public toFormattedString(): string {
    return `${this.name}(${this.expression.toFormattedString()})`
  }

  public toTree(): TreeNode {
    return {
      symbol: this.toFormattedString(),
      children: [],
    }
  }
}

export class BinaryRelation implements Relation {
  public constructor(
    public readonly name: string,
    public readonly firstExpression: Expression,
    public readonly secondExpression: Expression
  ) {}

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const relation = model.relations.binary[this.name]
    if (!relation) {
      throw new Error(`Missing binary relation ${this.name}`)
    }

    const firstInterpreted = this.firstExpression.interpret(
      model,
      variableAssignment
    )
    const tupleCandidates = relation[firstInterpreted]
    if (!tupleCandidates) {
      return false
    }

    const secondInterpreted = this.secondExpression.interpret(
      model,
      variableAssignment
    )
    return tupleCandidates.has(secondInterpreted)
  }

  public toFormattedString(): string {
    return `${
      this.name
    }(${this.firstExpression.toFormattedString()}, ${this.secondExpression.toFormattedString()})`
  }

  public toTree(): TreeNode {
    return {
      symbol: this.toFormattedString(),
      children: [],
    }
  }
}

export class EqualityRelation implements Relation {
  public constructor(
    public readonly firstExpression: Expression,
    public readonly secondExpression: Expression
  ) {}

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const firstInterpreted = this.firstExpression.interpret(
      model,
      variableAssignment
    )
    const secondInterpreted = this.secondExpression.interpret(
      model,
      variableAssignment
    )
    return firstInterpreted === secondInterpreted
  }

  public toFormattedString(): string {
    return `${this.firstExpression.toFormattedString()} = ${this.firstExpression.toFormattedString()}`
  }

  public toTree(): TreeNode {
    return {
      symbol: this.toFormattedString(),
      children: [],
    }
  }
}

export interface Expression extends FOLFragment {
  interpret(model: Model, variableAssignment: VariableAssignment): number
}

export class Constant implements Expression {
  public constructor(public readonly name: string) {}

  public toFormattedString(): string {
    return this.name
  }

  public interpret(model: Model): number {
    const interpreted = model.functions.constants[this.name]
    if (interpreted === undefined) {
      throw new Error(`Missing constant ${this.name}`)
    }
    return interpreted
  }
}

export class UnaryFunction implements Expression {
  public constructor(
    public readonly name: string,
    public readonly inner: Expression
  ) {}

  public toFormattedString(): string {
    return `${this.name}(${this.inner.toFormattedString()})`
  }

  public interpret(
    model: Model,
    variableAssignment: VariableAssignment
  ): number {
    const unaryFunction = model.functions.unary[this.name]
    if (unaryFunction === undefined) {
      throw new Error(`Missing unary function ${this.name}`)
    }
    const innerInterpreted = this.inner.interpret(model, variableAssignment)
    const interpreted = unaryFunction[innerInterpreted]
    if (interpreted === undefined) {
      throw new Error(
        `Non-total unary function ${this.name}(${innerInterpreted})`
      )
    }
    return interpreted
  }
}

export class BinaryFunction implements Expression {
  public constructor(
    public readonly name: string,
    public readonly firstArgument: Expression,
    public readonly secondArgument: Expression
  ) {}

  public toFormattedString(): string {
    return `${
      this.name
    }(${this.firstArgument.toFormattedString()}, ${this.secondArgument.toFormattedString()})`
  }

  public interpret(
    model: Model,
    variableAssignment: VariableAssignment
  ): number {
    const binaryFunction = model.functions.binary[this.name]
    if (binaryFunction === undefined) {
      throw new Error(`Missing binary function ${this.name}`)
    }
    const firstInterpreted = this.firstArgument.interpret(
      model,
      variableAssignment
    )
    const curriedFunction = binaryFunction[firstInterpreted]
    if (curriedFunction === undefined) {
      throw new Error(
        `Non-total binary function ${this.name}(${firstInterpreted}, ...)`
      )
    }
    const secondInterpreted = this.secondArgument.interpret(
      model,
      variableAssignment
    )
    const interpreted = curriedFunction[secondInterpreted]
    if (interpreted === undefined) {
      throw new Error(
        `Non-total binary function ${this.name}(${firstInterpreted}, ${secondInterpreted})`
      )
    }
    return interpreted
  }
}

export class BoundVariable implements Expression {
  public constructor(public readonly name: string) {}

  public toFormattedString(): string {
    return this.name
  }

  public interpret(_: Model, variableAssignment: VariableAssignment): number {
    return variableAssignment[this.name]
  }
}
