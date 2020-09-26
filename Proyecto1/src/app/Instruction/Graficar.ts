import { Instruction } from "../Abstract/Instruccion";
import { Tipo } from '../Abstract/Retorno';
import { Entorno } from "../Symbol/Entorno";
import { salidaSimbolos } from '../Symbol/SalidaTablas';
import { Simbolo } from '../Symbol/Simbolo';
import { Funcion } from './Funcion';

export class Graficar extends Instruction{

    private line : number;
    private column : number;

    constructor( line : number, column : number){
        super(line, column);
        this.line = line;
        this.column = column;
    }

    public execute(environment : Entorno){
        console.log("========================== GRAFICAR TS");
        console.log(environment.variables);
        console.log(environment.funciones);
        console.log(environment);
        environment.variables.forEach( (val : Simbolo , key : string) => {
            val.idEntorno = environment.idEntorno;
            salidaSimbolos.push(val);
        });
        if(environment.anterior != null){
            environment.anterior.variables.forEach( (val : Simbolo , key : string) => {
                val.idEntorno = environment.anterior.idEntorno;
                salidaSimbolos.push(val);
            });
        }else{
            console.log("no tengo anterior xd" + environment.idEntorno);
        }

        environment.funciones.forEach((val : Funcion , key : string ) => {
            let smb = new Simbolo("" , val.id , val.tipoRep, true);
            smb.idEntorno = environment.idEntorno;
            salidaSimbolos.push(smb);
        });
        console.log("========================== SALIDA RESSU");
        console.log(salidaSimbolos);
    }
}