import { EXPRESSION, CONFIGURATION } from './index';

// F (Front): the side currently facing the solver
// B (Back): the side opposite the front
// U (Up): the side above or on top of the front side
// D (Down): the side opposite the top, underneath the Cube
// L (Left): the side directly to the left of the front
// R (Right): the side directly to the right of the front

const inside = /[A-Za-z0-9]/;
const outside = /[^A-Za-z0-9]/;

const front = /[A-Za-z0-9_-]/;
const back = /[-_A-Za-z0-9]/;
const up = /[A-Z]/;
const down = /[a-z]/;
const left = /[0-9_-]\.[^0-9_-]/;
const right = /[^0-9_-]\.[-_0-9]/;

const center = /[0-9]\.[0-9]/;
const constraint = /[^"]+/; //to match all the content between certain delimiters (in this case double quotes), or with atomic groups.
const boundry = /"([^"]+)"/;
`
[abc] is functionally equivalent to (?:a|b|c).
`
const FRONT = /^[A-Za-z0-9:+]$/;
const BACK = /^[A-Za-z0-9.-]$/;

const INSIDE = /^[A-Za-z0-9_]$/;
const OUTSIDE = /^[^A-Za-z0-9_]$/;

const UP = /^[A-Z_]$/;
const DOWN = /^[a-z_]$/;

const LEFT = /^[0-9+-]\.[^0-9+-]$/;
const RIGHT = /^[^0-9+-]\.[0-9+-]$/;
const CENTER = /^[0-9]\.[0-9]$/;

function matches(rule: RegExp, value: string) {
    return rule.test(value);
}

const isFront = (value: string) => FRONT.test(value);
const isBack = (value: string) => BACK.test(value);
const isInside = (value: string) => INSIDE.test(value);
const isOutside = (value: string) => OUTSIDE.test(value);

const isUp = (value: string) => UP.test(value);
const isDown = (value: string) => DOWN.test(value);

const isLeft = (value: string) => LEFT.test(value);
const isRight = (value: string) => RIGHT.test(value);
const isCenter = (value: string) => CENTER.test(value);

const willDeflect = (value: string) => DEFLECT.test(value);
const willReflect = (value: string) => REFLECT.test(value);
const willInflect = (value: string) => INFLECT.test(value);

const DEFLECT = /^([^".]+):\1$/;

function deflect(value: string) {
    const match = DEFLECT.exec(value);

    if (!match) return null;

    return {
        value: match[1]
    };
}
const REFLECT = /^([".]+):\1$/;
function reflect(value: string) {
    const match = REFLECT.exec(value);

    if (!match) return null;

    return {
        value: match[1]
    };
}
const INFLECT = /^([".]+):([".]+):\2:\1$/;

function inflect(value: string) {
    const match = INFLECT.exec(value);

    if (!match) return null;

    return {
        first: match[1],
        second: match[2]
    };
}
const CONSTRAINT = /^[^"]+$/;
const BOUNDARY = /^"([^"]+)"$/;

const isConstraint = (value: string) => CONSTRAINT.test(value);
const isBoundary = (value: string) => BOUNDARY.test(value);
function boundary(value: string) {
    const match = BOUNDARY.exec(value);
    if (!match) return null;

    return {
        value: match[1]
    };
}
const AXIS = /^(\d\d)[A-Za-z_](\d\d):\2[0-9+-]\1$/;
const MNEMONIC = /^(\d\d)([A-Z_]?[a-z_]+)(\d\d):\3\2\1$/;

export const Declarations: RegExp[] = [
    /0[b,o,x,d,n,p]+\d/,
    /0p[\d][boxd][\d]0n/, // Reads as: "position, a digit, a radix marker, a digit, number."
    /0[pn][boxd]0[np]/, // Reads as: "zero, either p or n, a radix marker, zero, either n or p."
    /0p[\d][^\d]0[b,o,x,d][^\d][\d]0n/, // Reads as: "position, digit, non-digit delimiter, zero, radix, non-digit delimiter, digit, number."
    /[0][pn]\d[boxd]\d[0][np]/, // This is the **canonical implementation** of `Atomics.compareExchange` as message syntax
    /*
    ```
    [0]      →  the literal anchor
    [pn]     →  the scalar type (position or number)
    \d       →  the magnitude digit
    [boxd]   →  the radix
    \d       →  the precision digit
    [0]      →  the literal anchor
    [np]     →  the scalar type (number or position)
    ```
    
    The **left side** is the **self-described encoding precision**. The **right side** is the **precision − 1**.
    */
    /[A-Za-z0-9][pn]\d[boxd]\d[np][A-Za-z0-9]/, // Reads: "alphanumeric, scalar type, digit, radix, digit, scalar type, alphanumeric." // The alphanumeric **endcaps** (`[A-Za-z0-9]`) make it a **full spatial, spectral, network message**.
    /[0][pn]\d[boxd]\d[0][np]/, // Reads: "zero, scalar type, radix, zero, scalar type." // This is a **self-described TLV (Type-Length-Value) string**
    /*
    This is a **self-described TLV (Type-Length-Value) string** with:
    
    - **Cardinality** built in — the `\d` after `[pn]`
    - **Chirality** built in — the `[np]` at the end
    - **Spatial** — the position (0p)
    - **Spectral** — the radix (0b, 0o, 0x, 0d)
    - **Network** — the alphanumeric endcaps
    
    ### The Reading
    
    | Part | Type | Value |
    |------|------|-------|
    | `[0]` | Literal anchor | 0 |
    | `[pn]` | Scalar type | p or n |
    | `\d` | Magnitude | 0-9 |
    | `[boxd]` | Radix | b, o, x, or d |
    | `\d` | Precision | 0-9 |
    | `[0]` | Literal anchor | 0 |
    | `[np]` | Scalar type | n or p |
    
    Seven components. **7 = the Fano plane.**
    
    */
    /[np].[d].[np]/, // Reads: "scalar type, dot, digit, dot, scalar type."
];
export const Expressions: EXPRESSION[] = []
export const Configurations: CONFIGURATION[] = [
    [
        Declarations,
        [[8, `{\${p}p, \${n}n}  \U+00d7  {0b\${b}, 0o\${o}, 0x\${x}, 0d\${d}}`]],
        Expressions,
        [(p, i, n, E, b, o, x, e, d) => '']
    ]
]

type SYMBOL = Partial<{
    FRONT: RegExp;
    BACK: RegExp;
    INSIDE: RegExp;
    OUTSIDE: RegExp;
    UP: RegExp;
    DOWN: RegExp;
    LEFT: RegExp;
    RIGHT: RegExp;
    CENTER: RegExp;
    CONSTRAINT: RegExp;
    BOUNDARY: RegExp;
    DEFLECT: RegExp;
    REFLECT: RegExp;
    INFLECT: RegExp;
    AXIS: RegExp;
    MNEMONIC: RegExp;
}>
const G: SYMBOL = Object.freeze({
    FRONT: /^[A-Za-z0-9:+]$/,
    BACK: /^[A-Za-z0-9.-]$/,

    INSIDE: /^[A-Za-z0-9_]$/,
    OUTSIDE: /^[^A-Za-z0-9_]$/,

    UP: /^[A-Z_]$/,
    DOWN: /^[a-z_]$/,

    LEFT: /^[0-9+-]\.[^0-9+-]$/,
    RIGHT: /^[^0-9+-]\.[0-9+-]$/,
    CENTER: /^[0-9]\.[0-9]$/,

    CONSTRAINT: /^[^"]+$/,
    BOUNDARY: /^"([^"]+)"$/,

    DEFLECT: /^([^".]+):\1$/,
    REFLECT: /^([".]+):\1$/,
    INFLECT: /^([".]+):([".]+):\2:\1$/,

    AXIS: /^(\d\d)[A-Za-z_](\d\d):\2[0-9+-]\1$/,
    MNEMONIC: /^(\d\d)([A-Z_]?[a-z_]+)(\d\d):\3\2\1$/
});
function test(symbol: any, value: string) {
    const rule = G[symbol];

    if (!(rule instanceof RegExp)) {
        throw new Error(`Unknown symbol: ${symbol} `);
    }

    return rule.test(value);
}
function match(symbol: any, value: string) {
    const rule = G[symbol];
    if (!(rule instanceof RegExp)) return null;

    const m = rule.exec(value);
    return m ? [...m] : null;
}

function rotl(buf: Buffer, n: number) {
    return Buffer.from(buf.map((_, i) => buf[(i + n) % buf.length]!));
};
function rotr(buf: Buffer, n: number) {
    return Buffer.from(buf.map((_, i) => buf[(i - n + buf.length) % buf.length]!));
};

function xor(a: Buffer, b: Buffer) {
    return Buffer.from(a.map((v, i) => v ^ b[i]!));
};

export function delta(buf: Buffer, C: Buffer) {
    return xor(xor(xor(rotl(buf, 1), rotl(buf, 3)), rotr(buf, 2)), C);
};

export function arcRight(t: number, b: number, r: number, l: number, f: number, br: number) {
    return (t ** 2) + (b ** 2) === r ** 2 &&
        (t ** 2) + (f ** 2) === r ** 2 &&
        (t ** 2) + (br ** 2) === r ** 2 &&
        (b ** 2) + (f ** 2) === r ** 2 &&
        (b ** 2) + (br ** 2) === r ** 2 &&
        (f ** 2) + (br ** 2) === r ** 2;
}

export function arcLeft(t: number, b: number, r: number, l: number, f: number, br: number) {
    return (t ** 2) + (b ** 2) === l ** 2 &&
        (t ** 2) + (f ** 2) === l ** 2 &&
        (t ** 2) + (br ** 2) === l ** 2 &&
        (b ** 2) + (f ** 2) === l ** 2 &&
        (b ** 2) + (br ** 2) === l ** 2 &&
        (f ** 2) + (br ** 2) === l ** 2;
}

function delta16(ruler: Buffer) {
    const state = Buffer.from(ruler.subarray(0, 8));
    const C = Buffer.from(ruler.subarray(8, 16));
    const next = delta(state, C);
    ruler.set(next, 0);
    ruler.set(state, 8);
    return ruler;
}
function fibonacci(num: number): number {
    if (num <= 1) {
        return 1;
    }
    return fibonacci(num - 1) + fibonacci(num - 2);
}
export const XOR = fibonacci((1 ^ 3 ^ 5 ^ 7 ^ 9) ^ (0 ^ 2 ^ 4 ^ 6 ^ 8) &
    (0xA ^ 0xB ^ 0xC ^ 0xD ^ 0xE ^ 0xF) ^ (0xA ^ 0xB ^ 0xC ^ 0xD ^ 0xE ^ 0xF) ^ (0xA ^ 0xB ^ 0xC ^ 0xD ^ 0xE ^ 0xF) &
    (0 ^ -1 ^ -2 ^ -3 ^ -4 ^ -5 ^ -6 ^ -7 ^ -8 ^ -9) ^ (0 ^ 1 ^ 2 ^ 3 ^ 4 ^ 5 ^ 6 ^ 7 ^ 8 ^ 9) ^ (0 ^ 1 ^ 2 ^ 3 ^ 4 ^ 5 ^ 6 ^ 7 ^ 8 ^ 9) ^ (0 ^ -1 ^ -2 ^ -3 ^ -4 ^ -5 ^ -6 ^ -7 ^ -8 ^ -9));
