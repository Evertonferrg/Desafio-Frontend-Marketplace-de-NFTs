import Decimal from 'decimal.js'

export type Eth = string

Decimal.set({ precision: 40, rounding: Decimal.ROUND_HALF_UP})

const dec = (v: Eth) => new Decimal(v)

export const ZERO: Eth = '0'

export const addEth = (a: Eth, b: Eth): Eth => dec(a).plus(dec(b)).toFixed(18)
export const subEth = (a: Eth, b: Eth): Eth => dec(a).minus(dec(b)).toFixed(18)

export const mulEth = (a: Eth, qty: number): Eth => {
    if (!Number.isInteger(qty) || qty < 0) {
        throw new Error('Quantidade deve ser inteira e nao negativa')
    }
    return dec(a).times(qty).toFixed(18)
}

export const cmpEth = (a: Eth, b: Eth): -1 | 0 | 1 =>
    dec(a).comparedTo(dec(b)) as -1 | 0 | 1

export const formatEth = (a: Eth, maxDecimals = 4): string =>
    `${dec(a).toDecimalPlaces(maxDecimals).toFixed()} ETH`

