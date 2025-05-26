import { BaseFunc, BaseParams } from '@/types'
import { CurryOn } from '../instance'

export const createMapInput =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ) =>
    <NewParams extends any[]>(mapInputCb: BaseFunc<NewParams, OgParams>) =>
        CurryOn<NewParams, OgResult>((...params) => {
            const newParams = mapInputCb(...params)
            return rootFunc(
                ...((Array.isArray(newParams)
                    ? newParams
                    : [newParams]) as OgParams)
            )
        })
