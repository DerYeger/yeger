import type { FOLFragment, Model, TreeNode, VariableAssignment } from '~/model'

export interface Term extends FOLFragment {
  interpret(model: Model, variableAssignment: VariableAssignment): number
}

export class ConstantTerm implements Term {
  public constructor(public readonly name: string) {}

  public text(): string {
    return this.name
  }

  public children(): TreeNode[] {
    return []
  }

  public depth(): number {
    return 0
  }

  public toFormattedString(): string {
    return this.name
  }

  public interpret(model: Model): number {
    const interpreted = model.getConstantByName(this.name)
    if (interpreted === undefined) {
      throw new Error(`Missing constant ${this.name}`)
    }
    return interpreted
  }
}

export class FunctionTerm implements Term {
  public constructor(
    public readonly name: string,
    public readonly argumentTerms: Term[]
  ) {}

  public text(): string {
    return `${this.name}()`
  }

  public children(): TreeNode[] {
    return this.argumentTerms
  }

  public depth(): number {
    return Math.max(...this.children().map((child) => child.depth())) + 1
  }

  public toFormattedString(): string {
    return `${this.name}(${this.argumentTerms
      .map((argument) => argument.toFormattedString())
      .join(',')})`
  }

  public interpret(
    model: Model,
    variableAssignment: VariableAssignment
  ): number {
    const func = model.getFunctionByName(this.name)
    if (func === undefined) {
      throw new Error(`Missing function: ${this.name}.`)
    }
    const interpretedArguments = this.argumentTerms.map((argument) =>
      argument.interpret(model, variableAssignment)
    )
    return func.apply(...interpretedArguments)
  }
}

export class BoundVariable implements Term {
  public constructor(public readonly name: string) {}

  public text(): string {
    return this.name
  }

  public children(): TreeNode[] {
    return []
  }

  public depth(): number {
    return 0
  }

  public toFormattedString(): string {
    return this.name
  }

  public interpret(_: Model, variableAssignment: VariableAssignment): number {
    return variableAssignment[this.name]
  }
}
