import type { FOLFragment, Model, VariableAssignment } from '~/model'

export interface Term extends FOLFragment {
  interpret(model: Model, variableAssignment: VariableAssignment): number
}

export class ConstantTerm implements Term {
  public constructor(public readonly name: string) {}

  public text(): string {
    return this.name
  }

  public children(): Term[] {
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
      throw new Error(`Model is missing the constant ${this.name}.`)
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

  public children(): Term[] {
    return this.argumentTerms
  }

  public depth(): number {
    return Math.max(...this.children().map((child) => child.depth())) + 1
  }

  public toFormattedString(variableAssignment?: VariableAssignment): string {
    return `${this.name}(${this.argumentTerms
      .map((argument) => argument.toFormattedString(variableAssignment))
      .join(',')})`
  }

  public interpret(
    model: Model,
    variableAssignment: VariableAssignment
  ): number {
    const func = model.getFunctionByName(this.name)
    if (func === undefined) {
      throw new Error(`Model is missing the function ${this.name}.`)
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

  public children(): Term[] {
    return []
  }

  public depth(): number {
    return 0
  }

  public toFormattedString(variableAssignment?: VariableAssignment): string {
    return variableAssignment?.[this.name]?.toString() ?? this.name
  }

  public interpret(_: Model, variableAssignment: VariableAssignment): number {
    const interpreted = variableAssignment[this.name]
    if (interpreted === undefined) {
      throw new Error(`Variable ${this.name} is not assigned.`)
    }
    return interpreted
  }
}
