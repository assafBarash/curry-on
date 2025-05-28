import { BaseFunc } from '@/types'
import { fromFunction, CurryOnFunction } from '../from-function'

export function CurryOn<P extends BaseFunc<any, any>>(
    params: P
): CurryOnFunction<Parameters<P>, ReturnType<P>>
export function CurryOn<P>(params: P): never

export function CurryOn<P>(params: P) {
    if (typeof params === 'function') {
        return fromFunction(params as any)
    }

    throw new Error('CurryOn expects a function as its argument')
}

CurryOn.fromFunction = fromFunction
