const https = require('https');
const { exec } = require('child_process');
const dotenv = require('dotenv');

dotenv.config();

console.log('🔧 Configurador de MongoDB Atlas\n');

// Función para obtener IP pública
function getPublicIP() {
    return new Promise((resolve, reject) => {
        https.get('https://api.ipify.org?format=json', (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    const ip = JSON.parse(data).ip;
                    resolve(ip);
                } catch (error) {
                    reject(error);
                }
            });
        }).on('error', reject);
    });
}

// Función para verificar conectividad
function testConnectivity() {
    return new Promise((resolve, reject) => {
        const testUrl = 'cluster0.gy46czn.mongodb.net';
        exec(`ping -c 1 ${testUrl}`, (error, stdout, stderr) => {
            if (error) {
                resolve(false);
            } else {
                resolve(true);
            }
        });
    });
}

async function diagnoseConnection() {
    console.log('🔍 Diagnóstico de conexión a MongoDB Atlas\n');
    
    try {
        // 1. Verificar IP pública
        console.log('1️⃣ Obteniendo tu IP pública...');
        const publicIP = await getPublicIP();
        console.log(`   Tu IP pública es: ${publicIP}`);
        
        // 2. Verificar conectividad
        console.log('\n2️⃣ Verificando conectividad a MongoDB Atlas...');
        const canConnect = await testConnectivity();
        console.log(`   Conectividad: ${canConnect ? '✅ OK' : '❌ Bloqueada'}`);
        
        // 3. Verificar variables de entorno
        console.log('\n3️⃣ Verificando configuración...');
        console.log(`   MONGODB_URI: ${process.env.MONGODB_URI ? '✅ Configurado' : '❌ Faltante'}`);
        
        if (process.env.MONGODB_URI) {
            const uri = process.env.MONGODB_URI;
            const match = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)/);
            if (match) {
                console.log(`   Usuario: ${match[1]}`);
                console.log(`   Cluster: ${match[3]}`);
            }
        }
        
        // 4. Instrucciones específicas
        console.log('\n📋 INSTRUCCIONES PASO A PASO:\n');
        
        console.log('🌐 1. Ve a MongoDB Atlas: https://cloud.mongodb.com');
        console.log('🔐 2. Inicia sesión con tu cuenta');
        console.log('📊 3. Selecciona tu proyecto y cluster');
        
        console.log('\n🛡️  4. CONFIGURAR NETWORK ACCESS:');
        console.log('   a) Ve a "Network Access" en el menú lateral');
        console.log('   b) Haz clic en "ADD IP ADDRESS"');
        console.log('   c) Selecciona "ALLOW ACCESS FROM ANYWHERE"');
        console.log('   d) O agrega manualmente: 0.0.0.0/0');
        console.log(`   e) También puedes agregar tu IP específica: ${publicIP}/32`);
        console.log('   f) Haz clic en "Confirm"');
        
        console.log('\n👤 5. VERIFICAR DATABASE ACCESS:');
        console.log('   a) Ve a "Database Access" en el menú lateral');
        console.log('   b) Verifica que existe el usuario: fjessielord26_db_user');
        console.log('   c) Si no existe, créalo con "ADD NEW DATABASE USER"');
        console.log('   d) Asigna permisos: "Read and write to any database"');
        
        console.log('\n🔗 6. OBTENER CONNECTION STRING:');
        console.log('   a) Ve a tu cluster y haz clic en "Connect"');
        console.log('   b) Selecciona "Connect your application"');
        console.log('   c) Copia la connection string');
        console.log('   d) Reemplaza <password> con tu contraseña real');
        
        console.log('\n⚡ 7. ACTUALIZAR .ENV:');
        console.log('   a) Abre backend/.env');
        console.log('   b) Actualiza MONGODB_URI con la nueva connection string');
        console.log('   c) Guarda el archivo');
        
        console.log('\n🧪 8. PROBAR CONEXIÓN:');
        console.log('   Ejecuta: npm run test-db');
        
        console.log('\n💡 PROBLEMAS COMUNES:');
        console.log('   • IP no en whitelist → Agregar 0.0.0.0/0');
        console.log('   • Usuario incorrecto → Verificar Database Access');
        console.log('   • Contraseña incorrecta → Resetear en Database Access');
        console.log('   • Cluster pausado → Reactivar en Atlas');
        console.log('   • Firewall corporativo → Usar VPN o red personal');
        
        if (!canConnect) {
            console.log('\n🚨 PROBLEMA DE CONECTIVIDAD DETECTADO:');
            console.log('   Tu red puede estar bloqueando la conexión a MongoDB Atlas');
            console.log('   Soluciones:');
            console.log('   • Cambia a una red diferente (móvil, casa)');
            console.log('   • Usa una VPN');
            console.log('   • Contacta a tu administrador de red');
        }
        
    } catch (error) {
        console.error('❌ Error durante el diagnóstico:', error.message);
    }
}

// Función para generar nueva connection string
function generateConnectionString() {
    console.log('\n🔗 GENERADOR DE CONNECTION STRING:\n');
    
    const template = 'mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority&appName=<appName>';
    
    console.log('Plantilla:');
    console.log(template);
    
    console.log('\nEjemplo con tus datos:');
    console.log('mongodb+srv://fjessielord26_db_user:TU_PASSWORD_AQUI@cluster0.gy46czn.mongodb.net/fitness-app?retryWrites=true&w=majority&appName=Cluster0');
    
    console.log('\n⚠️  IMPORTANTE:');
    console.log('   • Reemplaza TU_PASSWORD_AQUI con tu contraseña real');
    console.log('   • No uses caracteres especiales en la contraseña');
    console.log('   • Si tu contraseña tiene caracteres especiales, codifícalos:');
    console.log('     @ → %40');
    console.log('     # → %23');
    console.log('     $ → %24');
    console.log('     % → %25');
}

// Ejecutar diagnóstico
async function main() {
    await diagnoseConnection();
    generateConnectionString();
    
    console.log('\n🎯 PRÓXIMOS PASOS:');
    console.log('1. Sigue las instrucciones de arriba');
    console.log('2. Ejecuta: npm run test-db');
    console.log('3. Si sigue fallando, ejecuta este script de nuevo');
}

main().catch(console.error);