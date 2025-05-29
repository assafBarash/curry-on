import { BaseFunc, BaseParams } from '../types'
import { createMapInput, createMapOutput } from './methods'
import { IMapInput, IMapOutput } from './methods'
import { createAfter, IAfter } from './methods/after'
import { createBefore, IBefore } from './methods/before'

export type CurryOnInstance<OgParams extends BaseParams, OgResult> = {
    (...params: OgParams): OgResult
    mapOutput: IMapOutput<OgParams, OgResult>
    mapOutputAsync: IMapOutput<OgParams, OgResult>
    mapInput: IMapInput<OgParams, OgResult>
    after: IAfter<OgParams, OgResult>
    before: IBefore<OgParams, OgResult>
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
    instance.after = createAfter(rootFunc)
    instance.before = createBefore(rootFunc)

    // backwards compatibility
    instance.mapOutputAsync = instance.mapOutput

    instance.clearCurryOn = () => rootFunc

    return instance
}
