
const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent";

exports.handler = async (event) => {
    const metodo = event.httpMethod;
    const ruta = event.path;

    const responder = (statusCode, datos) => ({
        statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(datos)
    });

    try {
        if (metodo === "GET" && ruta.endsWith("/estado")) {
            return responder(200, {
                mensaje: "API del diario funcionando correctamente"
            });
        }

        const cuerpo = event.body ? JSON.parse(event.body) : {};

        if (metodo === "POST" && ruta.endsWith("/entradas")) {
            return responder(200, {
                mensaje: "Entrada recibida correctamente",
                datos: cuerpo
            });
        }

        if (metodo === "POST" && ruta.endsWith("/analizar")) {
            const texto = cuerpo.texto;

            if (!texto || texto.trim() === "") {
                return responder(400, {
                    mensaje: "Debes enviar un texto para analizar."
                });
            }

            const API_KEY = process.env.GEMINI_API_KEY;

            if (!API_KEY) {
                return responder(500, {
                    mensaje: "No se encontró la API Key de Gemini."
                });
            }

            const respuesta = await fetch(URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "x-goog-api-key": API_KEY
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: `Analiza el sentimiento del siguiente texto de un diario personal.

Debes elegir SOLO UNA de estas 11 emociones:

1. Alegría
2. Tristeza
3. Ira
4. Miedo
5. Neutralidad
6. Amor
7. Ansiedad
8. Culpa
9. Sorpresa
10. Asco
11. Calma

Además, indica:
- La emoción detectada.
- Una explicación breve de por qué detectaste esa emoción.

Si el texto no expresa claramente ninguna emoción, selecciona Neutralidad.

Texto del diario:
${texto}`
                                }
                            ]
                        }
                    ]
                })
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                console.error("Error de Gemini:", respuesta.status);

                return responder(502, {
                    mensaje: "Error al comunicarse con Gemini."
                });
            }

            const resultado = datos.candidates?.[0]?.content?.parts?.[0]?.text;

            if (!resultado) {
                return responder(502, {
                    mensaje: "Gemini no devolvió un análisis válido."
                });
            }

            return responder(200, {
                resultado: resultado
            });
        }

        return responder(404, {
            mensaje: "Ruta no encontrada."
        });

    } catch (error) {
        console.error("Error:", error);

        return responder(500, {
            mensaje: "No fue posible procesar la solicitud."
        });
    }
};
