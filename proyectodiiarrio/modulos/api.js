
export async function analizarConGemini(texto) {

    const respuesta = await fetch('/api/analizar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            texto: texto
        })
    });

    if (!respuesta.ok) {
        throw new Error('Error al analizar el texto');
    }

    const datos = await respuesta.json();

    return datos.resultado;

}
