#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Iniciando entorno de desarrollo...\n');

// Verificar que existe el archivo .env
const envPath = path.join(__dirname, 'backend', '.env');
if (!fs.existsSync(envPath)) {
    console.error('❌ Archivo .env no encontrado en backend/');
    console.error('💡 Crea el archivo backend/.env con las variables necesarias');
    process.exit(1);
}

console.log('✅ Archivo .env encontrado');

// Función para ejecutar comandos
function runCommand(command, args, cwd, name) {
    return new Promise((resolve, reject) => {
        console.log(`🔄 Iniciando ${name}...`);
        
        const child = spawn(command, args, {
            cwd: cwd,
            stdio: 'inherit',
            shell: true
        });
        
        child.on('error', (error) => {
            console.error(`❌ Error en ${name}:`, error.message);
            reject(error);
        });
        
        child.on('exit', (code) => {
            if (code === 0) {
                console.log(`✅ ${name} terminó correctamente`);
                resolve();
            } else {
                console.error(`❌ ${name} terminó con código ${code}`);
                reject(new Error(`${name} failed with code ${code}`));
            }
        });
        
        return child;
    });
}

async function startDevelopment() {
    try {
        // Primero probar la conexión a la base de datos
        console.log('🧪 Probando conexión a MongoDB Atlas...');
        await runCommand('npm', ['run', 'test-db'], path.join(__dirname, 'backend'), 'Test de conexión DB');
        
        console.log('\n🎉 ¡Conexión a la base de datos exitosa!');
        console.log('🚀 Iniciando servidor backend...\n');
        
        // Iniciar el servidor backend
        const backendProcess = spawn('npm', ['run', 'dev'], {
            cwd: path.join(__dirname, 'backend'),
            stdio: 'inherit',
            shell: true
        });
        
        backendProcess.on('error', (error) => {
            console.error('❌ Error al iniciar backend:', error.message);
        });
        
        console.log('✅ Servidor backend iniciado en http://localhost:5001');
        console.log('🌐 Frontend disponible abriendo frontend/index.html en tu navegador');
        console.log('\n📋 URLs útiles:');
        console.log('   Backend: http://localhost:5001');
        console.log('   Health Check: http://localhost:5001/api/health');
        console.log('   Test DB: http://localhost:5001/api/test-db');
        console.log('\n⚡ Para detener el servidor, presiona Ctrl+C');
        
        // Manejar cierre limpio
        process.on('SIGINT', () => {
            console.log('\n🛑 Deteniendo servidor...');
            backendProcess.kill('SIGINT');
            process.exit(0);
        });
        
    } catch (error) {
        console.error('\n❌ Error durante el inicio:', error.message);
        console.error('\n💡 Soluciones posibles:');
        console.error('   1. Verifica que MongoDB Atlas esté configurado correctamente');
        console.error('   2. Ejecuta: cd backend && npm run test-db');
        console.error('   3. Revisa el archivo backend/.env');
        console.error('   4. Verifica tu conexión a internet');
        process.exit(1);
    }
}

// Verificar Node.js y npm
console.log('🔍 Verificando entorno...');
console.log('Node.js:', process.version);

startDevelopment();