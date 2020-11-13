import { Linea } from './Linea';

export class SaltoInc extends Linea{

    public label : string;

    constructor(label:string,linea:number, columna:number){
        super(linea, columna);
        this.label = label;    }

    public optimizar():string{
        return `goto ${this.label};`;
    }
}