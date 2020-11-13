import { Linea } from './Linea';

export class Print extends Linea{

    public tipo : string;
    public casteo:string;
    public value : string;

    constructor(tipo:string, casteo:string,  value:string, linea:number, columna:number){
        super(linea, columna);
        this.tipo = tipo;
        this.casteo = casteo;
        this.value = value;
    }

    public optimizar():string{
        return `printf(${this.tipo},${this.casteo}${this.value});`;
    }
}