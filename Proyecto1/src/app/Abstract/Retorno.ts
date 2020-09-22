export enum Tipo{
    NUMBER = 0,
    STRING = 1,
    BOOLEAN = 2,
    VOID = 3,
    TYPE = 4,
    ARRAY = 5,
    NULL = 6,
    ERR = 7
}

export type Retorno ={
    value : any,
    tipo : Tipo | number
}