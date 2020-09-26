  
import { EntornoT } from "../Symbol/Entorno";
import { InstruccionT } from "../Abstract/Instruccion";
import { DeclaracionT } from "./Declaracion"
import { MapTraducidos, MapAccesos, MapEntornos } from "../MapsGlobales";
//import { Parametro } from "./Parametro";


export class FuncionT extends InstruccionT{

    public id : string;
    public parametros : string;
    public tipo : string;
    public instrucciones : InstruccionT[];
    public entorno : string;
    public anidadas : FuncionT[];

    constructor( id: string,  parametros : string, tipo: string, instrucciones: InstruccionT[], entorno : string , anidadas : FuncionT[] ){
        super();
        this.id = id;
        this.parametros = parametros;
        this.tipo = tipo;
        this.instrucciones = instrucciones;
        this.entorno = entorno;
        this.anidadas = anidadas;
    }

    public traducir(entorno : EntornoT) : any {
        console.log("========================================= FUNCION");
        console.log(this.instrucciones);
        if(this.entorno == ""){ //es una global
        //PASO 1> Llenar el map de traducidos y el map de accesos
   /*     for(let i = this.anidadas.length -1; i >= 0; i--){
            MapTraducidos.set(this.anidadas[i].id , `${this.anidadas[i].entorno}_${this.anidadas[i].id}`); 
            MapAccesos.set(`${this.anidadas[i].entorno}_${this.anidadas[i].id}` , this.anidadas[i].entorno);
        }*/
        
        //PASO 2> Traducir el contenido de la funcion
        let code = "";
        let env = new EntornoT(entorno);
        for(const instr of this.instrucciones){
            code += instr.traducir(env) + "\n";            
        }
        let funcGlobal = `function ${this.entorno}${this.id}(${this.parametros})${this.tipo} { \n${code}\n}`;

        //PASO 3 > Guardar el entorno de la funcion global en el map 
//        MapEntornos.set(this.id, env);


        let funcAnidadas = "";
        for(let i = this.anidadas.length -1; i >= 0; i--){
            funcAnidadas += this.anidadas[i].traducir(entorno) + "\n";
        }
        return `${funcGlobal}\n${funcAnidadas}\n`;
        }else{ //es una anidada
            //PASO 1 > Buscar el entorno padre y llenar el nuevo entorno a partir de el
  //          const padre : EntornoT = MapEntornos.get(this.entorno);
            let env = new EntornoT(entorno.getGlobal());
            
            //PASO 2 > Traducir el contenido de la anidada
            let code = "";
            for(const instr of this.instrucciones){
                code += instr.traducir(env) + "\n";
            }
            
            //PASO 3 >  Guardar el entorno de la anidada en el map
//            MapEntornos.set(`${this.entorno}_${this.id}` , env);

            return `function ${this.entorno}_${this.id}(${this.parametros}) ${this.tipo}{ \n${code}\n}`;
        }
    }

    public llenarMapas(entorno : EntornoT){
        for(let i = this.anidadas.length -1; i >= 0; i--){
            MapTraducidos.set(this.anidadas[i].id , `${this.anidadas[i].entorno}_${this.anidadas[i].id}`); 
            MapAccesos.set(`${this.anidadas[i].entorno}_${this.anidadas[i].id}` , this.anidadas[i].entorno);
        }  
    } 
}
