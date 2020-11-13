export class SimboloReporte {
    id:string;
    tipo: string;
    posicion : number;
    dimension: number;
    subtipo: string;
    ambito: string;
    referencia:boolean;
    funcion:boolean;

    constructor(id:string, tipo:string, posicion:number, dimension:number, subtipo:string, ambito:string, referencia:boolean) {
        this.id = id;
        this.tipo = tipo;
        this.posicion = posicion;
        this.dimension = dimension;
        this.subtipo = subtipo;
        this.ambito = ambito;
        this.referencia = referencia;
        this.funcion = false;
    }
}