import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { env } from "process";
import { Error_ } from "../Error/Error";
import { Tipo } from "../Abstract/Retorno";

export class Asignacion extends Instruction{

    public id : string;
    public value : Expresion;

    constructor(id: string, value : Expresion, linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.value = value;
    }

    public execute(entorno : Entorno) {
        //validar si es variable
        
        const val = this.value.execute(entorno);
        const variable = entorno.getVariable(this.id);
        if(variable != null && variable != undefined){
            if(variable.variable == true){
                if(variable.tipo != Tipo.NULL){
                    if(variable.tipo == val.tipo){
                        entorno.actualizarVariable(this.id, val.value, val.tipo, true);
                    }else{
                        throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + Tipo[val.tipo] + ' no asignable a ' +  Tipo[variable.tipo]);
                    }
                }else{
                    //Variable existe pero no ha sido asignada
                    entorno.actualizarVariable(this.id, val.value, val.tipo, true );
                }
            }else{
                throw new Error_(this.linea, this.columna, 'Semantico',   'const ' + this.id +' no puede ser re definido');
            }
        }else{
            throw new Error_(this.linea, this.columna, 'Semantico', this.id +  'no esta definida');
        }            
    }

}