import { Expresion } from "../Abstract/Expresion";
import { Retorno, Tipo } from "../Abstract/Retorno";
import { Entorno } from "../Symbol/Entorno";

export class Arreglo2 extends Expresion{
    
    public value : Array<Expresion> | null | any;

    constructor(valor : Array<Expresion> | null, linea : number, columna: number){
        super(linea, columna);
        this.value = valor;
    }

    public execute(entorno : Entorno): Retorno{

        let res : Array<Expresion> = new Array();

        if(this.value != null){
            for(const instr of this.value){
                const exe = instr.execute(entorno);
                res.push(exe);
            }
        }
        this.value = res;
        return { value : this.value , tipo : Tipo.ARRAY  };
    }

    public get(indice : number) : any{
        let res : any = { value : this.value![indice].value , tipo : this.value![indice].tipo};
        return res;
    }
    
}