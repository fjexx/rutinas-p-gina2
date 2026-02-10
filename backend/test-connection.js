const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function testConnection() {
    console.log('🔍 Iniciando diagnóstico de conexión a MongoDB Atlas...\n');
    
    // Verificar variables de entorno
    console.log('📋 Variables de entorno:');
    console.log('   PORT:', process.env.PORT || 'No definido');
    console.log('   NODE_ENV:', process.env.NODE_ENV || 'No definido');
    console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurado' : '❌ No configurado');
    console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurado' : '❌ No configurado');
    console.log('');
    
    if (!process.env.MONGODB_URI) {
        console.error('❌ MONGODB_URI no está configurado en el archivo .env');
        process.exit(1);
    }
    
    try {
        console.log('🔄 Intentando conectar a MongoDB Atlas...');
        
        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 10000, // 10 segundos timeout
            socketTimeoutMS: 45000, // 45 segundos socket timeout
        });
        
        console.log('✅ ¡Conexión exitosa a MongoDB Atlas!');
        console.log('📍 Detalles de la conexión:');
        console.log('   Host:', conn.connection.host);
        console.log('   Base de datos:', conn.connection.name);
        console.log('   Estado:', conn.connection.readyState === 1 ? 'Conectado' : 'Desconectado');
        console.log('');
        
        // Probar operaciones básicas
        console.log('🧪 Probando operaciones de base de datos...');
        
        // Listar colecciones
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('📊 Colecciones encontradas:', collections.length);
        collections.forEach(col => {
            console.log('   -', col.name);
        });
        
        // Obtener estadísticas
        const stats = await mongoose.connection.db.stats();
        console.log('📈 Estadísticas de la base de datos:');
        console.log('   Colecciones:', stats.collections);
        console.log('   Documentos:', stats.objects);
        console.log('   Tamaño de datos:', Math.round(stats.dataSize / 1024), 'KB');
        console.log('');
        
        // Probar creación de documento (opcional)
        console.log('🔬 Probando operación de escritura...');
        const testCollection = mongoose.connection.db.collection('connection_test');
        const testDoc = {
            timestamp: new Date(),
            test: 'connection_successful',
            version: '1.0'
        };
        
        const result = await testCollection.insertOne(testDoc);
        console.log('✅ Documento de prueba insertado con ID:', result.insertedId);
        
        // Limpiar documento de prueba
        await testCollection.deleteOne({ _id: result.insertedId });
        console.log('🧹 Documento de prueba eliminado');
        
        console.log('\n🎉 ¡Todas las pruebas pasaron exitosamente!');
        console.log('💡 Tu conexión a MongoDB Atlas está funcionando correctamente.');
        
    } catch (error) {
        console.error('\n❌ Error de conexión:');
        console.error('Tipo:', error.name);
        console.error('Mensaje:', error.message);
        
        if (error.message.includes('authentication failed')) {
            console.error('\n🔐 Problema de autenticación:');
            console.error('   - Verifica el usuario y contraseña en MongoDB Atlas');
            console.error('   - Asegúrate de que el usuario tenga permisos de lectura/escritura');
        } else if (error.message.includes('network') || error.message.includes('timeout')) {
            console.error('\n🌐 Problema de red:');
            console.error('   - Verifica tu conexión a internet');
            console.error('   - Asegúrate de que tu IP esté en la whitelist de Atlas');
            console.error('   - Verifica que no haya firewall bloqueando la conexión');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('\n🔍 Problema de DNS:');
            console.error('   - Verifica que la URL del cluster sea correcta');
            console.error('   - Asegúrate de que el cluster esté activo en Atlas');
        }
        
        console.error('\n💡 Pasos para solucionar:');
        console.error('   1. Ve a MongoDB Atlas (https://cloud.mongodb.com)');
        console.error('   2. Verifica que tu cluster esté activo');
        console.error('   3. Ve a Database Access y verifica el usuario');
        console.error('   4. Ve a Network Access y agrega tu IP (0.0.0.0/0 para desarrollo)');
        console.error('   5. Copia la connection string correcta desde "Connect"');
        
        process.exit(1);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Conexión cerrada.');
    }
}

// Ejecutar el test
testConnection().catch(console.error);