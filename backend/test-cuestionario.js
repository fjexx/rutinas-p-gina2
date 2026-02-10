// Script de prueba para verificar el guardado del cuestionario

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function testCuestionario() {
    try {
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Buscar un usuario de prueba
        const usuario = await User.findOne().sort({ fechaRegistro: -1 });
        
        if (!usuario) {
            console.log('❌ No hay usuarios en la base de datos');
            process.exit(1);
        }

        console.log('\n📊 Usuario de prueba:');
        console.log(`   Email: ${usuario.email}`);
        console.log(`   Nivel actual: ${usuario.nivelActividad}`);
        console.log(`   Cuestionario completado: ${usuario.cuestionarioCompletado}`);
        console.log(`   Puntuación: ${usuario.puntuacionCuestionario || 'N/A'}`);

        // Simular actualización del cuestionario
        console.log('\n🔄 Simulando actualización a nivel "intermedio"...');
        
        usuario.puntuacionCuestionario = 18;
        usuario.nivelActividad = 'intermedio';
        usuario.cuestionarioCompletado = true;
        
        await usuario.save();

        console.log('\n✅ Usuario actualizado:');
        console.log(`   Nivel nuevo: ${usuario.nivelActividad}`);
        console.log(`   Puntuación: ${usuario.puntuacionCuestionario}`);
        console.log(`   Cuestionario completado: ${usuario.cuestionarioCompletado}`);

        // Verificar que se guardó correctamente
        const usuarioVerificado = await User.findById(usuario._id);
        console.log('\n🔍 Verificación desde DB:');
        console.log(`   Nivel en DB: ${usuarioVerificado.nivelActividad}`);
        console.log(`   Tipo de dato: ${typeof usuarioVerificado.nivelActividad}`);

        if (usuarioVerificado.nivelActividad === 'intermedio') {
            console.log('\n✅ ¡Prueba exitosa! El nivel se guardó correctamente en minúsculas');
        } else {
            console.log('\n❌ Error: El nivel no se guardó correctamente');
        }

        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Ejecutar
testCuestionario();
