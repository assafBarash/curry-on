type BaseFunc<Params extends any[], Result> = (...params: Params) => Result

type Promisify<O, R> = O extends Promise<any> ? Promise<R> : R

export type CurryOnInstance<OgParams extends any[], OgResult> = {
    (...params: OgParams): OgResult
    mapOutput: <NewResult>(
        cb: (result: Awaited<OgResult>, input: OgParams) => NewResult
    ) => CurryOnInstance<OgParams, Promisify<OgResult, NewResult>>
    mapOutputAsync: CurryOnInstance<OgParams, OgResult>['mapOutput']
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
        mapOutputCb: BaseFunc<[Awaited<OgResult>, OgParams], NewResult>
    ) =>
        CurryOn<OgParams, Promisify<OgResult, NewResult>>((...params) => {
            const result = rootFunc(...params)
            return (
                (result as Promise<OgResult>)?.then
                    ? (result as Promise<OgResult>).then((res) =>
                          mapOutputCb(res as Awaited<OgResult>, params)
                      )
                    : mapOutputCb(result as Awaited<OgResult>, params)
            ) as Promisify<OgResult, NewResult>
        })

    instance.mapInput = <NewParams extends any[]>(
        mapInputCb: BaseFunc<NewParams, OgParams>
    ) =>
        CurryOn<NewParams, OgResult>((...params) => {
            const newParams = mapInputCb(...params)
            return rootFunc(
                ...((Array.isArray(newParams)
                    ? newParams
                    : [newParams]) as OgParams)
            )
        })

    // backwards compatibility
    instance.mapOutputAsync = instance.mapOutput

    instance.clearCurryOn = () => rootFunc

    return instance
}
