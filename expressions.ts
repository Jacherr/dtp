import { Parser } from "./parser";

export type RequirementFunction = ({
    opcode,
    operands,
    parser
}: {
    opcode: string,
    operands: string[],
    parser: Parser
}) => boolean

export type Requirement = ({
    fn: RequirementFunction,
    errorMessage: string
})

export type ExecuteFunction = ({
    opcode,
    operands,
    parser
}: {
    opcode: string,
    operands: string[],
    parser: Parser
}) => string

export interface Expression {
    requirements?: Requirement[]
    execute: ExecuteFunction
}

export const COMMON_REQUIREMENT_FUNCTIONS: { [key: string]: Requirement } = {
    operandsAreAllInts: {
        fn: ({ operands }) => {
            const requirementMet = !operands.some(operand => isNaN(parseInt(operand)));
            return requirementMet;
        },
        errorMessage: 'not all input operands are valid numbers'
    }
}

export const EXPRESSIONS = new Map<string, Expression>([
    [
        'add',
        {
            requirements: [
                COMMON_REQUIREMENT_FUNCTIONS.operandsAreAllInts
            ],
            execute: ({ operands }) => {
                let intOperands = operands.map(operand => parseFloat(operand));
                return String(intOperands.reduce((a, b) => a + b));
            }
        }
    ],
    [
        'e',
        {
            execute: () => String(Math.E)
        }
    ],
    [
        'get',
        {
            execute: ({ operands, parser }) => {
                const val = parser.valueStore.get(operands[0]);
                return val ?? '';
            }
        }
    ],
    [
        'note',
        {
            execute: () => ''
        }
    ],
    [
        'pi',
        {
            execute: () => String(Math.PI)
        }
    ],
    [
        'repeat',
        {
            requirements: [
                {
                    fn: ({ operands }) => {
                        return !isNaN(parseInt(operands[1]))
                    },
                    errorMessage: 'second operand is not a valid int'
                }
            ],
            execute: ({ operands }) => {
                const output = operands[0].repeat(parseInt(operands[1]));
                return output;
            }
        }
    ],
    [
        'set',
        {
            requirements: [
                {
                    fn: ({ operands }) => {
                        return !!operands[0] && !!operands[1]
                    },
                    errorMessage: 'variable key or value not specified'
                }
            ],
            execute: ({ operands, parser }) => {
                parser.valueStore.set(operands[0], operands[1]);
                return '';
            }
        }
    ]
])