import { BaseParams } from '@/types'
import { createMapInput, createMapOutput } from './methods'

type BaseFunc<Params extends BaseParams, Result> = (...params: Params) => Result

type Promisify<O, R> = O extends Promise<any> ? Promise<R> : R

export type CurryOnInstance<OgParams extends BaseParams, OgResult> = {
    (...params: OgParams): OgResult
    mapOutput: <NewResult>(
        cb: (result: Awaited<OgResult>, input: OgParams) => NewResult
    ) => CurryOnInstance<OgParams, Promisify<OgResult, NewResult>>
    mapOutputAsync: CurryOnInstance<OgParams, OgResult>['mapOutput']
    mapInput: <NewParams extends BaseParams>(
        cb: (...params: NewParams) => OgParams
    ) => CurryOnInstance<NewParams, OgResult>
    clearCurryOn: () => BaseFunc<OgParams, OgResult>
}

export const CurryOn = <OgParams extends BaseParams, OgResult>(
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
