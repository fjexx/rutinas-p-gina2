const express = require('express');
const router = express.Router();
const { protegerRuta } = require('../middleware/auth');
const Progress = require('../models/Progress');

// @route   GET /api/progress/semanal
// @desc    Obtener progreso semanal del usuario
// @access  Private
router.get('/semanal', protegerRuta, async (req, res) => {
    try {
        const progreso = await Progress.findOne({ usuario: req.usuario._id });
        
        // Obtener nivel del usuario
        const nivelUsuario = req.usuario.nivelActividad || 'principiante';
        
        // Objetivos personalizados según nivel
        const objetivosPorNivel = {
            principiante: {
                rutinasSemanales: 3,
                minutosSemanales: 90,
                caloriasSemanales: 600
            },
            intermedio: {
                rutinasSemanales: 4,
                minutosSemanales: 150,
                caloriasSemanales: 1000
            },
            avanzado: {
                rutinasSemanales: 5,
                minutosSemanales: 210,
                caloriasSemanales: 1400
            }
        };
        
        const objetivos = objetivosPorNivel[nivelUsuario] || objetivosPorNivel.principiante;
        
        if (!progreso) {
            // Crear progreso inicial si no existe
            const nuevoProgreso = await Progress.create({
                usuario: req.usuario._id,
                objetivos: {
                    rutinasSemanales: objetivos.rutinasSemanales,
                    minutosSemanales: objetivos.minutosSemanales
                }
            });
            
            return res.json({
                success: true,
                progresoSemanal: {
                    rutinasCompletadas: 0,
                    minutosEntrenados: 0
                },
                porcentajes: {
                    progresoGeneral: 0
                },
                objetivos,
                nivel: nivelUsuario,
                rutinasDetalle: []
            });
        }

        // Calcular progreso semanal
        const ahora = new Date();
        const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()));
        inicioSemana.setHours(0, 0, 0, 0);

        const rutinasEstaSemana = progreso.rutinasCompletadas.filter(rutina => 
            rutina.fecha >= inicioSemana
        );

        const minutosEstaSemana = rutinasEstaSemana.reduce((total, rutina) => 
            total + (rutina.tiempoTotal || 0), 0
        );

        const porcentajeRutinas = (rutinasEstaSemana.length / objetivos.rutinasSemanales) * 100;
        const porcentajeMinutos = (minutosEstaSemana / objetivos.minutosSemanales) * 100;
        const progresoGeneral = Math.min(100, (porcentajeRutinas + porcentajeMinutos) / 2);

        res.json({
            success: true,
            progresoSemanal: {
                rutinasCompletadas: rutinasEstaSemana.length,
                minutosEntrenados: minutosEstaSemana
            },
            porcentajes: {
                progresoGeneral: Math.round(progresoGeneral)
            },
            objetivos,
            nivel: nivelUsuario,
            rutinasDetalle: rutinasEstaSemana.map(rutina => ({
                rutinaId: rutina.rutinaId || '',
                nivel: rutina.nivel || '',
                nombreRutina: rutina.nombreRutina || '',
                fecha: rutina.fecha || new Date(),
                tiempoTotal: rutina.tiempoTotal || 0
            }))
        });

    } catch (error) {
        console.error('Error al obtener progreso semanal:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener progreso semanal'
        });
    }
});

// @route   GET /api/progress/estadisticas
// @desc    Obtener estadísticas generales del usuario
// @access  Private
router.get('/estadisticas', protegerRuta, async (req, res) => {
    try {
        const progreso = await Progress.findOne({ usuario: req.usuario._id });
        
        if (!progreso) {
            return res.json({
                success: true,
                estadisticas: {
                    rachaActual: 0,
                    totalRutinas: 0,
                    totalMinutos: 0,
                    caloriasQuemadas: 0
                }
            });
        }

        // Calcular racha actual
        let rachaActual = 0;
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);

        // Verificar días consecutivos hacia atrás
        for (let i = 0; i < 30; i++) {
            const fecha = new Date(hoy);
            fecha.setDate(fecha.getDate() - i);
            
            const tieneRutina = progreso.rutinasCompletadas.some(rutina => {
                const fechaRutina = new Date(rutina.fecha);
                fechaRutina.setHours(0, 0, 0, 0);
                return fechaRutina.getTime() === fecha.getTime();
            });

            if (tieneRutina) {
                rachaActual++;
            } else if (i > 0) {
                break; // Si no hay rutina y no es hoy, romper la racha
            }
        }

        const totalMinutos = progreso.rutinasCompletadas.reduce((total, rutina) => 
            total + (rutina.tiempoTotal || 0), 0
        );

        const caloriasQuemadas = progreso.rutinasCompletadas.reduce((total, rutina) => 
            total + (rutina.calorias || 0), 0
        );

        res.json({
            success: true,
            estadisticas: {
                rachaActual,
                totalRutinas: progreso.rutinasCompletadas.length,
                totalMinutos,
                caloriasQuemadas
            }
        });

    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({
            success: false,
            message: 'Error al obtener estadísticas'
        });
    }
});

// @route   POST /api/progress/rutina
// @desc    Registrar rutina completada
// @access  Private
router.post('/rutina', protegerRuta, async (req, res) => {
    try {
        const { rutinaId, nombreRutina, nivel, tiempoTotal, calorias, ejercicios } = req.body;

        // Tiempos y calorías por nivel
        const datosPorNivel = {
            principiante: { tiempo: 30, calorias: 200 },
            intermedio: { tiempo: 45, calorias: 350 },
            avanzado: { tiempo: 60, calorias: 500 }
        };
        
        const datos = datosPorNivel[nivel] || datosPorNivel.principiante;

        let progreso = await Progress.findOne({ usuario: req.usuario._id });
        
        if (!progreso) {
            progreso = await Progress.create({
                usuario: req.usuario._id
            });
        }

        // Agregar rutina completada
        progreso.rutinasCompletadas.push({
            rutinaId,
            nombreRutina,
            nivel,
            tiempoTotal: tiempoTotal || datos.tiempo,
            calorias: calorias || datos.calorias,
            ejercicios: ejercicios || [],
            fecha: new Date()
        });

        await progreso.save();

        res.json({
            success: true,
            message: 'Rutina registrada exitosamente',
            progreso: {
                totalRutinas: progreso.rutinasCompletadas.length,
                tiempoTotal: datos.tiempo,
                caloriasQuemadas: datos.calorias
            }
        });

    } catch (error) {
        console.error('Error al registrar rutina:', error);
        res.status(500).json({
            success: false,
            message: 'Error al registrar rutina'
        });
    }
});

// @route   DELETE /api/progress/rutina/:rutinaId
// @desc    Eliminar rutina del progreso (última del día de hoy)
// @access  Private
router.delete('/rutina/:rutinaId', protegerRuta, async (req, res) => {
    try {
        const progreso = await Progress.findOne({ usuario: req.usuario._id });
        
        if (!progreso) {
            return res.status(404).json({
                success: false,
                message: 'Progreso no encontrado'
            });
        }

        // Obtener fecha de hoy
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);

        // Filtrar: eliminar la última rutina de hoy con este rutinaId
        const rutinasHoy = progreso.rutinasCompletadas.filter(rutina => {
            const fechaRutina = new Date(rutina.fecha);
            return rutina.rutinaId === req.params.rutinaId && 
                   fechaRutina >= hoy && 
                   fechaRutina < manana;
        });

        if (rutinasHoy.length > 0) {
            // Eliminar la última (más reciente)
            const ultimaRutina = rutinasHoy[rutinasHoy.length - 1];
            progreso.rutinasCompletadas = progreso.rutinasCompletadas.filter(
                rutina => rutina._id.toString() !== ultimaRutina._id.toString()
            );
        }

        await progreso.save();

        res.json({
            success: true,
            message: 'Rutina eliminada del progreso'
        });

    } catch (error) {
        console.error('Error al eliminar rutina:', error);
        res.status(500).json({
            success: false,
            message: 'Error al eliminar rutina'
        });
    }
});

// @route   POST /api/progress/reiniciar-semanal
// @desc    Reiniciar progreso semanal (eliminar rutinas de esta semana)
// @access  Private
router.post('/reiniciar-semanal', protegerRuta, async (req, res) => {
    try {
        const progreso = await Progress.findOne({ usuario: req.usuario._id });
        
        if (!progreso) {
            return res.status(404).json({
                success: false,
                message: 'Progreso no encontrado'
            });
        }

        // Calcular inicio de semana
        const ahora = new Date();
        const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()));
        inicioSemana.setHours(0, 0, 0, 0);

        // Filtrar rutinas para mantener solo las anteriores a esta semana
        progreso.rutinasCompletadas = progreso.rutinasCompletadas.filter(
            rutina => rutina.fecha < inicioSemana
        );

        await progreso.save();

        res.json({
            success: true,
            message: 'Progreso semanal reiniciado correctamente'
        });

    } catch (error) {
        console.error('Error al reiniciar progreso:', error);
        res.status(500).json({
            success: false,
            message: 'Error al reiniciar progreso'
        });
    }
});

// @route   POST /api/progress/reiniciar-todo
// @desc    Reiniciar todo el progreso (eliminar todas las rutinas)
// @access  Private
router.post('/reiniciar-todo', protegerRuta, async (req, res) => {
    try {
        const progreso = await Progress.findOne({ usuario: req.usuario._id });
        
        if (!progreso) {
            return res.status(404).json({
                success: false,
                message: 'Progreso no encontrado'
            });
        }

        // Eliminar todas las rutinas
        progreso.rutinasCompletadas = [];
        progreso.estadisticas = {
            totalRutinas: 0,
            totalEjercicios: 0,
            tiempoTotalEntrenamiento: 0,
            caloriasQuemadas: 0,
            rachaActual: 0,
            mejorRacha: 0
        };

        await progreso.save();

        res.json({
            success: true,
            message: 'Todo el progreso ha sido reiniciado'
        });

    } catch (error) {
        console.error('Error al reiniciar progreso:', error);
        res.status(500).json({
            success: false,
            message: 'Error al reiniciar progreso'
        });
    }
});

module.exports = router;