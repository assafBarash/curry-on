import { BaseFunc, BaseParams } from '@/types'
import { fromFunction, CurryOnFunction } from '../instance'

export type IMapInput<OgParams extends BaseParams[], OgResult> = <
    NewParams extends BaseParams
>(
    cb: (...params: NewParams) => OgParams
) => CurryOnFunction<NewParams, OgResult>

export const createMapInput =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ): IMapInput<OgParams, OgResult> =>
    (mapInputCb) =>
        fromFunction((...params) => {
            const newParams = mapInputCb(...params)
            return rootFunc(
                ...((Array.isArray(newParams)
                    ? newParams
                    : [newParams]) as OgParams)
            )
        })
