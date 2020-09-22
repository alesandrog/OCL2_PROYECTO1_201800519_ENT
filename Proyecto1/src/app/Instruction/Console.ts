import { Instruction } from "../Abstract/Instruccion";
import { Expresion } from "../Abstract/Expresion";
import { Entorno } from "../Symbol/Entorno";
import { Tipo, Retorno } from "../Abstract/Retorno";
import { Arreglo2 } from "../Instruction/Arreglo2";
import { listaSalida  } from "../Abstract/ListaSalida"
export class Console extends Instruction{

    constructor(private value : Expresion[], line : number, column : number){
        super(line, column);
    }

    public execute(entorno : Entorno) {
        let value : any;

        let result : string = "";
        for(const instr of this.value){
            const exec = instr.execute(entorno);
            if(exec.tipo == Tipo.ARRAY){
                result += this.ejecutar(entorno, exec).value;
            }else{
                result += exec.value;
            }
        }
        console.log(result);
        listaSalida.push(result);        
        
    }

    public ejecutar(entorno : Entorno, arreglo : Retorno): Retorno {
        let res = [];
        for(const instr of arreglo.value){
            if(instr.tipo == Tipo.ARRAY){
                res.push(this.ejecutar(entorno, instr).value);
            }else{
                res.push(instr.value);
            }
        }
        return { value : res, tipo : Tipo.ARRAY };
    }
}