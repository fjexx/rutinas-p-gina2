const mongoose = require('mongoose');
const dotenv = require('dotenv');
const dns = require('dns');

// Configurar DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const User = require('./models/User');

async function verUsuarios() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas\n');
        
        const usuarios = await User.find({}).select('-password');
        
        console.log(`📊 Total de usuarios: ${usuarios.length}\n`);
        
        if (usuarios.length === 0) {
            console.log('❌ No hay usuarios registrados en la base de datos');
        } else {
            console.log('👥 Usuarios registrados:\n');
            usuarios.forEach((user, index) => {
                console.log(`${index + 1}. Email: ${user.email}`);
                console.log(`   Nombre: ${user.nombre}`);
                console.log(`   Nivel: ${user.nivelActividad}`);
                console.log(`   Fecha registro: ${user.fechaRegistro}`);
                console.log('');
            });
        }
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

verUsuarios();
