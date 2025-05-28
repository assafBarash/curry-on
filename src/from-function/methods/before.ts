import { BaseFunc, BaseParams } from '@/types'
import { fromFunction, CurryOnFunction } from '../instance'

export type IBefore<OgParams extends BaseParams, OgResult> = (
    cb: (...params: OgParams) => unknown
) => CurryOnFunction<OgParams, OgResult>

export const createBefore =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ): IBefore<OgParams, OgResult> =>
    (beforeCb) =>
        fromFunction((...params) => {
            beforeCb(...params)
            return rootFunc(...params)
        })
