import { Tipo } from "../Abstract/Retorno";
import { Simbolo } from "./Simbolo";

export class SimboloArreglo extends Simbolo{

    public dimension : number;
    public tipoExp : Tipo;

    constructor(valor: any, id: string, tipo: Tipo, variable : boolean , dimension : number, tipoExp : Tipo){
        super(valor, id , tipo, variable);
        this.dimension = dimension;
        this.tipoExp = tipoExp;
    }
}