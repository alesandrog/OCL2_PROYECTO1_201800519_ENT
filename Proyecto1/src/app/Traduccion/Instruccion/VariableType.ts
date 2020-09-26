import { EntornoT } from "../Symbol/Entorno";
import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion";
import { AtrTypeT } from "./AtrType";
import { env } from "process";


export class VariableTypeT extends InstruccionT{

    public id : string;
    public tipo : string = "";
    public tipoVariable : string = "";
    public expresion : AtrTypeT[] | null;

    constructor(id: string, tipo : string,  tipoVariable : string, expresion: AtrTypeT[] | null ){
        super();
        this.id = id;
        this.tipo = tipo;
        this.tipoVariable = tipoVariable;
        this.expresion = expresion;
    }

    public traducir(entorno : EntornoT):string{
        //Verificar la expresion
        console.log(this);
        let exp = "";
        if(this.expresion != null){
            for(let i = 0; i < this.expresion.length; i++){
                if( i < this.expresion.length -1){
                    exp += this.expresion[i].traducir(entorno) + ",\n";
                }else{
                    exp += this.expresion[i].traducir(entorno) ;
                }
            }
        }else{
            exp = "";
        }
        let result = "";
        //Verificar si se encuentra dentro de una funcion
        entorno.declararVariable(this.id,  this.tipo);
        result = `${this.tipoVariable} ${this.id} :${this.tipo} = {\n${exp}\n};`

        return result;
    }
}