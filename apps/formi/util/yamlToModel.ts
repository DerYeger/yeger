import { Function, Model, Relation } from '@yeger/fol'
import type { Result } from 'resumon'
import { Err, Ok } from 'resumon'
import type { YAMLParseError } from 'yaml'
import { parse } from 'yaml'
import type { ZodError } from 'zod'
import z from 'zod'

export function jsonToModel(input: unknown): Result<Model, string> {
  return parseJson(input).andThen(jsonModelToModel)
}

export function yamlToJson(input: string): Result<unknown, string> {
  try {
    return new Ok(parse(input))
  } catch (err) {
    return new Err((err as YAMLParseError).message)
  }
}

const ElementSchema = z.number().int().positive()

const ElementTupleSchema = z.preprocess(
  (raw) =>
    z
      .string()
      .regex(/\d+,\d+/)
      .parse(raw)
      .split(',')
      .map((element) => Number.parseInt(element)),
  z.tuple([ElementSchema, ElementSchema])
)

const UnaryRelationSchema = z.array(
  ElementSchema.transform((element) => [element] satisfies [number])
)
const BinaryRelationSchema = z.array(ElementTupleSchema)
const RelationSchema = z.union([UnaryRelationSchema, BinaryRelationSchema])

const JsonModelSchema = z.object({
  domain: z.array(ElementSchema).min(1),
  constants: z.record(z.string(), ElementSchema).optional(),
  functions: z.record(z.string(), BinaryRelationSchema).optional(),
  relations: z.record(z.string(), RelationSchema).optional(),
})

type JsonModel = z.infer<typeof JsonModelSchema>

function parseJson(input: unknown): Result<JsonModel, string> {
  try {
    return new Ok(JsonModelSchema.parse(input))
  } catch (err) {
    const error = err as ZodError
    const { message, path } = error.issues[0]
    const messageWithPath = `${message}\nError location: ${path.join(' ⭢ ')}`
    return new Err(path.length > 0 ? messageWithPath : message)
  }
}

function jsonModelToModel(jsonModel: JsonModel): Result<Model, string> {
  const domain = jsonModel.domain.map((element) => +element)

  const relations = Object.entries(jsonModel.relations ?? {}).map(
    ([name, data]) => {
      if (data.length > 0 && data[0].length > 1) {
        return new Relation(
          name,
          data[0].length,
          new Set(data.map((entries) => entries.join(',')))
        )
      }
      return new Relation(
        name,
        1,
        new Set(data.map(([element]) => element.toString()))
      )
    }
  )

  const functions = Object.entries(jsonModel.functions ?? {}).map(
    ([name, data]) => {
      const mapping = new Map<string, number>()
      data.forEach(([arg, result]) => mapping.set(arg.toString(), result))
      return new Function(name, 1, Object.fromEntries(mapping.entries()))
    }
  )

  const model = new Model(
    new Set([...domain]),
    jsonModel.constants ?? {},
    functions,
    relations
  )
  return new Ok(model)
}
