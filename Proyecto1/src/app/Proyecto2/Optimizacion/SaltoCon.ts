import { Linea } from './Linea';

export class SaltoCon extends Linea{

    public lft : string;
    public operador:string;
    public rgt : string;
    public label : string;

    constructor(lft:string, operador:string, rgt:string, label:string,linea:number, columna:number){
        super(linea, columna);
        this.lft = lft;
        this.rgt = rgt;
        this.operador = operador;
        this.label = label;    
    }

    public optimizar():string{
        return `if(${this.lft} ${this.operador} ${this.rgt}) goto ${this.label};`;
    }
}