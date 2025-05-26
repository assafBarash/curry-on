import { BaseFunc, BaseParams, Promisify } from '@/types'
import { CurryOn } from '../instance'

export const createMapOutput =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ) =>
    <NewResult>(
        mapOutputCb: BaseFunc<[Awaited<OgResult>, OgParams], NewResult>
    ) =>
        CurryOn<OgParams, Promisify<OgResult, NewResult>>((...params) => {
            const result = rootFunc(...params)
            return (
                result instanceof Promise
                    ? result.then((res) =>
                          mapOutputCb(res as Awaited<OgResult>, params)
                      )
                    : mapOutputCb(result as Awaited<OgResult>, params)
            ) as Promisify<OgResult, NewResult>
        })
