export type BaseFunc<Params extends any[], Result> = (
    ...params: Params
) => Result

export const CurryOn = <OgParams extends any[], OgResult>(
    rootFunc: BaseFunc<OgParams, OgResult>
) => {
    const instance = (...params: OgParams) => rootFunc(...params)

    instance.mapOutput = <NewResult>(
        processOutputCb: BaseFunc<[OgResult], NewResult>
    ) =>
        CurryOn<OgParams, NewResult>((...params) => {
            const result = rootFunc(...params)
            return processOutputCb(result)
        })

    instance.mapInput = <NewParams extends any[]>(
        processInputCb: BaseFunc<NewParams, OgParams>
    ) =>
        CurryOn<NewParams, OgResult>((...params) => {
            const newParams = processInputCb(...params)
            return rootFunc(...newParams)
        })

    instance.clearCurryOn = () => rootFunc

    return instance
}
