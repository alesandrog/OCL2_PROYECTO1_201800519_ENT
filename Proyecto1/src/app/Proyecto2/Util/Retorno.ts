import { Simbolo } from "../TablaSimbolos/Simbolo";
import { Tipo } from "./Tipo";
import { Generator } from "../Generator/Generator";

export class Retorno{
    private value : string;
    isTemp : boolean;
    type : Tipo;
    trueLabel : string;
    falseLabel : string;
    symbol : Simbolo | null;

    constructor(value: string, isTemp: boolean, type: Tipo, symbol: Simbolo | null= null){
        this.value = value;
        this.isTemp = isTemp;
        this.type = type;
        this.symbol = symbol;
        this.trueLabel = this.falseLabel = '';
    }

    public getValue(){
        Generator.getInstance().freeTemp(this.value);
        return this.value;
    }
}