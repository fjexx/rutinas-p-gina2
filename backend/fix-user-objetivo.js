const mongoose = require('mongoose');
const dns = require('dns');
require('dotenv').config();

// Configurar DNS para usar Google DNS
dns.setServers(['8.8.8.8', '8.8.4.4']);

const User = require('./models/User');

async function fixUserObjetivo() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);

        console.log('✅ Conectado a MongoDB');

        // Buscar usuarios con objetivo inválido
        const users = await User.find({ objetivo: { $nin: ['perder_peso', 'ganar_musculo', 'mantener_peso', 'mejorar_resistencia', 'aumentar_flexibilidad', 'salud_general'] } });

        console.log(`Encontrados ${users.length} usuarios con objetivo inválido`);

        // Actualizar cada usuario
        for (const user of users) {
            console.log(`Actualizando usuario: ${user.email}, objetivo actual: ${user.objetivo}`);
            user.objetivo = 'salud_general';
            await user.save();
            console.log(`✅ Usuario actualizado: ${user.email}`);
        }

        // También actualizar directamente en la BD por si acaso
        const result = await User.updateMany(
            { objetivo: { $nin: ['perder_peso', 'ganar_musculo', 'mantener_peso', 'mejorar_resistencia', 'aumentar_flexibilidad', 'salud_general'] } },
            { $set: { objetivo: 'salud_general' } }
        );

        console.log(`✅ Actualizados ${result.modifiedCount} usuarios directamente`);

        console.log('✅ Proceso completado');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixUserObjetivo();
