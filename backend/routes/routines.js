const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');

// Base de datos de rutinas (esto podría venir de MongoDB si se necesita)
const rutinasDB = {
    principiante: [
        {
            id: 'lunes-cardio',
            nombre: 'Lunes - Cardio Ligero',
            nivel: 'principiante',
            duracionEstimada: 20,
            caloriasEstimadas: 120,
            ejercicios: [
                {
                    id: 'caminata',
                    nombre: 'Caminata rápida',
                    duracion: 15,
                    descripcion: '15 minutos de caminata a ritmo moderado'
                },
                {
                    id: 'estiramientos-basicos',
                    nombre: 'Estiramientos básicos',
                    duracion: 5,
                    descripcion: 'Estiramientos de todo el cuerpo'
                }
            ]
        },
        {
            id: 'miercoles-fuerza',
            nombre: 'Miércoles - Fuerza Básica',
            nivel: 'principiante',
            duracionEstimada: 25,
            caloriasEstimadas: 150,
            ejercicios: [
                {
                    id: 'sentadillas',
                    nombre: 'Sentadillas',
                    series: 3,
                    repeticiones: 10,
                    descripcion: 'Sentadillas básicas con peso corporal'
                },
                {
                    id: 'flexiones-rodillas',
                    nombre: 'Flexiones de rodillas',
                    series: 3,
                    repeticiones: 8,
                    descripcion: 'Flexiones con apoyo de rodillas'
                },
                {
                    id: 'plancha',
                    nombre: 'Plancha',
                    series: 3,
                    duracion: 20,
                    descripcion: 'Mantener posición de plancha 20 segundos'
                }
            ]
        },
        {
            id: 'viernes-flex',
            nombre: 'Viernes - Flexibilidad',
            nivel: 'principiante',
            duracionEstimada: 20,
            caloriasEstimadas: 100,
            ejercicios: [
                {
                    id: 'yoga-basico',
                    nombre: 'Yoga básico',
                    duracion: 15,
                    descripcion: 'Posturas básicas de yoga'
                },
                {
                    id: 'estiramientos-profundos',
                    nombre: 'Estiramientos profundos',
                    duracion: 5,
                    descripcion: 'Estiramientos de flexibilidad'
                }
            ]
        }
    ],
    intermedio: [
        {
            id: 'lunes-superior',
            nombre: 'Lunes - Tren Superior',
            nivel: 'intermedio',
            duracionEstimada: 35,
            caloriasEstimadas: 250,
            ejercicios: [
                {
                    id: 'flexiones',
                    nombre: 'Flexiones',
                    series: 4,
                    repeticiones: 15,
                    descripcion: 'Flexiones completas'
                },
                {
                    id: 'fondos',
                    nombre: 'Fondos en silla',
                    series: 3,
                    repeticiones: 12,
                    descripcion: 'Fondos para tríceps'
                },
                {
                    id: 'plancha-lateral',
                    nombre: 'Plancha lateral',
                    series: 3,
                    duracion: 30,
                    descripcion: 'Plancha lateral cada lado'
                }
            ]
        },
        {
            id: 'miercoles-inferior',
            nombre: 'Miércoles - Tren Inferior',
            nivel: 'intermedio',
            duracionEstimada: 35,
            caloriasEstimadas: 280,
            ejercicios: [
                {
                    id: 'sentadillas-profundas',
                    nombre: 'Sentadillas profundas',
                    series: 4,
                    repeticiones: 15,
                    descripcion: 'Sentadillas completas'
                },
                {
                    id: 'zancadas',
                    nombre: 'Zancadas',
                    series: 3,
                    repeticiones: 12,
                    descripcion: 'Zancadas alternadas'
                },
                {
                    id: 'puente-gluteo',
                    nombre: 'Puente de glúteo',
                    series: 3,
                    repeticiones: 15,
                    descripcion: 'Elevación de cadera'
                }
            ]
        },
        {
            id: 'viernes-cardio-core',
            nombre: 'Viernes - Cardio y Core',
            nivel: 'intermedio',
            duracionEstimada: 30,
            caloriasEstimadas: 300,
            ejercicios: [
                {
                    id: 'hiit',
                    nombre: 'HIIT',
                    duracion: 15,
                    descripcion: 'Intervalos de alta intensidad'
                },
                {
                    id: 'abdominales',
                    nombre: 'Abdominales',
                    series: 3,
                    repeticiones: 20,
                    descripcion: 'Abdominales completos'
                },
                {
                    id: 'mountain-climbers',
                    nombre: 'Mountain climbers',
                    series: 3,
                    repeticiones: 20,
                    descripcion: 'Escaladores alternados'
                }
            ]
        }
    ],
    avanzado: [
        {
            id: 'lunes-push',
            nombre: 'Lunes - Push (Empuje)',
            nivel: 'avanzado',
            duracionEstimada: 45,
            caloriasEstimadas: 400,
            ejercicios: [
                {
                    id: 'flexiones-explosivas',
                    nombre: 'Flexiones explosivas',
                    series: 4,
                    repeticiones: 15,
                    descripcion: 'Flexiones con impulso'
                },
                {
                    id: 'fondos-avanzados',
                    nombre: 'Fondos avanzados',
                    series: 4,
                    repeticiones: 15,
                    descripcion: 'Fondos en paralelas'
                },
                {
                    id: 'hiit-intenso',
                    nombre: 'Cardio HIIT intenso',
                    duracion: 10,
                    descripcion: 'Intervalos de máxima intensidad'
                }
            ]
        },
        {
            id: 'miercoles-pull',
            nombre: 'Miércoles - Pull (Jalón)',
            nivel: 'avanzado',
            duracionEstimada: 45,
            caloriasEstimadas: 420,
            ejercicios: [
                {
                    id: 'dominadas',
                    nombre: 'Dominadas',
                    series: 4,
                    repeticiones: 10,
                    descripcion: 'Dominadas completas'
                },
                {
                    id: 'remo-invertido',
                    nombre: 'Remo invertido',
                    series: 4,
                    repeticiones: 12,
                    descripcion: 'Remo con barra baja'
                },
                {
                    id: 'superman',
                    nombre: 'Superman',
                    series: 3,
                    repeticiones: 15,
                    descripcion: 'Extensiones de espalda'
                }
            ]
        },
        {
            id: 'viernes-legs-core',
            nombre: 'Viernes - Legs y Core',
            nivel: 'avanzado',
            duracionEstimada: 50,
            caloriasEstimadas: 450,
            ejercicios: [
                {
                    id: 'sentadillas-salto',
                    nombre: 'Sentadillas con salto',
                    series: 4,
                    repeticiones: 15,
                    descripcion: 'Sentadillas pliométricas'
                },
                {
                    id: 'zancadas-explosivas',
                    nombre: 'Zancadas explosivas',
                    series: 4,
                    repeticiones: 12,
                    descripcion: 'Zancadas con salto'
                },
                {
                    id: 'core-intenso',
                    nombre: 'Core intenso',
                    duracion: 10,
                    descripcion: 'Circuito de abdominales'
                }
            ]
        },
        {
            id: 'sabado-fullbody',
            nombre: 'Sábado - Full Body',
            nivel: 'avanzado',
            duracionEstimada: 60,
            caloriasEstimadas: 500,
            ejercicios: [
                {
                    id: 'burpees',
                    nombre: 'Burpees',
                    series: 4,
                    repeticiones: 15,
                    descripcion: 'Burpees completos'
                },
                {
                    id: 'mountain-climbers-avanzado',
                    nombre: 'Mountain climbers avanzado',
                    series: 4,
                    repeticiones: 30,
                    descripcion: 'Escaladores rápidos'
                },
                {
                    id: 'circuito-completo',
                    nombre: 'Circuito completo',
                    duracion: 15,
                    descripcion: 'Circuito de cuerpo completo'
                }
            ]
        }
    ]
};

// @route   GET /api/routines
// @desc    Obtener todas las rutinas
// @access  Public
router.get('/', (req, res) => {
    try {
        res.status(200).json({
            success: true,
            rutinas: rutinasDB
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener rutinas'
        });
    }
});

// @route   GET /api/routines/:nivel
// @desc    Obtener rutinas por nivel
// @access  Public
router.get('/:nivel', (req, res) => {
    try {
        const { nivel } = req.params;
        
        if (!['principiante', 'intermedio', 'avanzado'].includes(nivel)) {
            return res.status(400).json({
                success: false,
                message: 'Nivel no válido'
            });
        }

        res.status(200).json({
            success: true,
            nivel,
            rutinas: rutinasDB[nivel]
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener rutinas'
        });
    }
});

// @route   GET /api/routines/:nivel/:id
// @desc    Obtener una rutina específica
// @access  Public
router.get('/:nivel/:id', (req, res) => {
    try {
        const { nivel, id } = req.params;
        
        if (!['principiante', 'intermedio', 'avanzado'].includes(nivel)) {
            return res.status(400).json({
                success: false,
                message: 'Nivel no válido'
            });
        }

        const rutina = rutinasDB[nivel].find(r => r.id === id);

        if (!rutina) {
            return res.status(404).json({
                success: false,
                message: 'Rutina no encontrada'
            });
        }

        res.status(200).json({
            success: true,
            rutina
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener rutina'
        });
    }
});

// @route   GET /api/routines/recomendada/:nivel
// @desc    Obtener rutina recomendada para el día de hoy
// @access  Private
router.get('/recomendada/:nivel', protegerRuta, async (req, res) => {
    try {
        const { nivel } = req.params;
        
        if (!['principiante', 'intermedio', 'avanzado'].includes(nivel)) {
            return res.status(400).json({
                success: false,
                message: 'Nivel no válido'
            });
        }

        // Obtener rutinas del nivel
        const rutinas = rutinasDB[nivel];
        
        // Seleccionar rutina basada en el día de la semana
        const diaSemana = new Date().getDay(); // 0 = Domingo, 1 = Lunes, etc.
        const indiceRutina = Math.min(diaSemana % rutinas.length, rutinas.length - 1);
        
        const rutinaRecomendada = rutinas[indiceRutina];

        res.status(200).json({
            success: true,
            rutinaRecomendada
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al obtener rutina recomendada'
        });
    }
});

module.exports = router;