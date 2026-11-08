import { analizarConGemini } from "./api.js";

export async function analizarTexto(texto) {

    const resultado = await analizarConGemini(texto);

    return resultado;
    
}