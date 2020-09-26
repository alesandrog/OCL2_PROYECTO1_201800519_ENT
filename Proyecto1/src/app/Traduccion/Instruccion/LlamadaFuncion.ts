import { InstruccionT } from "../Abstract/Instruccion";
import { ExpresionT } from "../Abstract/Expresion";
import { EntornoT } from "../Symbol/Entorno";
import { MapTraducidos } from "../MapsGlobales";


export class LlamadaFuncionT extends InstruccionT{

    public puntoc : string = "";
    constructor(private id: string,  public parametros : ExpresionT[] | null){
        super();
    }

    public traducir(entorno : EntornoT) :string {
        let params = "";
        if(this.parametros != null){
            for(let i = 0; i < this.parametros.length; i++){
                if(i != this.parametros.length-1){
                    params += `${this.parametros[i].traducir(entorno)},`;                
                }else{
                    params += `${this.parametros[i].traducir(entorno)}`;                                
                }
            }
        }
        let id = "";
        if(MapTraducidos.has(this.id)){
            id = MapTraducidos.get(this.id);
            return `${id}(${params})${this.puntoc}`;
        }
        return `${this.id}(${params})${this.puntoc}`;
    }
}
