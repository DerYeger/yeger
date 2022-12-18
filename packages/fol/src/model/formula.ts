import type { BoundVariable, Model, Term, VariableAssignment } from '~/model'

export interface TreeNode {
  text(): string
  children(): TreeNode[]
  depth(): number
}

export interface FOLFragment extends TreeNode {
  toFormattedString(): string
}

export type ModelCheckerMode = 'lazy' | 'eager'

export class ModelCheckerTrace implements TreeNode {
  public constructor(
    public readonly mode: ModelCheckerMode,
    public readonly formula: Formula,
    public readonly expected: boolean,
    public readonly actual: boolean,
    private readonly childTraces: ModelCheckerTrace[]
  ) {}

  public text(): string {
    throw new Error('Method not implemented.')
  }

  public children(): TreeNode[] {
    return this.childTraces
  }

  public depth(): number {
    return Math.max(...this.children().map((child) => child.depth())) + 1
  }
}

export interface Formula extends FOLFragment {
  evaluate(model: Model, variableAssignment: VariableAssignment): boolean

  traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace
}

export class ParenthesizedFormula implements Formula {
  public constructor(public readonly inner: Formula) {}

  public text(): string {
    return '()'
  }

  public children(): TreeNode[] {
    return [this.inner]
  }

  public depth(): number {
    return this.inner.depth() + 1
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return this.inner.evaluate(model, variableAssignment)
  }

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    const innerTrace = this.inner.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    return new ModelCheckerTrace(mode, this, expected, innerTrace.actual, [
      innerTrace,
    ])
  }

  public toFormattedString(): string {
    return `(${this.inner.toFormattedString()})`
  }
}

export abstract class BinaryFormula implements Formula {
  public constructor(
    public readonly left: Formula,
    public readonly operator: string,
    public readonly right: Formula
  ) {}

  public text(): string {
    return this.operator
  }

  public children(): TreeNode[] {
    return [this.left, this.right]
  }

  public depth(): number {
    return Math.max(this.left.depth(), this.right.depth()) + 1
  }

  public abstract evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean

  public abstract traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace

  public toFormattedString(): string {
    return `${this.left.toFormattedString()} ${
      this.operator
    } ${this.right.toFormattedString()}`
  }
}
export class OrFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, '\u2228', right)
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

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    const left = this.left.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    if (mode === 'lazy' && left.actual) {
      return new ModelCheckerTrace(mode, this, expected, true, [left])
    }
    const right = this.right.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    return new ModelCheckerTrace(
      mode,
      this,
      expected,
      left.actual || right.actual,
      [left, right]
    )
  }
}

export class AndFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, '\u2227', right)
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

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    const left = this.left.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    if (mode === 'lazy' && !left.actual) {
      return new ModelCheckerTrace(mode, this, expected, false, [left])
    }
    const right = this.right.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    return new ModelCheckerTrace(
      mode,
      this,
      expected,
      left.actual && right.actual,
      [left, right]
    )
  }
}
export class ImplicationFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, '\u2192', right)
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

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    const left = this.left.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    if (mode === 'lazy' && !left.actual) {
      return new ModelCheckerTrace(mode, this, expected, true, [left])
    }
    const right = this.right.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    return new ModelCheckerTrace(
      mode,
      this,
      expected,
      !left.actual || right.actual,
      [left, right]
    )
  }
}
export class BiImplicationFormula extends BinaryFormula {
  public constructor(left: Formula, right: Formula) {
    super(left, '\u2194', right)
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const left = this.left.evaluate(model, variableAssignment)
    const right = this.right.evaluate(model, variableAssignment)
    return (left && right) || (!left && !right)
  }

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    const left = this.left.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    const right = this.right.traceEvaluation(
      mode,
      expected,
      model,
      variableAssignment
    )
    return new ModelCheckerTrace(
      mode,
      this,
      expected,
      (!left.actual && !right.actual) || (left.actual && right.actual),
      [left, right]
    )
  }
}

export abstract class UnaryFormula implements Formula {
  public constructor(
    public readonly inner: Formula,
    public readonly operator: string
  ) {}

  public text(): string {
    return this.operator
  }

  public children(): TreeNode[] {
    return [this.inner]
  }

  public depth(): number {
    return this.inner.depth() + 1
  }

  public abstract evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean

  public abstract traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace

  public toFormattedString(): string {
    return `${this.operator}(${this.inner.toFormattedString()})`
  }
}

export class NotFormula extends UnaryFormula {
  public constructor(inner: Formula) {
    super(inner, '\u00AC')
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    return !this.inner.evaluate(model, variableAssignment)
  }

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    const innerTrace = this.inner.traceEvaluation(
      mode,
      !expected,
      model,
      variableAssignment
    )
    return new ModelCheckerTrace(mode, this, expected, !innerTrace.actual, [
      innerTrace,
    ])
  }
}

export abstract class QuantorFormula implements Formula {
  public constructor(
    public readonly variable: BoundVariable,
    public readonly inner: Formula,
    public readonly quantor: string
  ) {}

  public text(): string {
    return `${this.quantor}${this.variable.name}`
  }

  public children(): TreeNode[] {
    return [this.inner]
  }

  public depth(): number {
    return this.inner.depth() + 1
  }

  public abstract evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean

  public abstract traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace

  public toFormattedString(): string {
    return `${this.text()}. ${this.inner.toFormattedString()}`
  }
}

export class UniversalQuantorFormula extends QuantorFormula {
  public constructor(variable: BoundVariable, inner: Formula) {
    super(variable, inner, '\u2200')
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    for (const node of model.domain.values()) {
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

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    let actual = true
    const childTraces: ModelCheckerTrace[] = []
    for (const node of model.domain.values()) {
      const newAssignment = {
        ...variableAssignment,
        [this.variable.name]: node,
      }
      const innerTrace = this.inner.traceEvaluation(
        mode,
        expected,
        model,
        newAssignment
      )
      if (!innerTrace.actual) {
        actual = false
        if (mode === 'lazy') {
          return new ModelCheckerTrace(mode, this, expected, false, [
            innerTrace,
          ])
        }
      }
      childTraces.push(innerTrace)
    }
    return new ModelCheckerTrace(mode, this, expected, actual, childTraces)
  }
}

export class ExistentialQuantorFormula extends QuantorFormula {
  public constructor(variable: BoundVariable, inner: Formula) {
    super(variable, inner, '\u2203')
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    for (const node of model.domain.values()) {
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

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    let actual = false
    const childTraces: ModelCheckerTrace[] = []
    for (const node of model.domain.values()) {
      const newAssignment = {
        ...variableAssignment,
        [this.variable.name]: node,
      }
      const innerTrace = this.inner.traceEvaluation(
        mode,
        expected,
        model,
        newAssignment
      )
      if (innerTrace.actual) {
        actual = true
        if (mode === 'lazy') {
          return new ModelCheckerTrace(mode, this, expected, actual, [
            innerTrace,
          ])
        }
      }
      childTraces.push(innerTrace)
    }
    return new ModelCheckerTrace(mode, this, expected, actual, childTraces)
  }
}

export class BooleanLiteral implements Formula {
  private constructor(
    public readonly name: string,
    public readonly value: boolean
  ) {}

  public text(): string {
    return this.name
  }

  public children(): TreeNode[] {
    return []
  }

  public depth(): number {
    return 0
  }

  public evaluate(): boolean {
    return this.value
  }

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    _model: Model,
    _variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    return new ModelCheckerTrace(mode, this, expected, this.evaluate(), [])
  }

  public toFormattedString(): string {
    return this.name
  }

  public static readonly True = new BooleanLiteral('\u22A4', true)
  public static readonly False = new BooleanLiteral('\u22A5', false)
}

export class RelationFormula implements Formula {
  public constructor(
    public readonly name: string,
    public readonly terms: Term[]
  ) {}

  public text(): string {
    return this.name
  }

  public children(): TreeNode[] {
    return this.terms
  }

  public depth(): number {
    return Math.max(...this.terms.map((term) => term.depth())) + 1
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const relation = model.getRelationByName(this.name)
    if (!relation) {
      throw new Error(`Missing relation: ${this.name}.`)
    }
    return relation.includes(
      ...this.terms.map((term) => term.interpret(model, variableAssignment))
    )
  }

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    return new ModelCheckerTrace(
      mode,
      this,
      expected,
      this.evaluate(model, variableAssignment),
      []
    )
  }

  public toFormattedString(): string {
    return `${this.name}(${this.terms
      .map((term) => term.toFormattedString())
      .join(',')})`
  }
}

export class EqualityRelationFormula implements Formula {
  public constructor(
    public readonly firstTerm: Term,
    public readonly secondTerm: Term
  ) {}

  public text(): string {
    return '='
  }

  public children(): TreeNode[] {
    return [this.firstTerm, this.secondTerm]
  }

  public depth(): number {
    return Math.max(this.firstTerm.depth(), this.secondTerm.depth()) + 1
  }

  public evaluate(
    model: Model,
    variableAssignment: VariableAssignment
  ): boolean {
    const firstInterpreted = this.firstTerm.interpret(model, variableAssignment)
    const secondInterpreted = this.secondTerm.interpret(
      model,
      variableAssignment
    )
    return firstInterpreted === secondInterpreted
  }

  public traceEvaluation(
    mode: ModelCheckerMode,
    expected: boolean,
    model: Model,
    variableAssignment: VariableAssignment
  ): ModelCheckerTrace {
    return new ModelCheckerTrace(
      mode,
      this,
      expected,
      this.evaluate(model, variableAssignment),
      []
    )
  }

  public toFormattedString(): string {
    return `${this.firstTerm.toFormattedString()} = ${this.secondTerm.toFormattedString()}`
  }
}
