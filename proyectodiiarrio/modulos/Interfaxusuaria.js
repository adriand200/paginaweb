export function mostrarResultado(resultado) {

    const parafoanalisis = document.getElementById("resultadoAnalisis");

    parafoanalisis.textContent = resultado;

}

export function mostrarHistorial(entradas) {

    const historial = document.getElementById("historial");

    historial.textContent = "";

    if (entradas.length === 0) {

        const mensaje = document.createElement("p");

        mensaje.textContent = "Todavía no tienes pensamientos guardados.";

        mensaje.className = "text-center";

        historial.appendChild(mensaje);

        return;

    }

    entradas.forEach(function(entrada, indice) {

        const tarjeta = document.createElement("div");

        tarjeta.className = "card tarjeta-historial p-3 mb-3";

        const titulo = document.createElement("h5");

        titulo.textContent = `Pensamiento ${indice + 1}`;

        titulo.className = "card-title";

        const contenido = document.createElement("p");

        contenido.textContent = entrada;

        contenido.className = "card-text";

        tarjeta.appendChild(titulo);

        tarjeta.appendChild(contenido);

        historial.appendChild(tarjeta);

    });

}

export function mostrarMensaje(mensaje, tipo) {

    let mensajeEstado = document.getElementById("mensajeEstado");

    if (mensajeEstado === null) {

        mensajeEstado = document.createElement("div");

        mensajeEstado.id = "mensajeEstado";

        const boton = document.getElementById("guardarboton");

        boton.insertAdjacentElement("afterend", mensajeEstado);

    }

    mensajeEstado.className = `alert alert-${tipo} mt-3`;

    mensajeEstado.textContent = mensaje;

    mensajeEstado.setAttribute("role", "status");

}
