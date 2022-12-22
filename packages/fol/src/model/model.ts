export type VariableAssignment = Record<string, number>

export class Model {
  public readonly functions: Record<string, Function>
  public readonly relations: Record<string, Relation>

  public constructor(
    public readonly domain: Set<number>,
    public readonly constants: Record<string, number>,
    functions: Function[],
    relations: Relation[]
  ) {
    this.functions = Object.fromEntries(
      functions.map((func) => [func.name, func])
    )
    this.relations = Object.fromEntries(
      relations.map((relation) => [relation.name, relation])
    )
  }

  public getConstantByName(name: string): number | undefined {
    return this.constants[name]
  }

  public getFunctionByName(name: string): Function | undefined {
    return this.functions[name]
  }

  public getRelationByName(name: string): Relation | undefined {
    return this.relations[name]
  }
}

function generateAllArguments(domain: number[], remaining: number): string[] {
  if (remaining === 1) {
    return domain.map((element) => element.toString())
  }
  return generateAllArguments(domain, remaining - 1).flatMap((partial) =>
    domain.map((element) => `${element},${partial}`)
  )
}

export class Function {
  public constructor(
    public readonly name: string,
    public readonly arity: number,
    public readonly data: Record<string, number>
  ) {}

  public apply(...args: number[]): number {
    if (args.length !== this.arity) {
      throw new Error(
        `Arity mismatch for function ${this.name}. Expected ${this.arity} but received ${args.length}.`
      )
    }
    const result = this.data[args.join(',')]
    if (result === undefined) {
      throw new Error(
        `Function ${this.name} is not total. ${this.name}(${args.join(
          ', '
        )}) is not defined.`
      )
    }
    return result
  }

  public isTotal(domain: number[]): boolean {
    return generateAllArguments(domain, this.arity).every(
      (args) => this.data[args] !== undefined
    )
  }
}

export class Relation {
  public constructor(
    public readonly name: string,
    public readonly arity: number,
    public readonly data: Set<string>
  ) {}

  public includes(...args: number[]): boolean {
    if (args.length !== this.arity) {
      throw new Error(
        `Arity mismatch for relation ${this.name}. Expected ${this.arity} but received ${args.length}.`
      )
    }
    return this.data.has(args.join(','))
  }
}
