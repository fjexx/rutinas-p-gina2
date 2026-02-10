#!/usr/bin/env node

/**
 * Script de verificación pre-despliegue
 * Verifica que todo esté listo para producción
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Verificando configuración para producción...\n');

let errores = 0;
let advertencias = 0;

// Verificar .env
console.log('📋 Verificando backend/.env...');
const envPath = path.join(__dirname, 'backend', '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    // Verificar NODE_ENV
    if (envContent.includes('NODE_ENV=production')) {
        console.log('  ✅ NODE_ENV configurado a production');
    } else {
        console.log('  ⚠️  NODE_ENV no está en production');
        advertencias++;
    }
    
    // Verificar JWT_SECRET
    if (envContent.includes('JWT_SECRET=tu_secreto') || envContent.includes('JWT_SECRET=cambiar')) {
        console.log('  ❌ JWT_SECRET no ha sido cambiado');
        errores++;
    } else if (envContent.match(/JWT_SECRET=.{64,}/)) {
        console.log('  ✅ JWT_SECRET configurado (seguro)');
    } else {
        console.log('  ⚠️  JWT_SECRET parece corto (recomendado: 64+ caracteres)');
        advertencias++;
    }
    
    // Verificar MONGODB_URI
    if (envContent.includes('MONGODB_URI=mongodb')) {
        console.log('  ✅ MONGODB_URI configurado');
    } else {
        console.log('  ❌ MONGODB_URI no encontrado');
        errores++;
    }
} else {
    console.log('  ❌ Archivo .env no encontrado');
    errores++;
}

// Verificar config.js
console.log('\n📋 Verificando frontend/config.js...');
const configPath = path.join(__dirname, 'frontend', 'config.js');
if (fs.existsSync(configPath)) {
    const configContent = fs.readFileSync(configPath, 'utf8');
    
    if (configContent.includes('localhost')) {
        console.log('  ⚠️  API_URL todavía apunta a localhost');
        console.log('     Actualiza esto después de desplegar el backend');
        advertencias++;
    } else {
        console.log('  ✅ API_URL configurado para producción');
    }
} else {
    console.log('  ❌ config.js no encontrado');
    errores++;
}

// Verificar archivos de despliegue
console.log('\n📋 Verificando archivos de despliegue...');
const archivosDespliegue = [
    'vercel.json',
    'netlify.toml',
    'railway.json',
    'render.yaml',
    'Procfile'
];

archivosDespliegue.forEach(archivo => {
    if (fs.existsSync(path.join(__dirname, archivo))) {
        console.log(`  ✅ ${archivo} encontrado`);
    }
});

// Verificar package.json
console.log('\n📋 Verificando backend/package.json...');
const packagePath = path.join(__dirname, 'backend', 'package.json');
if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    if (packageJson.scripts && packageJson.scripts.start) {
        console.log('  ✅ Script "start" configurado');
    } else {
        console.log('  ❌ Script "start" no encontrado');
        errores++;
    }
    
    if (packageJson.dependencies) {
        console.log(`  ✅ ${Object.keys(packageJson.dependencies).length} dependencias encontradas`);
    }
} else {
    console.log('  ❌ package.json no encontrado');
    errores++;
}

// Verificar imágenes
console.log('\n📋 Verificando imágenes...');
const imgsPath = path.join(__dirname, 'frontend', 'imgs');
if (fs.existsSync(imgsPath)) {
    const imagenes = fs.readdirSync(imgsPath);
    console.log(`  ✅ ${imagenes.length} imágenes encontradas`);
    
    const imagenesRequeridas = [
        'principiante.png',
        'principiante2.png',
        'intermedio.png',
        'intermedio2.png',
        'avanzado.png',
        'avanzado2.png',
        'banner.jpg'
    ];
    
    imagenesRequeridas.forEach(img => {
        if (imagenes.includes(img)) {
            console.log(`  ✅ ${img}`);
        } else {
            console.log(`  ❌ ${img} no encontrada`);
            errores++;
        }
    });
} else {
    console.log('  ❌ Carpeta imgs/ no encontrada');
    errores++;
}

// Resumen
console.log('\n' + '='.repeat(50));
console.log('📊 RESUMEN DE VERIFICACIÓN\n');

if (errores === 0 && advertencias === 0) {
    console.log('🎉 ¡TODO PERFECTO! Listo para desplegar');
    console.log('\n📝 Próximos pasos:');
    console.log('   1. Sube tu código a GitHub');
    console.log('   2. Sigue las instrucciones en DEPLOY.md');
    console.log('   3. Actualiza API_URL después de desplegar backend');
} else {
    if (errores > 0) {
        console.log(`❌ ${errores} error(es) encontrado(s)`);
        console.log('   Corrige estos errores antes de desplegar');
    }
    if (advertencias > 0) {
        console.log(`⚠️  ${advertencias} advertencia(s) encontrada(s)`);
        console.log('   Revisa estas advertencias (no críticas)');
    }
}

console.log('='.repeat(50) + '\n');

// Exit code
process.exit(errores > 0 ? 1 : 0);
