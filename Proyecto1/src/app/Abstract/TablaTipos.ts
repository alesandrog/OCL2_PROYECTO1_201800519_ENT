import { Tipo } from "./Retorno";

export const Tipos = [

/*                  NUMBER      STRING         BOOLEAN       VOID         TYPE          ARRAY         NULL*/                
            [
/* NUMBER*/      Tipo.NUMBER,  Tipo.STRING,   Tipo.NUMBER,   Tipo.ERR,    Tipo.ERR,     Tipo.ERR,     Tipo.NULL
            ],
            [
/* STRING*/      Tipo.STRING,  Tipo.STRING,   Tipo.STRING,   Tipo.ERR,    Tipo.STRING,  Tipo.STRING,  Tipo.ERR
            ],
            [ 
/* BOOLEAN*/     Tipo.ERR,     Tipo.STRING,   Tipo.BOOLEAN,  Tipo.NULL,   Tipo.NULL,    Tipo.ERR,     Tipo.ERR
            ],
            [
/* VOID*/        Tipo.ERR,     Tipo.STRING,   Tipo.NULL,     Tipo.NULL,   Tipo.NULL,    Tipo.ERR,     Tipo.ERR
            ],
            [
/* TYPE */       Tipo.ERR,     Tipo.STRING,   Tipo.NULL,     Tipo.NULL,   Tipo.ARRAY,   Tipo.ERR,     Tipo.NULL
            ],
            [
/* ARRAY */      Tipo.ERR,     Tipo.STRING,   Tipo.NULL,     Tipo.NULL,   Tipo.ARRAY,   Tipo.ARRAY,   Tipo.NULL
            ],
            [ 
/* NULL */       Tipo.ERR,     Tipo.STRING,   Tipo.BOOLEAN,     Tipo.NULL,   Tipo.ARRAY,   Tipo.ERR,     Tipo.NULL
            ]            
];