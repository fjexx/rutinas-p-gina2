const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protegerRuta } = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Registrar usuario
// @access  Public
router.post('/register', async (req, res) => {
    try {
        console.log('📝 Register attempt:', { email: req.body.email, nombre: req.body.nombre });
        
        const { 
            nombre, 
            email, 
            password, 
            edad, 
            genero,
            peso, 
            altura, 
            pesoObjetivo,
            objetivo,
            nivelActividad,
            diasDisponibles,
            tiempoDisponible
        } = req.body;

        // Verificar si el usuario ya existe
        let usuario = await User.findOne({ email });
        if (usuario) {
            console.log('❌ Usuario ya existe:', email);
            return res.status(400).json({
                success: false,
                message: 'El usuario ya existe'
            });
        }

        console.log('✅ Creando nuevo usuario:', email);

        // Crear nuevo usuario
        usuario = new User({
            nombre,
            email,
            password,
            edad,
            genero,
            peso,
            altura,
            pesoObjetivo,
            objetivo,
            nivelActividad,
            diasDisponibles,
            tiempoDisponible
        });

        await usuario.save();
        console.log('✅ Usuario guardado en DB:', email);

        // Crear JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    console.error('❌ Error al crear JWT:', err);
                    throw err;
                }
                console.log('✅ Registro exitoso para:', email);
                res.status(201).json({
                    success: true,
                    token,
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        edad: usuario.edad,
                        genero: usuario.genero,
                        peso: usuario.peso,
                        altura: usuario.altura,
                        pesoObjetivo: usuario.pesoObjetivo,
                        objetivo: usuario.objetivo,
                        nivelActividad: usuario.nivelActividad,
                        diasDisponibles: usuario.diasDisponibles,
                        tiempoDisponible: usuario.tiempoDisponible,
                        cuestionarioCompletado: usuario.cuestionarioCompletado,
                        puntuacionCuestionario: usuario.puntuacionCuestionario
                    }
                });
            }
        );
    } catch (error) {
        console.error('❌ Error en register:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

// @route   POST /api/auth/login
// @desc    Autenticar usuario y obtener token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        console.log('🔐 Login attempt:', { email: req.body.email });
        const { email, password } = req.body;

        // Verificar si el usuario existe
        let usuario = await User.findOne({ email }).select('+password');
        if (!usuario) {
            console.log('❌ Usuario no encontrado:', email);
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        console.log('✅ Usuario encontrado:', email);

        // Verificar contraseña
        const esValida = await bcrypt.compare(password, usuario.password);
        if (!esValida) {
            console.log('❌ Contraseña inválida para:', email);
            return res.status(400).json({
                success: false,
                message: 'Credenciales inválidas'
            });
        }

        console.log('✅ Contraseña válida para:', email);

        // Crear JWT
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) {
                    console.error('❌ Error al crear JWT:', err);
                    throw err;
                }
                console.log('✅ Login exitoso para:', email);
                res.json({
                    success: true,
                    token,
                    usuario: {
                        id: usuario.id,
                        nombre: usuario.nombre,
                        email: usuario.email,
                        edad: usuario.edad,
                        genero: usuario.genero,
                        peso: usuario.peso,
                        altura: usuario.altura,
                        pesoObjetivo: usuario.pesoObjetivo,
                        objetivo: usuario.objetivo,
                        nivelActividad: usuario.nivelActividad,
                        diasDisponibles: usuario.diasDisponibles,
                        tiempoDisponible: usuario.tiempoDisponible,
                        cuestionarioCompletado: usuario.cuestionarioCompletado,
                        puntuacionCuestionario: usuario.puntuacionCuestionario
                    }
                });
            }
        );
    } catch (error) {
        console.error('❌ Error en login:', error.message);
        console.error('Stack:', error.stack);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

// @route   GET /api/auth/me
// @desc    Obtener usuario autenticado
// @access  Private
router.get('/me', protegerRuta, async (req, res) => {
    try {
        const usuario = await User.findById(req.usuario.id).select('-password');
        res.json({
            success: true,
            usuario
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

// @route   PUT /api/auth/cuestionario
// @desc    Guardar resultado del cuestionario inicial
// @access  Private
router.put('/cuestionario', protegerRuta, async (req, res) => {
    try {
        const { puntuacion, nivelCalculado } = req.body;

        if (!puntuacion || !nivelCalculado) {
            return res.status(400).json({
                success: false,
                message: 'Faltan datos del cuestionario'
            });
        }

        const usuario = await User.findByIdAndUpdate(
            req.usuario.id,
            { 
                puntuacionCuestionario: puntuacion,
                nivelActividad: nivelCalculado,
                cuestionarioCompletado: true
            },
            { new: true }
        ).select('-password');

        res.json({
            success: true,
            message: 'Cuestionario guardado exitosamente',
            usuario: {
                id: usuario.id,
                nombre: usuario.nombre,
                email: usuario.email,
                nivelActividad: usuario.nivelActividad,
                cuestionarioCompletado: usuario.cuestionarioCompletado
            }
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

// @route   PUT /api/auth/profile
// @desc    Actualizar perfil de usuario
// @access  Private
router.put('/profile', protegerRuta, async (req, res) => {
    try {
        const { 
            nombre, 
            edad, 
            genero,
            peso, 
            altura, 
            pesoObjetivo,
            nivelActividad, 
            objetivo,
            diasDisponibles,
            tiempoDisponible
        } = req.body;

        // Crear objeto con solo los campos que se enviaron
        const updateData = {};
        if (nombre !== undefined) updateData.nombre = nombre;
        if (edad !== undefined) updateData.edad = edad;
        if (genero !== undefined) updateData.genero = genero;
        if (peso !== undefined) updateData.peso = peso;
        if (altura !== undefined) updateData.altura = altura;
        if (pesoObjetivo !== undefined) updateData.pesoObjetivo = pesoObjetivo;
        if (nivelActividad !== undefined) updateData.nivelActividad = nivelActividad;
        if (objetivo !== undefined) updateData.objetivo = objetivo;
        if (diasDisponibles !== undefined) updateData.diasDisponibles = diasDisponibles;
        if (tiempoDisponible !== undefined) updateData.tiempoDisponible = tiempoDisponible;

        const usuario = await User.findByIdAndUpdate(
            req.usuario.id,
            updateData,
            { new: true, runValidators: true }
        ).select('-password');

        res.json({
            success: true,
            usuario
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

// @route   POST /api/auth/refresh
// @desc    Renovar token de autenticación
// @access  Private
router.post('/refresh', protegerRuta, async (req, res) => {
    try {
        // El usuario ya está autenticado por el middleware protegerRuta
        const usuario = await User.findById(req.usuario.id).select('-password');

        if (!usuario) {
            return res.status(404).json({
                success: false,
                message: 'Usuario no encontrado'
            });
        }

        // Crear nuevo payload
        const payload = {
            usuario: {
                id: usuario.id
            }
        };

        // Generar nuevo token con 7 días de expiración
        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '7d' },
            (err, token) => {
                if (err) throw err;
                res.json({
                    success: true,
                    token,
                    usuario
                });
            }
        );
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            success: false,
            message: 'Error del servidor'
        });
    }
});

module.exports = router;