import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Retorno } from "../Abstract/Retorno";
import { Error_ } from "../Error/Error";

export class AccesoArray extends Expresion{

    constructor(private id: string, private accesos : Expresion[] ,linea : number, columna: number){
        super(linea, columna);
    }

    public execute(entorno : Entorno): Retorno {
        const value = entorno.getVariable(this.id)?.valor;
        if(value == null)
            throw new Error_(this.linea, this.columna, 'Semantico', 'La variable:  ' + this.id +'  no esta declarada en este entorno ');
        let result : any;
        result = value;
        for( let i = 0; i < this.accesos.length; i++){
            if( i != this.accesos.length -1){
                const indice = this.accesos[i].execute(entorno).value;
                result = result[indice].value;
            }else{
                const indice = this.accesos[i].execute(entorno).value;
                result = result[indice];
            }
        }
        if(result != undefined && result != null)
            return {value : result.value, tipo : result.tipo};
        throw new Error_(this.linea, this.columna, 'Semantico', 'Indice invalido ');
    }
}