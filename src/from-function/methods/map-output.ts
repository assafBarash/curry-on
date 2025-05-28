import { BaseFunc, BaseParams, Promisify } from '@/types'
import { CurryOnFunction, fromFunction } from '../instance'

export type IMapOutput<OgParams extends BaseParams, OgResult> = <NewResult>(
    cb: (result: Awaited<OgResult>, input: OgParams) => NewResult
) => CurryOnFunction<OgParams, Promisify<OgResult, NewResult>>

export const createMapOutput =
    <OgParams extends BaseParams, OgResult>(
        rootFunc: BaseFunc<OgParams, OgResult>
    ): IMapOutput<OgParams, OgResult> =>
    <NewResult>(
        mapOutputCb: BaseFunc<[Awaited<OgResult>, OgParams], NewResult>
    ) =>
        fromFunction<OgParams, Promisify<OgResult, NewResult>>((...params) => {
            const result = rootFunc(...params)
            return (
                result instanceof Promise
                    ? result.then((res) =>
                          mapOutputCb(res as Awaited<OgResult>, params)
                      )
                    : mapOutputCb(result as Awaited<OgResult>, params)
            ) as Promisify<OgResult, NewResult>
        })
