//import { SymbolStruct } from "../SymbolTable/SymbolStruct";

export enum Tipos{
    NUMBER = "number",
    STRING = "string",
    BOOLEAN = "boolean",
    TYPE = "type",
    ARRAY = "array",
    NULL = "null",
    VOID = "void"
}

export class Tipo{
    type : Tipos;
    typeId : string;
  //  struct : SymbolStruct | null;
    struct :  null;

    constructor(type: Tipos, typeId: string = '', struct :  null = null){
        this.type = type;
        this.typeId = typeId;
        this.struct = struct;
    }
}