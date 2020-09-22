import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { env } from "process";
import { Error_ } from "../Error/Error";
import { Tipo } from "../Abstract/Retorno";
import { ExpresionAritmetica, OperacionesAritmeticas } from "../Expression/ExpresionAritmetica";
import { Literal } from "../Expression/Literal";

export class Concatenacion extends Instruction{

    private id : string;
    private value : Expresion;

    constructor(id: string, value : Expresion, linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.value = value;
    }

    public execute(entorno : Entorno) {
        const variable = entorno.getVariable(this.id);
        if(variable != null && variable != undefined){
            if(variable.variable == true){
                if(variable.tipo != Tipo.NULL){
                    //Ejecutar concatenacion
                    if(variable.valor == null || variable.valor == undefined)
                        throw new Error_(this.linea, this.columna, 'Semantico', 'Variable usada antes de su inicializacion ');
                    let izq = new Literal(variable.valor, 0, 0, Tipo.STRING);
                    let exp = new ExpresionAritmetica(izq , this.value , OperacionesAritmeticas.SUMA, this.linea,this.columna);
                    const res = exp.execute(entorno);
                    if(variable.tipo == res.tipo && variable.tipo == Tipo.STRING){                            
                        entorno.actualizarVariable(this.id, res.value, res.tipo, true);
                    }else{
                        throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + Tipo[res.tipo] + ' no asignable a ' +  Tipo[variable.tipo]);
                    }
                }else{
/*                    let izq = new Literal("", 0, 0, Tipo.STRING);
                    let exp = new ExpresionAritmetica(izq , this.value , OperacionesAritmeticas.SUMA, this.linea,this.columna);
                    const val = exp.execute(entorno);
                    if(val.tipo == Tipo.STRING){
                        entorno.guardarVariable(this.id, val.value, val.tipo, true );
                    }else{
                        throw new Error_(this.linea, this.columna, 'Semantico', 'Operador += no aplicable a ' + Tipo[val.tipo]);
                    }            */
                    if(variable.valor == null || variable.valor == undefined)
                        throw new Error_(this.linea, this.columna, 'Semantico', 'Variable usada antes de su inicializacion ');
                }
            }else{
                throw new Error_(this.linea, this.columna, 'Semantico',   'const ' + this.id +' no puede ser re definido');
            }
        }else{
            throw new Error_(this.linea, this.columna, 'Semantico', this.id +  'no esta definida');
        }            
    }
}