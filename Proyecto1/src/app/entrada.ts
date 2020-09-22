

console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");
console.log("**********************************************************************************************************");



type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};

function height(n: AVLNode): number {
    if (n == null) {
        return 0;
    }
    return n.height;
}

function insert(node: AVLNode, value: number) :AVLNode {
    /* 1.  Perform the normal BST rotation */
    if (node == null) {
        node = {
            left: null,
            right: null,
            height: 0,
            value: value
        };
        return node;
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    } else {
        node.right = insert(node.right, value);
    }

    /* 2. Update height of this ancestor node */
    if (height(node.left) > height(node.right)) {
        node.height = height(node.left) + 1;
    } else {
        node.height = height(node.right) + 1;
    }

    /* 3. Get the balance factor of this ancestor node to check whether
       this node became unbalanced */
    let balance = getBalance(node);

    // If this node becomes unbalanced, then there are 4 cases
    // Left Left Case
    if (balance > 1 && value < node.left.value) {
        return rightRotate(node);
    }

    // Right Right Case
    if (balance < -1 && value > node.right.value) {
        return leftRotate(node);
    }

    // Left Right Case
    if (balance > 1 && value > node.left.value) {
        node.left = leftRotate(node.left);
        return rightRotate(node);
    }

    // Right Left Case
    if (balance < -1 && value < node.right.value) {
        node.right = rightRotate(node.right);
        return leftRotate(node);
    }

    /* return the (unchanged) node pointegerer */
    return node;
}

function rightRotate(y: AVLNode): AVLNode {
    let x: AVLNode = y.left;
    let T2: AVLNode = x.right;

    // Perform rotation
    x.right = y;
    y.left = T2;

    // Update heights
    if (height(y.left) > height(y.right)) {
        y.height = height(y.left) + 1;
    } else {
        y.height = height(y.right) + 1;
    }

    if (height(x.left) > height(x.right)) {
        x.height = height(x.left) + 1;
    } else {
        x.height = height(x.right) + 1;
    }

    // Return strc root
    return x;
}

function leftRotate(x: AVLNode): AVLNode {
    let y: AVLNode = x.right;
    let T2: AVLNode = y.left;

    // Perform rotation
    y.left = x;
    x.right = T2;

    //  Update heights
    if (height(x.left) > height(x.right)) {
        x.height = height(x.left) + 1;
    } else {
        x.height = height(x.right) + 1;
    }

    if (height(y.left) > height(y.right)) {
        y.height = height(y.left) + 1;
    } else {
        y.height = height(y.right) + 1;
    }
    // Return strc root
    return y;
}

// Get Balance factor of node N
function getBalance(N: AVLNode): number {
    if (N == null) {
        return 0;
    }
    return height(N.left) - height(N.right);
}

function preOrder(root: AVLNode): void {
    if (root != null) {
        preOrder(root.left);
        console.log(root.value);
        preOrder(root.right);
    }
}

function getDot(root: AVLNode): string {
    if (root != null) {
        let ret = root.value + "\n";
        let tmp = getDot(root.left);
        if (tmp != null) {
            ret = ret + root.value + "->" + tmp;
        }
        tmp = getDot(root.right);
        if (tmp != null) {
            ret = ret + root.value + "->" + tmp;
        }
        return ret;
    }
    return null;
} 

let tree : AVLTree = {
    root: null
};

tree.root = insert(tree.root, 19);
tree.root = insert(tree.root, 29);
tree.root = insert(tree.root, 99);
tree.root = insert(tree.root, 9);
tree.root = insert(tree.root, 2);
tree.root = insert(tree.root, 32);
tree.root = insert(tree.root, 4);
tree.root = insert(tree.root, 0);
//tree.root = insert(tree.root, 1);
preOrder(tree.root);


/*
menu();

function fibonacci(n: number): number {
    if (n <= 1) {
        return n;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function hanoi(discos: number, origen: number, auxiliar: number, destino: number): void {
    if (discos == 1) {
        console.log("Mover disco de "+ origen+ " a " + destino);
    } else {
        hanoi(discos - 1, origen, destino, auxiliar);
        console.log("Mover disco de "+ origen+ " a " + destino);
        hanoi(discos - 1, auxiliar, origen, destino);
    }
}

function ackermann(m: number, n: number): number {
    if (m == 0) {
        return (n + 1);
    } else if (m > 0 && n == 0) {
        return ackermann(m - 1, 1);
    } else {
        return ackermann(m - 1, ackermann(m, n - 1));
    }
}

function par(nump: number): number {
    return nump == 0 ? 1 : impar(nump - 1);
}

function impar(numi: number): number {
    return numi == 0 ? 0 : par(numi - 1);
}

function hofstaderMasculino(n: number): number {
    if (n < 0) {
        return 0;
    } else {
        if (n != 0) {
            return n - hofstaderMasculino(n - 1);
        } else {
            return 0;
        }
    }
}

function factorial(n: number): number {
    switch (n) {
        case 0:
            return 1;
        default:
            return n * factorial(n - 1);
    }
}

function potencia(base: number, exp: number): number {
    switch (exp) {
        case 0:
            return 1;
        default:
            return base * potencia(base, exp - 1);
    }
}

function modulo(n : number, p : number) : number{
    return n < p ? n : modulo(n - p, p);
}

function mcd(a : number, b : number) : number{
    return b == 0 ? a : mcd(b, modulo(a, b));
}

function multiplicacion(a : number, b : number) : number{
    if(b == 0){
        return 0;
    }
    return a + multiplicacion(a, b - 1);
}



function menu() {
    console.log(fibonacci(13));  // 233
    hanoi(3, 1, 2, 3);
    console.log(ackermann(3, 6)); //509
    console.log(par(13)); //0
    console.log(par(20)); //1
    console.log(hofstaderMasculino(824)); //412
    console.log(factorial(10)); //362880 
    console.log(potencia(5, 4)); //625
    console.log(mcd(240,506)); ///2
    console.log(multiplicacion(11,23)); //253
}

*/
/*
function concat(){

    for(let i = 0; i < 5; i++){
        let txt = '';
        for(let j = 0; j < 15; j++){
            txt = txt + i;
        }
        console.log(txt);
    }
}

concat();*/

/*
let matrixA : number [][] = [];
let matrixB : number [][] = [];
let matrixR : number [][] = [];
const min = 0;
const max = 4;

function llenado(matrix1 : number[][], matrix2 : number[][], matrix3 : number[][]) : void{
    for(let i = min; i < max; i++){
        matrix1[i] = [];
        matrix2[i] = [];
        matrix3[i] = [];
        for(let j = min; j < max; j++){
            matrix1[i][j] = j * 3 + i;
            matrix2[i][j] = i ** 3 - j ** 2;
            matrix3[i][j] = 0;
        }
    }
}

function print(matrix : number[][]) : void{
    for(let i = 0; i < matrix.length; i++){
        let salida = '';
        for(let j = 0; j < matrix[i].length; j++){
            salida = salida + "\t|\t" + matrix[i][j];
        }
        console.log(salida);
    }
}

function suma(matrix1 : number[][], matrix2 : number[][], matrixR : number[][]): void{
    for(let i = min; i < max; i++){
        for(let j = min; j < max; j++){
            matrixR[i][j] = matrix1[i][j] + matrix2[i][j];
        }
    }
}

function sumarFilas(matrix : number[][]) : void{
    let contador = 0;
    console.log("\t\t\t\t\t\t\t\t\t\tR");
    for(let i = 0; i < matrix.length; i++){
        contador = 0;
        let salida = '';
        for(let j = 0; j < matrix[i].length; j++){
            contador = contador + matrix[i][j];
			salida = salida + "\t|\t" + matrix[i][j];
        }
        console.log(salida+ "\t|\t" +contador);
    }
}

function sumarColumnas(matrix : number[][]) : void{
    let contador = 0;
    let salida = 'R';
    for(let i = 0; i < matrix.length; i++){
        contador = 0;
        for(let j = 0; j < matrix[i].length; j++){
            contador = contador + matrix[j][i];
        }
        salida = salida + "\t|\t" +  contador;
    }
    console.log(salida);
}


function resta(matrix1 : number[][], matrix2 : number[][], matrixR : number[][]): void{
    for(let i = min; i < max; i++){
        for(let j = min; j < max; j++){
            matrixR[i][j] = matrix1[i][j] - matrix2[i][j];
        }
    }
}


function multiplicar(matrix1 : number[][], matrix2 : number[][], matrixR : number[][]): void{
    for(let i = min; i < max; i++){
        for(let j = min; j < max; j++){
            for(let k = min; k < max; k++){
                matrixR[i][j] = matrixR[i][j] + matrix1[i][k] * matrix2[k][j];
            }
        }
    }
}

function transpuesta(matrix1: number[][]): void{
    const matrixAux : number[][] = [];
    for(let i = 0; i < max; i++){
        matrixAux[i] = [];
        for(let j = 0; j < max; j++){
            matrixAux[i][j] = matrix1[j][i];
        }
    }
    for(let i = 0; i < max; i++){
        for(let j = 0; j < max; j++){
            matrix1[i][j] = matrixAux[i][j];
        }
    }
}

function minValue(matrix1 : number[][]) : void{   

    let iAux = 0;
    let jAux = 0;
    let temp = matrix1[min][min];
    for(let i = 0; i < matrix1.length; i++){
        for(let j = 0; j < matrix1[i].length; j++){
            if(matrix1[i][j] < temp){
                temp = matrix1[i][j];
                iAux = i;
                jAux = j;
            }
        }
    }
    console.log("Min -> ["+iAux+","+jAux+"] = "+temp);
    //return temp;
}

function maxValue(matrix1 : number[][]) : void{   
    let iAux = 0;
    let jAux = 0;
    let temp = matrix1[min][min];
    for(let i = 0; i < matrix1.length; i++){
        for(let j = 0; j < matrix1[i].length; j++){
            if(matrix1[i][j] > temp){
                temp = matrix1[i][j];
                iAux = i;
                jAux = j;
            }
        }
    }
    console.log("Min -> ["+iAux+","+jAux+"] = "+temp);
    //return temp;
}

function ordenar(matrix1 : number[][]): void{
    let aux = 0;
    for(let i = 0; i < matrix1.length; i++){
        for(let j = 0; j < matrix1[i].length; j++){
            for(let k = 0; k <= i; k++){
                for(let l = 0; l <= j; l++){
                    if(matrix1[i][j] < matrix1[k][l]){
                        aux = matrix1[i][j];
                        matrix1[i][j] = matrix1[k][l];
                        matrix1[k][l] = aux;
                    }
                }
            }
        }
    }
}

function clearMat(matrix : number[][]): void{
    for(let i = 0; i < matrix.length; i++){
        for(let j = 0; j < matrix[i].length; j++){
            matrix[i][j] = 0;
        }
    }
}


llenado(matrixA,matrixB, matrixR);
console.log("Matrix A");
print(matrixA);
console.log("Matrix B");
print(matrixB);

console.log("MatR = MatA + MatB");
suma(matrixA,matrixB,matrixR);
print(matrixR);

console.log("MatR = MatA - MatB");
resta(matrixA,matrixB,matrixR);
print(matrixR);

console.log("Clear MatR");
clearMat(matrixR);
print(matrixR);

console.log("MatR = MatA * MatB");
multiplicar(matrixA,matrixB,matrixR);
print(matrixR);


console.log("Tranpose(MatA)");
transpuesta(matrixA);
print(matrixA);


minValue(matrixR);
maxValue(matrixR);

console.log("Sort MatR");
ordenar(matrixR);
print(matrixR);

minValue(matrixR);
maxValue(matrixR);

console.log("Suma Filas y Columnas");
sumarFilas(matrixA);
sumarColumnas(matrixA);
*/

/*
console.log("MatR = MatA + MatB");
suma(matrixA,matrixB,matrixR);
console.log(matrixR);

console.log("MatR = MatA - MatB");
resta(matrixA,matrixB,matrixR);
console.log(matrixR);

console.log("Clear MatR");
clearMat(matrixR);
console.log(matrixR);

console.log("MatR = MatA * MatB");
multiplicar(matrixA,matrixB,matrixR);
console.log(matrixR);

console.log("Tranpose(MatA)");
transpuesta(matrixA);
console.log(matrixA);

minValue(matrixR);
maxValue(matrixR);

console.log("Sort MatR");
ordenar(matrixR);
console.log(matrixR);

minValue(matrixR);
maxValue(matrixR);

console.log("Suma Filas y Columnas");
sumarFilas(matrixA);
sumarColumnas(matrixA);
*/
/*
let matrixA : number [][] = [];
let matrixB : number [][] = [];
let matrixR : number [][] = [];
const min = 0;
const max = 4;

function llenado(matrix1 : number[][], matrix2 : number[][], matrix3 : number[][]) : void{
    for(let i = min; i < max; i++){
        matrix1[i] = [];
        matrix2[i] = [];
        matrix3[i] = [];
        for(let j = min; j < max; j++){
            matrix1[i][j] = j * 3 + i;
            matrix2[i][j] = i ** 3 - j ** 2;
            matrix3[i][j] = 0;
        }
    }
}

function print(matrix : number[][]) : void{
    for(let i = 0; i < matrix.length; i++){
        let salida = " ";
        for(let j = 0; j < matrix[i].length; j++){
            salida =  salida + "     |   " + matrix[i][j];
        }
      //  console.log(salida);
    }
}
llenado(matrixA,matrixB, matrixR);
console.log("Matrix A");
console.log(matrixA);
console.log(matrixB);
console.log(matrixR);
*/

//a[0][0][0] = 5;
//console.log(a[0][0][0]);
//let a : number[][][] = [[[]]];
//a[0] = [];
//a[0][0][0] = 10;
//console.log(a[0][0][0]);
//graficar_ts()
//a[0][0] = [];
//console.log(a);
//a[0][0][0] = 5;
//console.log(a[0][0][0]);
/*
type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};

let tree : AVLTree = {
    root: null
};

let node1 : AVLNode = {
    left : null,
    right : null,
    height : 0,
    value : 19
};

let node3 : AVLNode = {
    left : node1,
    right : null,
    height : 0,
    value : 19
};

if(5 < node1.left.value){
    console.log(1);
}else{
    console.log(2);
}

console.log(node1.left.value);*/

/*

let piola: number[] = [];
piola[0] = 1;
console.log(piola);
*/
/*
tree.root = insert(tree.root, 99);
tree.root = insert(tree.root, 9);
tree.root = insert(tree.root, 2);
tree.root = insert(tree.root, 32);
tree.root = insert(tree.root, 4);
tree.root = insert(tree.root, 0);
tree.root = insert(tree.root, 1);
*/

//preOrder(tree.root);


/*

type AVLNode = {
    left: AVLNode,
    right: AVLNode,
    height: number,
    value: number
};

type AVLTree = {
    root: AVLNode
};


function insert(node: AVLNode, value: number) :AVLNode {
    if (node == null) {
        node = {
            left: null,
            right: null,
            height: 0,
            value: value
        };
        return node;
    }

    if (value < node.value) {
        node.left = insert(node.left, value);
    } else {
        node.right = insert(node.right, value);
    }

    return node;
}


let tree : AVLTree = {
    root: null
};

tree.root = insert(tree.root, 19);
console.log(tree.root);
tree.root = insert(tree.root, 20);
console.log(tree.root);*/
//tree.root = insert(tree.root, 19); //validar que root pueda ser null


/*
function pana(var1 : piola4,  p : number){
    if(var1 == null){
        var1 = {
            valor1 : null,
            valor2 : 5
        };    
   }
}

pana(null, 5);*/
//console.log(p5);

/*type piola4 = {
    valor1 : piola4,
    valor2 : number
};

let p4 : piola4 = {
    valor1 : null,
    valor2 : 5
};

function pana(var1 : piola4){
    if(var1 == null){
        console.log("piola");        
    }
}

pana(null);*/
/*
type piola4 = {
    valor1 : piola4,
    valor2 : number
}

let p4 : piola4 = {
    valor1 : null,
    valor2 : 5
}
*/

//let p : number[] = [];
//p = [5];
//p[0] = 1;
//console.log(p);
//console.log(p4.valor2);

/*type piola4 = {
    valor1 : number,
    valor2 : number
}

let p4 : piola4 = {
    valor1 : 0,
    valor2 : 1
}

let str = "hola" ;
str += p4.valor1;
console.log(str);

let ter = 5;
ter--
console.log(ter);

let i  = 0;
for( let  i = 0; i < 5; i++){
    console.log(i);
}

*/

/*type piola4 = {
    valor1 : number,
    valor2 : number
}
type piola5 = {
    valor1 : number,
    valor2 : piola4
}*/
/*
type piola5 = {
    valor1 : number,
    valor2 : piola4
}

type piola6 = {
    valor1 : number,
    valor2 : piola4
}
*/
/*
let p4 : piola4 = {
    valor1 : 0,
    valor2 : 1
}

let p5 : piola5 = {
    valor1 : 15,
    valor2 : p4
}

function fun(t : piola4){
    console.log(t.valor1);
}
*/
//fun(p5.valor2);
/*
let p5 : piola5 = {
    valor1 : 15,
    valor2 : p4
}

let p6 : piola4 = {
    valor1 : 5,
    valor2 : 10
}

p6 = p5;
*/
//console.log(p6.valor2);
/*
let tp4 : piola4 = {
    valor1 : 5,
    valor2 : 10
}

let arrp  = [[tp4]];


type piola = {
    valor1 : number,
    valor2 : []
}

type piola2 = {
    valor1 : number,
    valor2 : piola
}

type piola3 = {
    valor1 : piola2,
    valor2 : number
}

let tp2 : piola4 = {
    valor1 : 5,
    valor2 : 10
}

let tp : piola4 = {
    valor1 : 5,
    valor2 : 10
}

console.log(piola3.valor1.valor2.valor2[0][0].valor2);


let piola5 = [1,2,3];

function print() : string{
    for(let i = 0; i < piola5.length; i = i+1){
        console.log(piola5[i]);
        if(piola5[i] == 2){
            return "ando piola";
        }
    }
    return "";
}

console.log(print());*/