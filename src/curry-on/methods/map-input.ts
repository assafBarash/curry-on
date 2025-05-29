import { BaseFunc, BaseParams } from '@/types'
import { CurryOn, CurryOnInstance } from '../instance'

export type IMapInput<OgParams extends BaseParams[], OgResult> = <
    NewParams extends BaseParams
>(
    cb: (...params: NewParams) => OgParams
) => CurryOnInstance<NewParams, OgResult>

export const createMapInput =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ): IMapInput<OgParams, OgResult> =>
    (mapInputCb) =>
        CurryOn((...params) => {
            const newParams = mapInputCb(...params)
            return rootFunc(
                ...((Array.isArray(newParams)
                    ? newParams
                    : [newParams]) as OgParams)
            )
        })
