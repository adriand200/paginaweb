
import { guardarEntrada, obtenerEntrada } from "./diario.js";

import {
    mostrarResultado,
    mostrarHistorial,
    mostrarMensaje
} from "./Interfaxusuaria.js";

import { analizarTexto } from "./analisis.js";

const entrada = document.getElementById("entradaDiario");
const boton = document.getElementById("guardarboton");

const entradasGuardadas = obtenerEntrada();

mostrarHistorial(entradasGuardadas);

boton.addEventListener("click", async function() {

    const texto = entrada.value.trim();

    if (texto === "") {
        mostrarMensaje("Escribe algo antes de guardar tu entrada.", "warning");
        entrada.focus();
        return;
    }

    boton.disabled = true;
    boton.textContent = "Analizando...";

    try {

        const respuesta = await fetch('/api/entradas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                texto: texto
            })
        });

        if (!respuesta.ok) {
            throw new Error("Error al enviar la entrada al servidor");
        }

        const datos = await respuesta.json();

        console.log("Respuesta del servidor:", datos);

        guardarEntrada(texto);

        const entradasGuardadas = obtenerEntrada();

        mostrarHistorial(entradasGuardadas);

        mostrarMensaje("Entrada guardada correctamente.", "success");

        mostrarResultado("Analizando tus pensamientos...");

        const resultado = await analizarTexto(texto);

        mostrarResultado(resultado);

        entrada.value = "";

    } catch (error) {

        mostrarResultado("No fue posible completar el análisis.");
        mostrarMensaje("Ocurrió un error al procesar tu entrada.", "danger");

        console.log(error);

    } finally {

        boton.disabled = false;
        boton.textContent = "Guardar y analizar";

    }

});
