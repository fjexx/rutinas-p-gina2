// Script para corregir los niveles en la base de datos
// Convierte niveles con mayúscula inicial a minúsculas

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixNiveles() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Buscar usuarios con niveles en mayúscula
        const usuarios = await User.find({
            nivelActividad: { $in: ['Principiante', 'Intermedio', 'Avanzado'] }
        });

        console.log(`\n📊 Encontrados ${usuarios.length} usuarios con niveles a corregir\n`);

        if (usuarios.length === 0) {
            console.log('✅ No hay niveles que corregir');
            process.exit(0);
        }

        // Corregir cada usuario
        for (const usuario of usuarios) {
            const nivelAnterior = usuario.nivelActividad;
            let nivelNuevo = '';

            switch (nivelAnterior) {
                case 'Principiante':
                    nivelNuevo = 'principiante';
                    break;
                case 'Intermedio':
                    nivelNuevo = 'intermedio';
                    break;
                case 'Avanzado':
                    nivelNuevo = 'avanzado';
                    break;
                default:
                    nivelNuevo = nivelAnterior.toLowerCase();
            }

            usuario.nivelActividad = nivelNuevo;
            await usuario.save();

            console.log(`✅ Usuario: ${usuario.email}`);
            console.log(`   Nivel anterior: ${nivelAnterior}`);
            console.log(`   Nivel nuevo: ${nivelNuevo}\n`);
        }

        console.log('✅ Todos los niveles han sido corregidos');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Ejecutar
fixNiveles();
