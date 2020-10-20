//import { SymbolFunction } from "./SymbolFunction";
//import { SymbolStruct } from "./SymbolStruct";
import { Simbolo } from "./Simbolo";
import { Tipo, Tipos } from "../Util/Tipo";
//import { Error } from "../Utils/Error";
//import { FunctionSt } from "../Instruction/Functions/FunctionSt";
//import { StructSt } from "../Instruction/Functions/StructSt";
//import { Param } from "../Utils/Param";

export class Entorno {
//    functions: Map<string, SymbolFunction>;
//    structs: Map<string, SymbolStruct>;
    vars: Map<string, Simbolo>;
    anterior: Entorno | null;
    size: number;
    break: string | null;
    continue: string | null;
    return: string | null;
    prop : string;
//    actualFunc: SymbolFunction | null;

    constructor(anterior: Entorno | null = null) {
//        this.functions = new Map();
//        this.structs = new Map();
        this.vars = new Map();
        this.anterior = anterior;
        this.size = anterior?.size || 0;
        this.break = anterior?.break || null;
        this.return = anterior?.return || null;
        this.continue = anterior?.continue || null;
        this.prop = 'main';
  //      this.actualFunc = anterior?.actualFunc || null;
    }
/*
    setEnviorementFunc(prop: string, actualFunc : SymbolFunction, ret : string){
        this.size = 1; //1 porque la posicion 0 es para el return
        this.prop = prop;
        this.return = ret;
        this.actualFunc = actualFunc;
    }
*/
    public addVar(id: string, type: Tipo, isConst: boolean, isRef: boolean): Simbolo | null {
        id = id.toLowerCase();
        if (this.vars.get(id) != undefined) {
            return null;
        }
        const newVar = new Simbolo(type, id, this.size++, isConst, this.anterior == null, isRef);
        this.vars.set(id, newVar);
        return newVar;
    }
/*
    public addFunc(func: FunctionSt, uniqueId: string) : boolean{
        if(this.functions.has(func.id.toLowerCase())){
            return false;
        }
        this.functions.set(func.id.toLowerCase(),new SymbolFunction(func,uniqueId));
        return true;
    }

    public addStruct(id: string, size: number, params: Array<Param>) : boolean{
        if(this.structs.has(id.toLocaleLowerCase())){
            return false;
        }
        this.structs.set(id.toLowerCase(),new SymbolStruct(id.toLowerCase(),size,params));
        return true;
    }
*/
    public getVar(id: string) : Simbolo | null{
        let env : Entorno | null = this;
        id = id.toLowerCase();
        while(env != null){
            const sym = env.vars.get(id);
            if(sym != undefined){
                return sym;
            }
            env = env.anterior;
        }
        return null;
    }
/*
    public getFunc(id: string) : SymbolFunction | undefined{
        return this.functions.get(id.toLocaleLowerCase());
    }

    public searchFunc(id: string) : SymbolFunction | null{
        let enviorement : Enviorement | null = this;
        id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.functions.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }

    public structExists(id: string){
        return this.structs.get(id.toLocaleLowerCase());
    }

    public searchStruct(id: string) : SymbolStruct | null{
        let enviorement : Enviorement | null = this;
        id = id.toLowerCase();
        while(enviorement != null){
            const sym = enviorement.structs.get(id);
            if(sym != undefined){
                return sym;
            }
            enviorement = enviorement.anterior;
        }
        return null;
    }*/
}