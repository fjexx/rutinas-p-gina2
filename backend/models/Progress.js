const mongoose = require('mongoose');

const ejercicioSchema = new mongoose.Schema({
    ejercicioId: {
        type: String,
        required: true
    },
    nombreEjercicio: {
        type: String,
        required: true
    },
    completado: {
        type: Boolean,
        default: false
    },
    repeticiones: Number,
    series: Number,
    peso: Number,
    duracion: Number, // en minutos
    notas: String,
    fecha: {
        type: Date,
        default: Date.now
    }
});

const rutinaCompletadaSchema = new mongoose.Schema({
    rutinaId: {
        type: String,
        required: true
    },
    nombreRutina: {
        type: String,
        required: true
    },
    nivel: {
        type: String,
        enum: ['principiante', 'intermedio', 'avanzado'],
        required: true
    },
    tiempoTotal: {
        type: Number,
        default: 0 // en minutos
    },
    calorias: {
        type: Number,
        default: 0
    },
    ejercicios: [ejercicioSchema],
    completada: {
        type: Boolean,
        default: true
    },
    fecha: {
        type: Date,
        default: Date.now
    }
});

const progressSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    
    // Rutinas completadas
    rutinasCompletadas: [rutinaCompletadaSchema],
    
    // Objetivos semanales
    objetivos: {
        rutinasSemanales: {
            type: Number,
            default: 3
        },
        minutosSemanales: {
            type: Number,
            default: 150
        }
    },
    
    // Estadísticas generales
    estadisticas: {
        totalRutinas: {
            type: Number,
            default: 0
        },
        totalEjercicios: {
            type: Number,
            default: 0
        },
        tiempoTotalEntrenamiento: {
            type: Number,
            default: 0 // en minutos
        },
        caloriasQuemadas: {
            type: Number,
            default: 0
        },
        rachaActual: {
            type: Number,
            default: 0
        },
        mejorRacha: {
            type: Number,
            default: 0
        }
    },
    
    // Progreso semanal (últimas 4 semanas)
    progresoSemanal: [{
        semana: Date,
        rutinasCompletadas: Number,
        minutosEntrenados: Number,
        caloriasQuemadas: Number
    }],
    
    // Configuración de notificaciones
    notificaciones: {
        recordatoriosDiarios: {
            type: Boolean,
            default: true
        },
        horaRecordatorio: {
            type: String,
            default: '18:00'
        },
        motivacionales: {
            type: Boolean,
            default: true
        }
    }
}, {
    timestamps: true
});

// Método para registrar una rutina completada
progressSchema.methods.registrarRutina = function(datosRutina) {
    // Agregar rutina a la lista
    this.rutinasCompletadas.push(datosRutina);
    
    // Actualizar estadísticas
    this.estadisticas.totalRutinas += 1;
    this.estadisticas.totalEjercicios += datosRutina.ejercicios ? datosRutina.ejercicios.length : 0;
    this.estadisticas.tiempoTotalEntrenamiento += datosRutina.tiempoTotal || 0;
    this.estadisticas.caloriasQuemadas += datosRutina.calorias || 0;
    
    // Actualizar racha
    this.actualizarRacha();
    
    return this.save();
};

// Método para actualizar la racha actual
progressSchema.methods.actualizarRacha = function() {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    let rachaActual = 0;
    
    // Verificar días consecutivos hacia atrás
    for (let i = 0; i < 365; i++) {
        const fecha = new Date(hoy);
        fecha.setDate(fecha.getDate() - i);
        
        const tieneRutina = this.rutinasCompletadas.some(rutina => {
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
    
    this.estadisticas.rachaActual = rachaActual;
    
    // Actualizar mejor racha si es necesario
    if (rachaActual > this.estadisticas.mejorRacha) {
        this.estadisticas.mejorRacha = rachaActual;
    }
};

// Método para obtener progreso de la semana actual
progressSchema.methods.obtenerProgresoSemanaActual = function() {
    const ahora = new Date();
    const inicioSemana = new Date(ahora.setDate(ahora.getDate() - ahora.getDay()));
    inicioSemana.setHours(0, 0, 0, 0);
    
    const rutinasEstaSemana = this.rutinasCompletadas.filter(rutina => 
        rutina.fecha >= inicioSemana
    );
    
    const minutosEstaSemana = rutinasEstaSemana.reduce((total, rutina) => 
        total + (rutina.tiempoTotal || 0), 0
    );
    
    const caloriasEstaSemana = rutinasEstaSemana.reduce((total, rutina) => 
        total + (rutina.calorias || 0), 0
    );
    
    return {
        rutinasCompletadas: rutinasEstaSemana.length,
        minutosEntrenados: minutosEstaSemana,
        caloriasQuemadas: caloriasEstaSemana,
        rutinas: rutinasEstaSemana
    };
};

// Método para calcular porcentajes de progreso semanal
progressSchema.methods.calcularPorcentajeProgresoSemanal = function() {
    const progresoSemanal = this.obtenerProgresoSemanaActual();
    
    const porcentajeRutinas = Math.min(100, (progresoSemanal.rutinasCompletadas / this.objetivos.rutinasSemanales) * 100);
    const porcentajeMinutos = Math.min(100, (progresoSemanal.minutosEntrenados / this.objetivos.minutosSemanales) * 100);
    const progresoGeneral = (porcentajeRutinas + porcentajeMinutos) / 2;
    
    return {
        rutinas: Math.round(porcentajeRutinas),
        minutos: Math.round(porcentajeMinutos),
        general: Math.round(progresoGeneral)
    };
};

// Método para obtener estadísticas del último mes
progressSchema.methods.obtenerEstadisticasMensuales = function() {
    const hace30Dias = new Date();
    hace30Dias.setDate(hace30Dias.getDate() - 30);
    
    const rutinasUltimoMes = this.rutinasCompletadas.filter(rutina => 
        rutina.fecha >= hace30Dias
    );
    
    return {
        rutinasCompletadas: rutinasUltimoMes.length,
        minutosEntrenados: rutinasUltimoMes.reduce((total, rutina) => total + (rutina.tiempoTotal || 0), 0),
        caloriasQuemadas: rutinasUltimoMes.reduce((total, rutina) => total + (rutina.calorias || 0), 0),
        promedioSemanal: Math.round(rutinasUltimoMes.length / 4.3) // 4.3 semanas en un mes
    };
};

// Índices para mejorar rendimiento
progressSchema.index({ usuario: 1 });
progressSchema.index({ 'rutinasCompletadas.fecha': -1 });

const Progress = mongoose.model('Progress', progressSchema);

module.exports = Progress;