import { Entorno } from "../Symbol/Entorno";


//Map para guardar funcion con su tabla de simbolos
export let MapEntornos : Map<string , Entorno> = new Map<string , Entorno>();

//Map para guardar funciones y los entornos que pueden acceder
export let MapAccesos : Map<string , string> = new Map<string , string>();


//Map para guardar id de funcion y su traduccion
export let MapTraducidos : Map<string , string> = new Map<string , string>();
