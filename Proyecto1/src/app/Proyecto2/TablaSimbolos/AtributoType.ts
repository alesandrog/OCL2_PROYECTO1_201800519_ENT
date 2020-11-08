import { Tipo } from '../Util/Tipo';


export class AtributoType{
    
    public id : string;
    public indice : number;
    public tipo : Tipo;

    constructor( id : string , tipo : Tipo){
        this.id = id;
        this.tipo = tipo;
    }
}