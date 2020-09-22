import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";
import { Entorno } from "../Symbol/Entorno";

export class Ternario extends Expresion{
    
    constructor(private condicion : Expresion, private val1 : Expresion , private val2 : Expresion , linea : number, columna: number, private tipo : number){
        super(linea, columna);
    }

    public execute(entorno : Entorno) : Retorno{
        const condicion = this.condicion.execute(entorno);

        if(condicion == null || condicion == undefined)
            throw new Error_(this.linea, this.columna, 'Semantico', 'Valor indefinido para condicion');
    
        if(condicion.tipo != Tipo.BOOLEAN)
            throw new Error_(this.linea, this.columna, 'Semantico', 'Condicion no Booleana ');

        if(condicion.value == true){
            const ret1 = this.val1.execute(entorno);
            if(ret1 == null || ret1 == undefined)
                throw new Error_(this.linea, this.columna, 'Semantico', 'Valor indefinido para expresion verdadera');    
            return ret1;
        }
        else{
            const ret2 = this.val2.execute(entorno);
            if(ret2 == null || ret2 == undefined)
                throw new Error_(this.linea, this.columna, 'Semantico', 'Valor indefinido para expresion falsa');    
            return ret2;
        }
    }
}