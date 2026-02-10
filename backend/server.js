const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const dns = require('dns');

// Configurar DNS para usar Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const app = express();

// Middleware
app.use(cors({
    origin: true, // Permitir el origen de la petición
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Conexión a MongoDB Atlas con mejor manejo de errores
const connectDB = async () => {
    try {
        console.log('🔄 Intentando conectar a MongoDB Atlas...');
        console.log('URI:', process.env.MONGODB_URI ? 'URI configurada ✅' : 'URI no encontrada ❌');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        
        console.log('✅ Conectado a MongoDB Atlas');
        console.log(`📍 Host: ${conn.connection.host}`);
        console.log(`🗄️  Base de datos: ${conn.connection.name}`);
        
        // Test de conexión
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log(`📊 Colecciones disponibles: ${collections.length}`);
        
    } catch (error) {
        console.error('❌ Error de conexión a MongoDB Atlas:');
        console.error('Mensaje:', error.message);
        console.error('Código:', error.code);
        
        if (error.message.includes('authentication failed')) {
            console.error('🔐 Error de autenticación - Verifica usuario y contraseña');
        } else if (error.message.includes('network')) {
            console.error('🌐 Error de red - Verifica tu conexión a internet');
        } else if (error.message.includes('timeout')) {
            console.error('⏰ Timeout - Verifica las reglas de firewall en Atlas');
        }
        
        console.error('💡 Soluciones posibles:');
        console.error('   1. Verifica que la IP esté en la whitelist de Atlas');
        console.error('   2. Confirma usuario y contraseña en Atlas');
        console.error('   3. Verifica que el cluster esté activo');
        
        process.exit(1);
    }
};

// Conectar a la base de datos
connectDB();

// Importar rutas
const authRoutes = require('./routes/auth');
const progressRoutes = require('./routes/progress');
const routineRoutes = require('./routes/routines');

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/routines', routineRoutes);

// Ruta de prueba mejorada
app.get('/api/health', async (req, res) => {
    try {
        // Test de conexión a la base de datos
        const dbStatus = mongoose.connection.readyState === 1 ? 'Conectado' : 'Desconectado';
        const dbName = mongoose.connection.name || 'No disponible';
        
        res.json({ 
            status: 'OK', 
            message: 'Servidor funcionando correctamente',
            database: {
                status: dbStatus,
                name: dbName,
                host: mongoose.connection.host
            },
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            status: 'ERROR',
            message: 'Error en el servidor',
            error: error.message
        });
    }
});

// Ruta para probar la base de datos
app.get('/api/test-db', async (req, res) => {
    try {
        const collections = await mongoose.connection.db.listCollections().toArray();
        const stats = await mongoose.connection.db.stats();
        
        res.json({
            success: true,
            database: mongoose.connection.name,
            collections: collections.map(col => col.name),
            stats: {
                collections: stats.collections,
                objects: stats.objects,
                dataSize: stats.dataSize
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error al acceder a la base de datos',
            error: error.message
        });
    }
});

// Manejo de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error del servidor:', err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Error del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
    });
});

// Manejo de rutas no encontradas
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Ruta ${req.originalUrl} no encontrada`
    });
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
    console.log(`🌐 URL: http://localhost:${PORT}`);
    console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🧪 Test DB: http://localhost:${PORT}/api/test-db`);
});

module.exports = app;
