import { Linea } from './Linea';

export class FuncionOpt extends Linea{

    public id : string;
    public instrucciones : Linea[];

    constructor(id:string, instrucciones:Linea[],linea:number, columna:number){
        super(linea, columna);
        this.id = id;
        this.instrucciones = instrucciones;
    }

    public optimizar():string{
        let res = "";
        let arr = [];
        res += `void ${this.id}(){\n`;
        for(const val of this.instrucciones)
            arr.push(val.optimizar());
        return res + arr.join('\n') + "\n}"
    }
}