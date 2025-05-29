import { BaseFunc, BaseParams } from '@/types'
import { CurryOn, CurryOnInstance } from '../instance'

export type IBefore<OgParams extends BaseParams, OgResult> = (
    cb: (...params: OgParams) => unknown
) => CurryOnInstance<OgParams, OgResult>

export const createBefore =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ): IBefore<OgParams, OgResult> =>
    (beforeCb) =>
        CurryOn((...params) => {
            beforeCb(...params)
            return rootFunc(...params)
        })
