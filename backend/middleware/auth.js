const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protegerRuta = async (req, res, next) => {
    let token;

    // Verificar si el token existe en el header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Obtener token del header
            token = req.headers.authorization.split(' ')[1];
            
            console.log('🔐 Token recibido (primeros 30 chars):', token.substring(0, 30) + '...');

            // Verificar token
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'tu_secreto_jwt_super_seguro');
            
            console.log('✅ Token decodificado:', { userId: decoded.usuario?.id || decoded.id });

            // Obtener usuario del token (el payload tiene la estructura {usuario: {id: ...}})
            const userId = decoded.usuario ? decoded.usuario.id : decoded.id;
            req.usuario = await User.findById(userId).select('-password');

            if (!req.usuario) {
                console.error('❌ Usuario no encontrado en BD:', userId);
                return res.status(401).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
            }
            
            console.log('✅ Usuario autenticado:', req.usuario.email);

            // Actualizar último acceso
            if (req.usuario.actualizarUltimoAcceso) {
                await req.usuario.actualizarUltimoAcceso();
            }

            next();
        } catch (error) {
            console.error('❌ Error en autenticación:', error.message);
            return res.status(401).json({
                success: false,
                message: 'Token no válido o expirado'
            });
        }
    }

    if (!token) {
        console.error('❌ No se proporcionó token');
        return res.status(401).json({
            success: false,
            message: 'No autorizado, no se proporcionó token'
        });
    }
};

// Middleware opcional para verificar nivel de usuario
const verificarNivel = (nivelesPermitidos) => {
    return (req, res, next) => {
        if (!req.usuario) {
            return res.status(401).json({
                success: false,
                message: 'Usuario no autenticado'
            });
        }

        if (!nivelesPermitidos.includes(req.usuario.nivel)) {
            return res.status(403).json({
                success: false,
                message: 'No tienes permisos para acceder a este recurso'
            });
        }

        next();
    };
};

// Middleware para verificar si es administrador
const verificarAdmin = (req, res, next) => {
    if (!req.usuario) {
        return res.status(401).json({
            success: false,
            message: 'Usuario no autenticado'
        });
    }

    if (req.usuario.rol !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Acceso denegado. Se requieren permisos de administrador'
        });
    }

    next();
};

module.exports = {
    protegerRuta,
    verificarNivel,
    verificarAdmin
};