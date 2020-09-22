import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Error_ } from "../Error/Error";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Expresion } from "../Abstract/Expresion";
import { AccesoIndice } from "../Expression/AccesoIndice";

export class Length extends Instruction{

    public line : number;
    public column : number;
    private id : string;
    public accesos : AccesoIndice | null;

    constructor(id : string , accesos : AccesoIndice | null , line : number, column : number){
        super(line, column);
        this.id = id;
        this.accesos = accesos;
        this.line = line;
        this.column = column;
    }

    public execute(environment : Entorno) : Retorno | void {
        if(this.accesos != null){
            let arreglo = this.accesos.execute(environment);
            if(arreglo == null || arreglo == undefined)
                throw new Error_(this.line, this.column, 'Semantico', ' Indice indefinido ' );
            if(arreglo.tipo != Tipo.ARRAY)
                throw new Error_(this.line, this.column, 'Semantico', ' LENGTH no ejecutable a valor ' + Tipo[arreglo.tipo] );
            return { value : arreglo.value.length , tipo : Tipo.NUMBER} ;
        }else{
            let arreglo : any;
            arreglo = environment.getVariable(this.id);
            if(arreglo == null || arreglo == undefined)
                throw new Error_(this.line, this.column, 'Semantico', ' Indice indefinido ' );
            if(arreglo!.tipo != Tipo.ARRAY)
                throw new Error_(this.line, this.column, 'Semantico', ' LENGTH no ejecutable a valor ' + Tipo[arreglo.tipo] );
            return { value : arreglo.valor.length , tipo : Tipo.NUMBER} ;
        }
    }
}