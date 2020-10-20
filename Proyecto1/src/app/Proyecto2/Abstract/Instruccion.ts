import { Entorno } from "../TablaSimbolos/Entorno";
import { Tipos, Tipo } from "../Util/Tipo";

export abstract class Instruccion{
    line : number;
    column : number;

    constructor(line: number, column: number){
        this.line = line;
        this.column = column;
    }

    public abstract compile(env: Entorno) : any;

    public sameType(type1: Tipo, type2: Tipo) : boolean{
        //TODO casteos implicitos
        if(type1.type == type2.type){
/*            if(type1.type == Tipo.STRUCT){
                return type1.typeId.toLocaleLowerCase() === type2.typeId.toLocaleLowerCase();
            }*/
            return true;
        }/*
        else if(type1.type == Types.STRUCT || type2.type == Types.STRUCT){
            if(type1.type == Types.NULL || type2.type == Types.NULL){
                return true;
            }
        }*/
        return false;
    }
}