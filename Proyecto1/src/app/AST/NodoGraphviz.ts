
export class NodoGraphviz{

    public id : string;
    public label : string;
    public apuntadores : string[];

    constructor(id: string, label : string , apuntadores : string[]){
        this.id = id;
        this.label = label;
        this.apuntadores = apuntadores;
    }
}