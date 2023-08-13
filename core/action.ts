import type { ZodType } from 'zod'
import type { MaybePromise } from '~/shared'

/**
 * A parser function, which can be used to parse input/output data into
 * a consistent type and throw errors if the data is invalid.
 */
type Parser<TData> = ZodType<TData>

type ActionBase<TOut, TMeta> = {
  /**
   * Optional name, overrides the key in the actions object when used
   * for AI reasoning.
   */
  name?: string
  /**
   * A description or other hints about the action. This can be used to
   * enhance AI reasoning about the action, or optionally to display to
   * users in UI.
   */
  description?: string
  /**
   * Extendable metadata about the action. This can be used for anything
   * that isn't covered by the other properties, e.g. icon names/URLs,
   * etc.
   */
  metadata?: TMeta
  /**
   * The output parser function to run after the action is executed.
   * This is optional and not explicitly recommended, but can be used to
   * enhance AI reasoning.
   */
  outputParser?: Parser<TOut>
}

type NullaryAction<TOut, TMeta> = ActionBase<TOut, TMeta> & {
  /** Used to differentiate between nullary and unary actions. */
  arity: 'nullary'
  /**
   * The middleware functions to run before the action is executed.
   * These can be used to perform any kind of pre-processing, such as
   * logging, analytics, etc.
   */
  middlewares?: (() => MaybePromise<void>)[]
  /**
   * The handler function to run when the action is executed. This is
   * the main function of the action, and should be where the bulk of
   * the logic is implemented, other than the output parser.
   *
   * As a general rule, you should not call this function directly from
   * your `Action`, but instead use the `call` method, as this will not
   * run any middlewares nor the output parser.
   */
  internalHandler: () => MaybePromise<TOut>
  /**
   * Execute the action.
   *
   * This is the method you should use to trigger your `Action`, as it
   * runs the output parser as well as middlewares. It is also what the
   * workflow runner will call. May throw an error.
   */
  call: () => MaybePromise<TOut>
}

type UnaryAction<TIn, TOut, TMeta> = ActionBase<TOut, TMeta> & {
  /** Used to differentiate between nullary and unary actions. */
  arity: 'unary'
  /**
   * The middleware functions to run before the action is executed.
   * These can be used to perform any kind of pre-processing, such as
   * logging, analytics, etc.
   */
  middlewares?: ((input: TIn) => MaybePromise<TIn>)[]
  /**
   * The input parser function to run before the action is executed.
   * This is used to protect the action from invalid input, and to
   * provide a consistent input type to the action handler.
   */
  inputParser: Parser<TIn>
  /**
   * The handler function to run when the action is executed. This is
   * the main function of the action, and should be where the bulk of
   * the logic is implemented, other than the input/output parsers.
   *
   * It is safe to assume that the input has been parsed and is valid
   * when this function is called from the `call` method.
   *
   * As a general rule, you should not call this function directly from
   * your `Action`, but instead use the `call` method, as this will not
   * run any middlewares nor the input and output parsers.
   */
  internalHandler: (input: TIn) => MaybePromise<TOut>
  /**
   * Execute the action with the given input.
   *
   * This is the method you should use to trigger your `Action`, as it
   * runs the input and output parsers as well as middlewares. It is
   * also what the workflow runner will call. May throw an error.
   */
  call: (input: TIn) => MaybePromise<TOut>
}

/**
 * A Lusat action. Actions are wrapped functions that can be used in a
 * number of ways, including:
 *
 * - As AI-driven code, like an inverse remote procedure call (RPC).
 * - As a hotkey, like a keyboard shortcut.
 * - As a rich command, like a command menu (e.g. `cmd+k`) item.
 * - Directly, like a function call.
 *
 * Actions are designed to be versatile and flexible, written once and
 * used in multiple places across your app. They can be augmented with
 * metadata to provide additional context to the AI, or to display to
 * users in UI, such as providing icons to buttons or menu items. They
 * also support middleware and input/output parsing via Zod schemas (or
 * an equivalent parser library of your choice).
 */
export type Action<TIn, TOut, TMeta> =
  | NullaryAction<TOut, TMeta>
  | UnaryAction<TIn, TOut, TMeta>

export type AnyAction = Action<any, any, any>

export type Actions = Record<string, AnyAction>

type Unhandled<T> = Omit<T, 'call' | 'internalHandler'>

type NullaryActionBuilder<TOut, TMeta> = {
  /** The raw action definition. Do not use directly. */
  def: Unhandled<NullaryAction<TOut, TMeta>>

  /** Add a description to the action. */
  describe: (description: string) => NullaryActionBuilder<TOut, TMeta>

  /** Add metadata to the action. */
  metadata: <TNewMeta>(
    metadata: TNewMeta,
  ) => NullaryActionBuilder<TOut, TNewMeta>

  /** Add a middleware to the action. */
  middleware: (fun: () => void) => NullaryActionBuilder<TOut, TMeta>

  /** Add an input parser to the action. */
  input: <TNewInput>(
    inputParser: Parser<TNewInput>,
  ) => UnaryActionBuilder<TNewInput, TOut, TMeta>

  /** Add an output parser to the action. */
  output: <TNewOutput>(
    outputParser: Parser<TNewOutput>,
  ) => NullaryActionBuilder<TNewOutput, TMeta>

  /**
   * Add a handler to the action.
   *
   * Note this must be nullary since there is no input parser registered
   * on this action builder. Use `input` to add an input parser.
   */
  handle: (fun: () => MaybePromise<TOut>) => NullaryAction<TOut, TMeta>
}

type UnaryActionBuilder<TIn, TOut, TMeta> = {
  /** The raw action definition. Do not use directly. */
  def: Unhandled<UnaryAction<TIn, TOut, TMeta>>

  /** Add a description to the action. */
  describe: (
    description: string,
  ) => UnaryActionBuilder<TIn, TOut, TMeta>

  /** Add metadata to the action. */
  metadata: <TNewMeta>(
    metadata: TNewMeta,
  ) => UnaryActionBuilder<TIn, TOut, TNewMeta>

  /** Add a middleware to the action. */
  middleware: (
    fun: (input: TIn) => MaybePromise<TIn>,
  ) => UnaryActionBuilder<TIn, TOut, TMeta>

  /** Add an output parser to the action. */
  output: <TNewOutput>(
    outputParser: Parser<TNewOutput>,
  ) => UnaryActionBuilder<TIn, TNewOutput, TMeta>

  /** Add a handler to the action. */
  handle: (
    fun: (input: TIn) => MaybePromise<TOut>,
  ) => UnaryAction<TIn, TOut, TMeta>
}

function createNullaryAction<TOut, TMeta>(
  def: NullaryActionBuilder<TOut, TMeta>['def'],
  handler: NullaryAction<TOut, TMeta>['internalHandler'],
): NullaryAction<TOut, TMeta> {
  return {
    ...def,
    internalHandler: handler,
    call: async () => {
      // Run the middleware functions.
      for (const middleware of def.middlewares ?? []) {
        await middleware()
      }
      // Run the handler function.
      const output = await handler()
      return def.outputParser ? def.outputParser.parse(output) : output
    },
  }
}

function createUnaryAction<TIn, TOut, TMeta>(
  def: UnaryActionBuilder<TIn, TOut, TMeta>['def'],
  handler: UnaryAction<TIn, TOut, TMeta>['internalHandler'],
): UnaryAction<TIn, TOut, TMeta> {
  return {
    ...def,
    internalHandler: handler,
    call: async (input) => {
      // Parse the input if there is an input parser.
      // This should throw an error if the input is invalid,
      // allowing the action to be called safely with unknown input.
      const parsedInput = def.inputParser.parse(input)
      // Run the middleware functions on the parsed input.
      let processedInput = parsedInput
      for (const middleware of def.middlewares ?? []) {
        processedInput = await middleware(processedInput)
      }
      // Run the handler function on the processed input.
      const output = await handler(processedInput)
      return def.outputParser ? def.outputParser.parse(output) : output
    },
  }
}

function createUnaryBuilder<TIn, TOut, TMeta>(
  def: UnaryActionBuilder<TIn, TOut, TMeta>['def'],
): UnaryActionBuilder<TIn, TOut, TMeta> {
  return {
    def,
    describe(description) {
      return createUnaryBuilder({
        ...def,
        description,
      })
    },
    metadata(metadata) {
      return createUnaryBuilder({
        ...def,
        metadata,
      })
    },
    middleware(fun) {
      return createUnaryBuilder({
        ...def,
        middlewares: [...(def.middlewares ?? []), fun],
      })
    },
    output(outputParser) {
      return createUnaryBuilder({
        ...def,
        outputParser: outputParser,
      })
    },
    handle(fun) {
      return createUnaryAction(def, fun)
    },
  }
}

function createNullaryBuilder<TOut, TMeta>(
  def: NullaryActionBuilder<TOut, TMeta>['def'],
): NullaryActionBuilder<TOut, TMeta> {
  return {
    def,
    describe(description) {
      return createNullaryBuilder({
        ...def,
        description,
      })
    },
    metadata(metadata) {
      return createNullaryBuilder({
        ...def,
        metadata,
      })
    },
    middleware(fun) {
      return createNullaryBuilder({
        ...def,
        middlewares: [...(def.middlewares ?? []), fun],
      })
    },
    input<TNewInput>(inputParser: Parser<TNewInput>) {
      return createUnaryBuilder<TNewInput, TOut, TMeta>({
        ...def,
        arity: 'unary',
        inputParser: inputParser,
        middlewares: [],
      })
    },
    output(outputParser) {
      return createNullaryBuilder({
        ...def,
        outputParser: outputParser,
      })
    },
    handle(fun) {
      return createNullaryAction(def, fun)
    },
  }
}

/**
 * Create a new action.
 *
 * This uses a TRPC-style builder pattern to allow for a more fluent
 * API, and to allow for the action to be built up in stages.
 *
 * You should always inlude `.input(...)` and `.handle(...)` when
 * creating an action, but the other methods are optional.
 *
 * Note that `.middleware(...)` functions are run in the order they are
 * added and after the input parser is run, but before the handler is
 * run. It is highly recommended to load middleware functions after the
 * input parser to ensure accurate typesafety in your middleware code.
 */
export function action(name?: string) {
  return createNullaryBuilder({
    arity: 'nullary',
    name,
  })
}

/** Check if the given value is a nullary action. */
export function isNullaryAction(
  x: unknown,
): x is NullaryAction<unknown, unknown> {
  return (
    typeof x === 'object' &&
    x !== null &&
    'arity' in x &&
    (x as AnyAction).arity === 'nullary'
  )
}

/**
 * Util to type-check a set of actions.
 *
 * ```ts
 * actions({
 *  createTodo: action()
 *    .input(z.string())
 *    .handle((input) => {/*...*\/}),
 * ```
 */
export function actions<T extends Actions>(def: T) {
  return def
}
