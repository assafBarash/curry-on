type BaseFunc<Params extends any[], Result> = (...params: Params) => Result
type MaybePromise<T> = T | Promise<T>

export type CurryOnInstance<OgParams extends any[], OgResult> = {
    (...params: OgParams): OgResult
    mapOutput: <NewResult>(
        cb: (result: OgResult) => NewResult
    ) => CurryOnInstance<OgParams, NewResult>
    mapOutputAsync: <NewResult>(
        cb: (result: Awaited<OgResult>) => Promise<NewResult>
    ) => CurryOnInstance<OgParams, Promise<NewResult>>
    mapInput: <NewParams extends any[]>(
        cb: (...params: NewParams) => OgParams
    ) => CurryOnInstance<NewParams, OgResult>
    clearCurryOn: () => BaseFunc<OgParams, OgResult>
}

export const CurryOn = <OgParams extends any[], OgResult>(
    rootFunc: BaseFunc<OgParams, OgResult>
) => {
    const instance: CurryOnInstance<OgParams, OgResult> = (
        ...params: OgParams
    ) => rootFunc(...params)

    instance.mapOutput = <NewResult>(
        mapOutputCb: BaseFunc<[OgResult], NewResult>
    ) =>
        CurryOn<OgParams, NewResult>((...params) => {
            const result = rootFunc(...params)
            return mapOutputCb(result)
        })

    instance.mapInput = <NewParams extends any[]>(
        mapInputCb: BaseFunc<NewParams, OgParams>
    ) =>
        CurryOn<NewParams, OgResult>((...params) => {
            const newParams = mapInputCb(...params)
            return rootFunc(...newParams)
        })

    instance.mapOutputAsync = <NewResult>(
        mapOutputCb: BaseFunc<[Awaited<OgResult>], Promise<NewResult>>
    ) =>
        CurryOn<OgParams, Promise<NewResult>>(async (...params) => {
            const result = await rootFunc(...params)
            return mapOutputCb(result)
        })

    instance.clearCurryOn = () => rootFunc

    return instance
}
