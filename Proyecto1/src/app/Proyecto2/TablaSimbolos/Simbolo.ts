import { Tipo } from "../Util/Tipo";

export class Simbolo {
    type: Tipo;
    identifier: string;
    position: number;
    isConst: boolean;
    isGlobal: boolean;
    isHeap: boolean;

    constructor(type: Tipo, identifier: string, position: number, isConst: boolean, isGlobal: boolean, isHeap: boolean = false) {
        this.type = type;
        this.identifier = identifier;
        this.position = position;
        this.isConst = isConst;
        this.isGlobal = isGlobal;
        this.isHeap = isHeap;
    }
}