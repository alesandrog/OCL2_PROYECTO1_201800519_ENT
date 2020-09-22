import { Instruction } from "../Abstract/Instruccion";
import { Entorno } from "../Symbol/Entorno";
import { Expresion } from "../Abstract/Expresion";
import { env } from "process";
import { Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { AccesoTipoType } from "../Expression/AccesoTipoType";

export class Declaration extends Instruction{

    public id : string;
    public value : Expresion | null;
    public variable : boolean;
    public tipo : Tipo | AccesoTipoType;

    constructor(id: string, value : Expresion | null,  variable : boolean ,tipo : Tipo | AccesoTipoType , linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.value = value;
        this.variable = variable;
        this.tipo = tipo;
    }

    public execute(entorno : Entorno) {
        if(this.value != null){
            const val = this.value.execute(entorno);
            //Tiene expresion y tipo declarado
            let tip : number = -1;
            if(this.tipo != Tipo.NULL){
                if(this.tipo instanceof AccesoTipoType){
                    const t = this.tipo.execute(entorno);
                    this.tipo = t.tipo;
                    tip = t.tipo;
                }else{
                    tip = this.tipo;
                }
                if(this.tipo == val.tipo){
                    entorno.guardarVariable(this.id, val.value, val.tipo, this.variable);
                }else{
                    throw new Error_(this.linea, this.columna, 'Semantico', 'Tipos incompatibles ' + Tipo[val.tipo] + ' no asignable a ' +  Tipo[tip]);
                }
            }else{
                //Tiene expresion pero no tiene tipo explicito
                entorno.guardarVariable(this.id, val.value, val.tipo, this.variable);
            }
        }else{
            //No tiene valor explicito pero si tipo
            let tip : number = -1;
            if(this.tipo != Tipo.NULL){
                if(this.tipo instanceof AccesoTipoType){
                    const t = this.tipo.execute(entorno);
                    tip = t.tipo;
                    entorno.guardarVariable(this.id, null , tip, this.variable);
                }else{
                    entorno.guardarVariable(this.id, null , this.tipo , this.variable);
                }
            }else{
                //No tiene tipo ni valor declarado
                entorno.guardarVariable(this.id, null , Tipo.NULL, this.variable);
            }
        }        
    }
}