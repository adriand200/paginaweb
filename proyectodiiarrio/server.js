
require('dotenv').config();

const express = require('express');

const app = express();
const PORT = 3000;

const URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.7-flash:generateContent";

const API_KEY = process.env.GEMINI_API_KEY;

app.use(express.static(__dirname));
app.use(express.json());

app.get('/api/estado', (req, res) => {
    res.json({
        mensaje: 'API del diario funcionando correctamente'
    });
});

app.post('/api/entradas', (req, res) => {
    const entrada = req.body;

    res.json({
        mensaje: 'Entrada recibida correctamente',
        datos: entrada
    });
});

app.post('/api/analizar', async (req, res) => {

    try {

        const texto = req.body.texto;

        if (!texto || texto.trim() === '') {
            return res.status(400).json({
                mensaje: 'Debes enviar un texto para analizar.'
            });
        }

        if (!API_KEY) {
            return res.status(500).json({
                mensaje: 'No se encontró la API Key de Gemini.'
            });
        }

        console.log("API KEY cargada:", Boolean(API_KEY));
        console.log("Enviando solicitud a Gemini...");

        const respuesta = await fetch(URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': API_KEY
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

        console.log("Gemini respondió:", respuesta.status);

        const datos = await respuesta.json();

        console.log("Respuesta completa de Gemini:", datos);

        if (!respuesta.ok) {
            throw new Error('Error al comunicarse con Gemini');
        }

        const resultado = datos.candidates[0].content.parts[0].text;

        res.json({
            resultado: resultado
        });

    } catch (error) {

        console.log('Error:', error);

        res.status(500).json({
            mensaje: 'No fue posible analizar el texto.'
        });

    }

});

app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});
