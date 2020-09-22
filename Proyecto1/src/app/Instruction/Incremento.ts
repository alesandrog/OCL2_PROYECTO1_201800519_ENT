import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { env } from "process";
import { Error_ } from "../Error/Error";
import { Tipo } from "../Abstract/Retorno";

export class Incremento extends Instruction{

    private id : string;
    private operador : string;

    constructor(id: string , operador : string, linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.operador = operador;
    }

    public execute(entorno : Entorno) {
        //validar si es variable       
        const variable = entorno.getVariable(this.id);        
        if(variable != null && variable != undefined){
            if(variable.variable == true){
                if(variable.tipo != Tipo.NULL){

                    if(variable.tipo != Tipo.NUMBER)
                        throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles, operador no aplicable a : ' +  Tipo[variable.tipo]);        

                    let res = 0;
                    if(this.operador == '++'){
                        res = variable.valor + 1;
                    }else{
                        res = variable.valor - 1;
                    }
                    entorno.actualizarVariable(this.id, res, Tipo.NUMBER, true);

                }else{
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Variable ' + this.id +  ' no esta inicializada');
                }
            }else{
                throw new Error_(this.linea, this.columna, 'Semantico',   'const ' + this.id +' no puede ser re definido');
            }
        }else{
            throw new Error_(this.linea, this.columna, 'Semantico', this.id +  'no esta definida');
        }            
    }

}