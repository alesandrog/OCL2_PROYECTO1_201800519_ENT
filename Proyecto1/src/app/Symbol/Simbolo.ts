import { Tipo } from "../Abstract/Retorno";

export class Simbolo{
    public valor :any;
    public id : string;
    public tipo : Tipo | number;
    public variable : boolean;

    constructor(valor: any, id: string, tipo: Tipo, variable : boolean){
        this.valor = valor;
        this.id = id;
        this.tipo = tipo;
        this.variable = variable;
    }
}