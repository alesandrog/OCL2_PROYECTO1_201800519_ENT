import { EntornoT } from "../Symbol/Entorno"

export abstract class InstruccionT {


    constructor() {
    }

    public abstract traducir(entorno : EntornoT): string;

}