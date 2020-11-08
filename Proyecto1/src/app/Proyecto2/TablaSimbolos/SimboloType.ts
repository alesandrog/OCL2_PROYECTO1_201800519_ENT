import { Tipo } from "../../Abstract/Retorno";
import { AtributoType } from './AtributoType';

export class SimboloType{

    public id : string;
    public atributos : Map<string, AtributoType>;
    public size : number;
    constructor(id:string, atributos:Map<string,AtributoType>, size:number){
        this.id = id;
        this.atributos = atributos;
        this.size = size;
    }
}