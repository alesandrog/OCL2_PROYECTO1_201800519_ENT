import { Linea } from './Linea';

export class AsigOpt extends Linea{

    public id : string;
    public lft : string;
    public operador : string;
    public rgt : string;
    public binaria : boolean = true;

    constructor(id:string, lft:string, operador:string, rgt:string, binaria:boolean,linea:number, columna:number){
        super(linea, columna);
        this.id = id;
        this.lft = lft;
        this.operador = operador;
        this.rgt = rgt;
        this.binaria = binaria;
    }

    public optimizar():string{
        return this.mirilla();
    }

    public mirilla():string{

        if(this.binaria){
            /* REGLAS PARA SUMA */
            if(this.operador == "+"){
                /* VAL + 0 || 0 + VAL */
                if(this.lft != "0" && this.rgt == "0"){
                    // REGLA 6 : id = id + 0
                    if(this.id == this.lft){
                        return ""; // CODIGO ELIMINADO
                    }else{
                        // REGLA 10 : id = id2 + 0
                        return `${this.id} = ${this.lft};`
                    }  
                }else if(this.lft == "0" && this.rgt != "0"){
                    // REGLA 6 : id = 0 + id
                    if(this.id == this.rgt){
                        return ""; // CODIGO ELIMINADO
                    }else{
                        // REGLA 10 : id =   0 + id2
                        return `${this.id} = ${this.rgt};`
                    }  
                }
                return `${this.id} = ${this.lft} ${this.operador} ${this.rgt};`;                
            }
            else if(this.operador == "-"){
                if(this.lft != "0" && this.rgt == "0"){
                    // REGLA 7 : id = id - 0
                    if(this.id == this.lft){
                        return ""; // CODIGO ELIMINADO
                    }else{
                        // REGLA 11 : id = id2 - 0
                        return `${this.id} = ${this.lft};`
                    }  
                }
                // no aplica
                return `${this.id} = ${this.lft} ${this.operador} ${this.rgt};`;
            }
            else if(this.operador == "*"){
                /* VAL * 1 || 1 * VAL */
                if(this.lft != "1" && this.rgt == "1"){
                    // REGLA 8 : id = id * 1
                    if(this.id == this.lft){
                        return ""; // CODIGO ELIMINADO
                    }else{
                        // REGLA 12 : id = id2 * 1
                        return `${this.id} = ${this.lft};`
                    }  
                }else if(this.lft == "1" && this.rgt != "1"){
                    // REGLA 8 : id = 1*  id
                    if(this.id == this.rgt){
                        return ""; // CODIGO ELIMINADO
                    }else{
                        // REGLA 12 : id =   1 * id2
                        return `${this.id} = ${this.rgt};`
                    }  
                }
                else if(this.lft != "0" && this.rgt == "0"){
                    // REGLA 15 : id = id * 0
                    return `${this.id} = 0;`
                }
                else if(this.lft == "0" && this.rgt != "0"){
                    return `${this.id} = 0;`  
                }
                else if(this.lft != "2" && this.rgt == "2"){
                    // REGLA 14 : id = id * 2
                    return `${this.id} = ${this.lft} + ${this.lft};`
                }else if(this.lft == "2" && this.rgt != "2"){
                    // REGLA 14 : id = 2*  id
                    return `${this.id} = ${this.rgt} + ${this.rgt};`
                }                
                return `${this.id} = ${this.lft} ${this.operador} ${this.rgt};`;
            }
            else if(this.operador == "/"){
                if(this.lft != "1" && this.rgt == "1"){
                    // REGLA 9 : id = id / 1
                    if(this.id == this.lft){
                        return ""; // CODIGO ELIMINADO
                    }else{
                        // REGLA 13 : id = id2 / 1
                        return `${this.id} = ${this.lft};`
                    }  
                }
                else if(this.lft == "0" && this.rgt != "0"){
                    // REGLA 16 : id = 0 / id
                    return `${this.id} = ${this.rgt};`
                }
                return `${this.id} = ${this.lft} ${this.operador} ${this.rgt};`;
            }
        }
        if(this.id == this.lft)
            return "";            
        return `${this.id} = ${this.lft};`;
    }
}