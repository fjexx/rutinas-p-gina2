require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function fixCuestionario() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');

        // Buscar todos los usuarios
        const usuarios = await User.find({});
        
        console.log(`\n📊 Total de usuarios: ${usuarios.length}\n`);
        
        for (const usuario of usuarios) {
            console.log(`Usuario: ${usuario.nombre} (${usuario.email})`);
            console.log(`  - Nivel: ${usuario.nivelActividad}`);
            console.log(`  - Cuestionario completado: ${usuario.cuestionarioCompletado}`);
            console.log(`  - Puntuación: ${usuario.puntuacionCuestionario || 'N/A'}`);
            console.log('');
        }
        
        // Preguntar si quiere actualizar algún usuario
        console.log('\n💡 Para actualizar un usuario específico, edita este script y descomenta las líneas siguientes:\n');
        
        // DESCOMENTA Y EDITA ESTAS LÍNEAS PARA ACTUALIZAR UN USUARIO:
        /*
        const emailUsuario = 'tu@email.com'; // Cambia esto por el email del usuario
        const usuarioActualizar = await User.findOne({ email: emailUsuario });
        
        if (usuarioActualizar) {
            usuarioActualizar.cuestionarioCompletado = true;
            usuarioActualizar.puntuacionCuestionario = 18; // Ajusta según el nivel
            await usuarioActualizar.save();
            console.log(`✅ Usuario ${emailUsuario} actualizado correctamente`);
        } else {
            console.log(`❌ Usuario ${emailUsuario} no encontrado`);
        }
        */
        
        await mongoose.connection.close();
        console.log('\n✅ Conexión cerrada');
        
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

fixCuestionario();
