export type BaseParams = any[]

export type Promisify<O, R> = O extends Promise<any> ? Promise<R> : R

export type BaseFunc<Params extends BaseParams, Result> = (
    ...params: Params
) => Result
