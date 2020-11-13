import { VirtualTimeScheduler } from 'rxjs';
import { Linea } from './Linea';

export class DeclaracionOpt extends Linea{

    public tipo : string;
    public listaId : string[];

    constructor(tipo:string, listaId:string[],linea:number, columna:number){
        super(linea, columna);
        this.tipo = tipo;
        this.listaId = listaId;
    }

    public optimizar():string{
        if(this.listaId.length>1)
            return `${this.tipo} ${this.listaId.join(',')};`;
        return `${this.tipo} ${this.listaId[0]};`;
    }
}