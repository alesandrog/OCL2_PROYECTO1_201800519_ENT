import { EntornoT } from "../Symbol/Entorno"

export abstract class ExpresionT {


    constructor() {
    }

    public abstract traducir(entorno : EntornoT): string;

}