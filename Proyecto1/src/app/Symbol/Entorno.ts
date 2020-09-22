import { Simbolo } from "./Simbolo";
import { Tipo } from "../Abstract/Retorno";
import { Funcion } from "../Instruction/Funcion";
import { SimboloArreglo } from "./SimboloArreglo";
import { Error_ } from "../Error/Error";
import { strict } from 'assert';
//importar funciones

export class Entorno{
    
    public variables : Map<string, Simbolo>;
    public tiposUsuario : Map<string, Simbolo>;
    private funciones : Map<string , Funcion>;
    public cantidadCiclos : number;
    public cantidadFunciones : number;
    public indiceTipos : number;
    public typeTemporal : string = "";
    //map de funciones

    constructor(public anterior : Entorno | null){
        this.variables = new Map();
        this.funciones = new Map();
        this.tiposUsuario = new Map();
        this.cantidadCiclos = 0;
        this.cantidadFunciones = 0;
        this.indiceTipos = 8;
        //inicializar map de funciones
    }

    //TODO errores cuando no existan funciones
    public guardarVariable(id: string, valor: any, tipo:Tipo | number, variable:boolean ){
        let env : Entorno | null = this;
        if(this.variables.has(id)){
            console.log("ya existe la variable");
            return; //error variable ya declarada en el entorno
        }
        this.variables.set(id, new Simbolo(valor, id, tipo, variable));
    }

    public actualizarVariable(id: string, valor: any, tipo:Tipo | number, variable:boolean ){
        let env : Entorno | null = this;
        while(env != null){
            if(env.variables.has(id)){
                env.variables.set(id, new Simbolo(valor, id, tipo, variable));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new Simbolo(valor, id, tipo, variable));
    }



    public guardarTipo(id: string, valor: any, variable:boolean ){
        let env : Entorno | null = this;
        if(env.tiposUsuario.has(id)){
            throw new Error_(0, 0, 'Semantico', 'Tipo '+ id + ' ya se encuentra definido ' );
        }
        this.tiposUsuario.set(id, new Simbolo(valor, id, this.indiceTipos, variable));
        this.indiceTipos++;
    }

    public actualizarTipo(id: string, valor: any, variable:boolean ){
        let env : Entorno | null = this;
        while(env != null){
            if(env.tiposUsuario.has(id)){
                let tipo = env.tiposUsuario.get(id);
                this.tiposUsuario.set(id, new Simbolo(valor, id, tipo?.tipo!, variable));
            }
            env = env.anterior;
        }
    }


    public getTipo(id: string) : Simbolo | undefined | null{
        let env : Entorno | null = this;
        while(env != null){
            if(env.tiposUsuario.has(id)){
                return env.tiposUsuario.get(id);
            }
            env = env.anterior;
        }
        return null;
    }
/*
    public buscarTipo(id: number) : Simbolo | undefined | null{
        let env : Entorno | null = this;
        let encontrado = false;
        while(env != null && (encontrado == false)){
            for(const [tipo , simbolo] of env.tiposUsuario){
                if(simbolo.tipo == id){
                    encontrado = true;
                    return simbolo;
                }
            }
            env = env.anterior;
        }
        return null;
    }
*/
public buscarTipo(id: number) : Simbolo | undefined | null{
    let env : Entorno | null = this;
    let encontrado = false;
    let result : Simbolo | null | undefined = null;
    while(env != null && (encontrado == false)){
        env.tiposUsuario.forEach( (simb : Simbolo , tipo : string) => {
            console.log("============ ENTORNO");
            console.log("El anterior de actual es -> " + env.anterior);
            console.log(simb);
            console.log(tipo);
            if(simb.tipo == id){
                encontrado = true;
                result = simb;
            }
        });
        env = env.anterior;
    }
    return result;
}



    public guardarArreglo(id: string, valor: any, tipo:Tipo | number, variable:boolean, dimension : number, tipoExp : Tipo ){
        let env : Entorno | null = this;
        while(env != null){
            if(env.variables.has(id)){
                env.variables.set(id, new SimboloArreglo(valor, id, tipo, variable, dimension , tipoExp));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new SimboloArreglo(valor, id, tipo, variable, dimension , tipoExp));
    }

    public getVariable(id: string) : Simbolo | undefined | null{
        let env : Entorno | null = this;
        while(env != null){
            if(env.variables.has(id)){
                return env.variables.get(id);
            }
            env = env.anterior;
        }
        return null;
    }   

    public guardarFuncion(id: string, funcion : Funcion){
        let env : Entorno | null = this;
        while(env != null){
            if(env.funciones.has(id)){
                throw new Error_(0, 0, 'Semantico', 'Funcion '+ id + ' ya se encuentra definida ' );
            }
            env = env.anterior;
        }
        this.funciones.set(id, funcion);
    }

    public getFuncion(id: string) : Funcion | undefined{
        let env : Entorno | null = this;
        while(env != null){
            if(env.funciones.has(id)){
                return env.funciones.get(id);
            }
            env = env.anterior;
        }
        return undefined;
    }

    public getGlobal() : Entorno{
        let env : Entorno | null = this;
        while(env?.anterior != null){
            env = env.anterior;
        }
        return env;
    }
}