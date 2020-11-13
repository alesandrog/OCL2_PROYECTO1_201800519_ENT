import { Linea } from './Linea';

export class GetHeap extends Linea{

    public id : string;
    public casteo:string;
    public target : string;
    public value : string;

    constructor(id:string, casteo:string, target:string, value:string, linea:number, columna:number){
        super(linea, columna);
        this.id = id;
        this.casteo = casteo;
        this.target = target;
        this.value = value;
    }

    public optimizar():string{
        return `${this.target} = ${this.id}[${this.casteo}${this.value}];`;
    }
}