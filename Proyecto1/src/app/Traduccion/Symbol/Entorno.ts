import { FuncionT } from "../Instruccion/Funcion";
import { SimboloT } from "./Simbolo";
//import { Funcion } from "../Instruction/Funcion";

//importar funciones

export class EntornoT{
    
    public variables : Map<string, SimboloT>;
    public MapTraducidos : Map<string , string> = new Map<string , string>(); 
    public numeroPasada : number = 0;   
    //map de funciones

    constructor(public anterior : EntornoT | null){
        this.variables = new Map();
//        this.funciones = new Map();
        //inicializar map de funciones
    }

    //TODO errores cuando no existan funciones
    public guardarVariable(id: string, tipo:string ){
        let env : EntornoT | null = this;
        while(env != null){
            if(env.variables.has(id)){
                env.variables.set(id, new SimboloT(id, tipo));
                return;
            }
            env = env.anterior;
        }
        this.variables.set(id, new SimboloT(id, tipo));
    }


    public declararVariable(id: string, tipo:string ){
        let env : EntornoT | null = this;
        if(env.variables.has(id)){
            //TODO error variable redefinida
            return;
        }
        this.variables.set(id, new SimboloT(id, tipo));
    }


    public getVariable(id: string) : SimboloT | undefined | null{
        let env : EntornoT | null = this;
        while(env != null){
            if(env.variables.has(id)){
                return env.variables.get(id);
            }
            env = env.anterior;
        }
        return null;
    }   


    public getGlobal() : EntornoT{
        let env : EntornoT | null = this;
        while(env?.anterior != null){
            env = env.anterior;
        }
        return env;
    }
}