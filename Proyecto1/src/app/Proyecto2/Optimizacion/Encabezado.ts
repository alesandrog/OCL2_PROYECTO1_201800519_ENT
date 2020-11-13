import { Linea } from './Linea';

export class Encabezado extends Linea{

    public value : string;

    constructor(value:string,linea:number, columna:number){
        super(linea, columna);
        this.value = value;    }

    public optimizar():string{
        return this.value;
    }
}