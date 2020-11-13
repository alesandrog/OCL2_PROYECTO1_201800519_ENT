export abstract class Linea{

    linea: number;
    columna : number;
    lider : boolean;

    constructor(line: number, column: number, lider:boolean = false){
        this.linea = line;
        this.columna = column;
        this.lider = lider;
    }

    public abstract optimizar() : string;
}