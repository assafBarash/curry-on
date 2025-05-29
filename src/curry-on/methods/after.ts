import { BaseFunc, BaseParams } from '@/types'
import { CurryOnInstance, CurryOn } from '../instance'

export type IAfter<OgParams extends BaseParams, OgResult> = (
    cb: (result: Awaited<OgResult>, input: OgParams) => unknown
) => CurryOnInstance<OgParams, OgResult>

export const createAfter =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ): IAfter<OgParams, OgResult> =>
    (afterCb) =>
        CurryOn((...params) => {
            const result = rootFunc(...params)

            result instanceof Promise
                ? result.then((res) => afterCb(res, params))
                : afterCb(result as Awaited<OgResult>, params)

            return result
        })
