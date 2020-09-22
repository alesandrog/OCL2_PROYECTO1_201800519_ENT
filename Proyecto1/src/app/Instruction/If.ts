import { Instruction } from "../Abstract/Instruccion";
import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { BloqueInstrucciones } from "./BloqueInstrucciones";

export class If extends Instruction{

    constructor(private condicion : Expresion, private code : BloqueInstrucciones , private elsSt : any,
        linea : number, columna : number){
        super(linea, columna);
    }

    public execute(entorno : Entorno ) {
        const condition = this.condicion.execute(entorno);
        if(condition.tipo != Tipo.BOOLEAN){
            throw new Error_(this.linea, this.columna, 'Semantico', 'La condicion no es booleana ' + ' > ' +  Tipo[condition.tipo]);
        }

        if(condition.value == true){
           return this.code.execute(entorno);
        }
        else{
            if(this.elsSt != null){
                return this.elsSt.execute(entorno);                   
            }
        }
    }
}
