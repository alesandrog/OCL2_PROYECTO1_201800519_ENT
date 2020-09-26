import { EntornoT } from "../Symbol/Entorno";
import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion"
import { env } from "process";


export class DeclaracionT extends InstruccionT{

    public id : string;
    public tipo : string;
    public tipoVariable : string;
    public expresion : ExpresionT | null;
    public ptComa = ";"

    constructor(id: string, tipo : string,  tipoVariable : string, expresion:ExpresionT | null ){
        super();
        this.id = id;
        this.tipo = tipo;
        this.tipoVariable = tipoVariable;
        this.expresion = expresion;
    }

    public traducir(entorno : EntornoT):string{
        //Verificar la expresion
        let exp;
        if(this.expresion != null){
            exp = "= " + this.expresion.traducir(entorno);
        }else{
            exp = "";
        }

        let result = "";
        //Verificar si se encuentra dentro de una funcion
        entorno.declararVariable(this.id,  this.tipo);
        if(this.tipo != ""){
            result = `${this.tipoVariable} ${this.id} :${this.tipo} ${exp};`
        }else{
            result = `${this.tipoVariable} ${this.id} ${exp};`
        }

        return result;
    }
}