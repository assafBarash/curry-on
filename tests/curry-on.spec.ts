import { describe, it, expect } from '@jest/globals'
import { CurryOn } from '../src'

describe('CurryOn', () => {
    const add = (a: number) => (b: number) => a + b

    it('should correctly apply a curried function', () => {
        const add5 = CurryOn(add(5))
        expect(add5(10)).toBe(15)
    })

    it('should transform output with mapOutput', () => {
        const add5multiple2 = CurryOn(add(5)).mapOutput((result) => result * 2)
        expect(add5multiple2(10)).toBe(30)
    })

    it('should support chaining mapOutput transformations', () => {
        const add5multiple2add1 = CurryOn(add(5))
            .mapOutput((result) => result * 2)
            .mapOutput((result) => result + 1)
        expect(add5multiple2add1(10)).toBe(31)
    })

    it('should transform input with mapInput', () => {
        const sumAndAdd5 = CurryOn(add(5)).mapInput((a: number, b: number) => [
            a + b,
        ])
        expect(sumAndAdd5(5, 10)).toBe(20)
    })

    it('should support chaining mapInput transformations', () => {
        const sumAndAdd5 = CurryOn(add(5))
            .mapInput((a: number, b: number) => [a - b])
            .mapInput((x: number) => [x * x, x * 2])
        expect(sumAndAdd5(5)).toBe(20)
    })

    it('should handle functions with no parameters', () => {
        const identity = (x: any) => x
        const identityFn = CurryOn(identity)
        expect(identityFn(5)).toBe(5)
    })

    it('should correctly handle large strings with mapOutput', () => {
        const concatenate = (a: string) => (b: string) => a + b
        const concatHello = CurryOn(concatenate('Hello ')).mapOutput((result) =>
            result.toUpperCase()
        )
        expect(concatHello('world')).toBe('HELLO WORLD')
    })

    it('should chain mapInput and mapOutput', () => {
        const add = (a: number) => (b: number) => a + b
        const add5add1multiple2 = CurryOn(add(5))
            .mapInput((a: number) => [a + 1])
            .mapOutput((result) => result * 2)
        expect(add5add1multiple2(10)).toBe(32)
    })

    it('should clear mapInput and mapOutput functions', () => {
        const add = (a: number) => (b: number) => a + b
        const add5 = CurryOn(add(5)).clearCurryOn()

        const keys = Object.keys(add5)
        expect(keys).not.toContain('mapInput')
        expect(keys).not.toContain('mapOutput')
    })
})
