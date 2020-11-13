import { Linea } from './Linea';

export class SetHeap extends Linea{

    public id : string;
    public casteo:string;
    public target : string ;
    public value : string|number;

    constructor(id:string, casteo:string, target:string, value:string, linea:number, columna:number){
        super(linea, columna);
        this.id = id;
        this.casteo = casteo;
        this.target = target;
        this.value = value;
    }

    public optimizar():string{
        return `${this.id}[${this.casteo}${this.value}] = ${this.target} ;`;
    }
}