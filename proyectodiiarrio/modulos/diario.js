export function guardarEntrada(texto) {

    let entradas = JSON.parse(localStorage.getItem("entrada")) || []; 

    entradas.push(texto);

    localStorage.setItem("entrada", JSON.stringify(entradas)); 

}

export function obtenerEntrada() {

    const entradas = JSON.parse(localStorage.getItem("entrada")) || [];

    return entradas;

}