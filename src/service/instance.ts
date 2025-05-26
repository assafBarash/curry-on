import { createMapInput, createMapOutput } from './methods'

type BaseFunc<Params extends any[], Result> = (...params: Params) => Result

type Promisify<O, R> = O extends Promise<any> ? Promise<R> : R

export type CurryOnInstance<OgParams extends any[], OgResult> = {
    (...params: OgParams): OgResult
    mapOutput: <NewResult>(
        cb: (result: Awaited<OgResult>, input: OgParams) => NewResult
    ) => CurryOnInstance<OgParams, Promisify<OgResult, NewResult>>
    mapOutputAsync: CurryOnInstance<OgParams, OgResult>['mapOutput']
    mapInput: <NewParams extends any[]>(
        cb: (...params: NewParams) => OgParams
    ) => CurryOnInstance<NewParams, OgResult>
    clearCurryOn: () => BaseFunc<OgParams, OgResult>
}

export const CurryOn = <OgParams extends any[], OgResult>(
    rootFunc: BaseFunc<OgParams, OgResult>
) => {
    const instance: CurryOnInstance<OgParams, OgResult> = (
        ...params: OgParams
    ) => rootFunc(...params)

    instance.mapOutput = createMapOutput(rootFunc)
    instance.mapInput = createMapInput(rootFunc)

    // backwards compatibility
    instance.mapOutputAsync = instance.mapOutput

    instance.clearCurryOn = () => rootFunc

    return instance
}
