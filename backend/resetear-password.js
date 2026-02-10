const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const dns = require('dns');

// Configurar DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

dotenv.config();

const User = require('./models/User');

async function resetearPassword() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB Atlas\n');
        
        const email = 'fjessiel.ord26@gmail.com';
        const nuevaPassword = '123456'; // Contraseña temporal
        
        const usuario = await User.findOne({ email });
        
        if (!usuario) {
            console.log('❌ Usuario no encontrado');
            process.exit(1);
        }
        
        // Encriptar la nueva contraseña
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(nuevaPassword, salt);
        
        // Actualizar directamente sin pasar por el pre-save hook
        await User.updateOne(
            { email },
            { $set: { password: passwordHash } }
        );
        
        console.log('✅ Contraseña reseteada exitosamente');
        console.log(`📧 Email: ${email}`);
        console.log(`🔑 Nueva contraseña: ${nuevaPassword}`);
        console.log('\n⚠️  Cambia esta contraseña después de iniciar sesión');
        
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
}

resetearPassword();
