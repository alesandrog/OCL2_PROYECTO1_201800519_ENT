import { EntornoT } from "../Symbol/Entorno";
import { ExpresionT } from "../Abstract/Expresion";
import { InstruccionT } from "../Abstract/Instruccion";
import { AtrTypeT } from "./AtrType";
import { env } from "process";
import { AccesoT } from "../Expresion/Acceso";
import { IdAccesoT } from "./IdAcceso";

export class AsignacionTypeT extends InstruccionT{

    public id : IdAccesoT | string;
    public expresion : AtrTypeT[] | null;
    public ptComa = "";

    constructor(id: IdAccesoT | string, expresion: AtrTypeT[] | null ){
        super();
        this.id = id;
        this.expresion = expresion;
    }

    public traducir(entorno : EntornoT):string{
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

        let iden = "";
        if(this.id instanceof IdAccesoT){
            iden = this.id.traducir(entorno);
        }else{
            iden = this.id;
        }

        result = `${iden} = {\n${exp}\n};`
        return result;
    }
}