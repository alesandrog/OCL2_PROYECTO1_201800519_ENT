//import { SymbolFunction } from "./SymbolFunction";
//import { SymbolStruct } from "./SymbolStruct";
import { Simbolo } from "./Simbolo";
import { Tipo, Tipos } from "../Util/Tipo";
import { Funcion } from '../Instruccion/Funciones/Funcion';
import { SimboloType } from './SimboloType';
import { AtributoType } from './AtributoType';
//import { Error } from "../Utils/Error";
//import { FunctionSt } from "../Instruction/Functions/FunctionSt";
//import { StructSt } from "../Instruction/Functions/StructSt";
//import { Param } from "../Utils/Param";

export class Entorno {
    funciones: Map<string, Funcion>;
    types: Map<string, SimboloType>;
    vars: Map<string, Simbolo>;
    anterior: Entorno | null;
    size: number;  // Valor relativo dentro de las funciones
    break: string | null;
    continue: string | null;
    return: string | null;
    prop : string;  //Nombre del entorno actual
    actualFunc: Funcion | null;

    constructor(anterior: Entorno | null = null) {
        this.funciones = new Map();
        this.types = new Map();
        this.vars = new Map();
        this.anterior = anterior;
        this.size = anterior?.size || 0;
        this.break = anterior?.break || null;
        this.return = anterior?.return || null;
        this.continue = anterior?.continue || null;
        this.prop = 'main';
        this.actualFunc = anterior?.actualFunc || null;
    }

    guardarMetadata(prop: string, actualFunc : Funcion, ret : string){
        this.size = 1; //1 porque la posicion 0 es para el return
        this.prop = prop;
        this.return = ret;
        this.actualFunc = actualFunc;
    }

    public addVar(id: string, type: Tipo, isConst: boolean, isRef: boolean): Simbolo | null {
        id = id.toLowerCase();
        if (this.vars.get(id) != undefined) {
            return null;
        }
        const newVar = new Simbolo(type, id, this.size++, isConst, this.anterior == null, isRef);
        this.vars.set(id, newVar);
        return newVar;
    }

    public guardarFuncion(func: Funcion, uniqueId: string) : boolean{
        if(this.funciones.has(func.id.toLowerCase())){
            return false;
        }
        this.funciones.set(func.id.toLowerCase(), func);
        return true;
    }

    public definirType(id: string, size: number, params: Map<string, AtributoType>) : boolean{
        if(this.types.has(id.toLocaleLowerCase())){
            return false;
        }
        this.types.set(id.toLowerCase(),new SimboloType(id.toLowerCase(),params, size));
        return true;
    }

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

    public getFuncion(id: string) : Funcion | undefined{
        return this.funciones.get(id.toLocaleLowerCase());
    }

    public buscarFuncion(id: string) : Funcion | null{
        let env : Entorno | null = this;
        id = id.toLowerCase();
        while(env != null){
            const sym = env.funciones.get(id);
            if(sym != undefined){
                return sym;
            }
            env = env.anterior;
        }
        return null;
    }

    public hasType(id: string){
        return this.types.get(id.toLocaleLowerCase());
    }

    public buscarType(id: string) : SimboloType | null{
        let env : Entorno | null = this;
        id = id.toLowerCase();
        while(env != null){
            const sym = env.types.get(id);
            if(sym != undefined)
                return sym;
            env = env.anterior;
        }
        return null;
    }
}