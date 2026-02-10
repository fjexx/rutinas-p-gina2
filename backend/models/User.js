const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'El email es requerido'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Por favor ingrese un email válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerida'],
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        select: false // No devolver la contraseña por defecto en las consultas
    },
    nivelActividad: {
        type: String,
        enum: ['principiante', 'intermedio', 'avanzado'],
        default: 'principiante'
    },
    // Datos adicionales del perfil
    edad: {
        type: Number,
        min: [13, 'Edad mínima 13 años'],
        max: [100, 'Edad máxima 100 años']
    },
    genero: {
        type: String,
        enum: ['masculino', 'femenino', 'otro', 'prefiero_no_decir'],
        default: 'prefiero_no_decir'
    },
    peso: {
        type: Number,
        min: [30, 'Peso mínimo 30 kg'],
        max: [300, 'Peso máximo 300 kg']
    },
    pesoObjetivo: {
        type: Number,
        min: [30, 'Peso objetivo mínimo 30 kg'],
        max: [300, 'Peso objetivo máximo 300 kg']
    },
    altura: {
        type: Number,
        min: [100, 'Altura mínima 100 cm'],
        max: [250, 'Altura máxima 250 cm']
    },
    objetivo: {
        type: String,
        enum: ['perder_peso', 'ganar_musculo', 'mantener_peso', 'mejorar_resistencia', 'aumentar_flexibilidad', 'salud_general'],
        default: 'salud_general'
    },
    nivelExperiencia: {
        type: String,
        enum: ['nunca', 'ocasional', 'regular', 'avanzado'],
        default: 'nunca'
    },
    diasDisponibles: {
        type: Number,
        min: 1,
        max: 7,
        default: 3
    },
    tiempoDisponible: {
        type: Number, // minutos por sesión
        min: 15,
        max: 180,
        default: 30
    },
    // Datos del cuestionario inicial
    cuestionarioCompletado: {
        type: Boolean,
        default: false
    },
    puntuacionCuestionario: {
        type: Number,
        min: 8,
        max: 32
    },
    fechaRegistro: {
        type: Date,
        default: Date.now
    },
    ultimoAcceso: {
        type: Date,
        default: Date.now
    },
    activo: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Hash de la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    // Solo hashear si la contraseña fue modificada
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
userSchema.methods.compararPassword = async function(passwordIngresada) {
    return await bcrypt.compare(passwordIngresada, this.password);
};

// Método para actualizar último acceso
userSchema.methods.actualizarUltimoAcceso = function() {
    this.ultimoAcceso = Date.now();
    return this.save();
};

// Método para calcular calorías recomendadas (fórmula Harris-Benedict)
userSchema.methods.calcularCaloriasRecomendadas = function() {
    if (!this.peso || !this.altura || !this.edad || !this.genero) return null;
    
    let tmb; // Tasa Metabólica Basal
    
    if (this.genero === 'masculino') {
        tmb = 88.362 + (13.397 * this.peso) + (4.799 * this.altura) - (5.677 * this.edad);
    } else if (this.genero === 'femenino') {
        tmb = 447.593 + (9.247 * this.peso) + (3.098 * this.altura) - (4.330 * this.edad);
    } else {
        // Promedio para otros géneros
        const tmbM = 88.362 + (13.397 * this.peso) + (4.799 * this.altura) - (5.677 * this.edad);
        const tmbF = 447.593 + (9.247 * this.peso) + (3.098 * this.altura) - (4.330 * this.edad);
        tmb = (tmbM + tmbF) / 2;
    }
    
    // Factor de actividad según nivel
    let factorActividad = 1.2; // Sedentario
    if (this.nivelActividad === 'principiante') factorActividad = 1.375;
    if (this.nivelActividad === 'intermedio') factorActividad = 1.55;
    if (this.nivelActividad === 'avanzado') factorActividad = 1.725;
    
    const caloriasDiarias = Math.round(tmb * factorActividad);
    
    // Ajustar según objetivo
    if (this.objetivo === 'perder_peso') return caloriasDiarias - 500;
    if (this.objetivo === 'ganar_musculo') return caloriasDiarias + 300;
    return caloriasDiarias;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
