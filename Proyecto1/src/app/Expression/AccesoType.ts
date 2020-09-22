import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { Arreglo2 } from "../Instruction/Arreglo2";
import { AccesoIndice } from "./AccesoIndice";
import { Type } from "../Instruction/Types";
import { AccesoArray } from "./AccesoArray";

export class AccesoType extends Expresion{

    public id : string;
    public anterior : Expresion | AccesoType | AccesoIndice | null;
    public indice : string;
    public final : boolean = false;
    public tipoAcc : string;

    constructor(id: string,  anterior : Expresion | AccesoType | AccesoIndice | null , indice : string , final : boolean,tipoAcc : string , linea : number, columna: number){
        super(linea, columna);
        this.id = id;
        this.anterior = anterior;
        this.indice = indice;
        this.final = final;
        this.tipoAcc = tipoAcc;
    }

    //TODO validar null y undefined, mensajes de error

    public execute(entorno : Entorno): any {
        let valor : any;
        if(this.anterior != null){
            if(this.anterior instanceof AccesoType || this.anterior instanceof AccesoIndice){
                this.anterior.id = this.id;
                //retorno el map
                valor = this.anterior.execute(entorno);
                if(valor == null || valor.value == null){
                    return { value:null , tipo : valor.tipo};
                }
                valor = valor.value;
                let res = valor.get(this.indice);                
                return res;    
            }
        }else{
            let type : any;
            type = entorno.getVariable(this.id);
            if(type.tipo > 7){
            let res = type.valor.get(this.indice);
            if(res == null){
                return { value:null , tipo : type.tipo};
            }
            return res;
            }
        }
    }
}