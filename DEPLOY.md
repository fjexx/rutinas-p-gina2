# 🚀 Guía de Despliegue Rápido

## ✅ Pre-requisitos Completados
- [x] JWT Secret generado y actualizado
- [x] NODE_ENV configurado a production
- [x] Archivos de configuración creados
- [x] .gitignore actualizado

---

## 🎯 Opción 1: Vercel (Frontend) + Railway (Backend) [RECOMENDADO]

### Paso 1: Desplegar Backend en Railway

1. **Crear cuenta en Railway**
   - Ve a https://railway.app
   - Regístrate con GitHub

2. **Crear nuevo proyecto**
   - Click en "New Project"
   - Selecciona "Deploy from GitHub repo"
   - Conecta tu repositorio

3. **Configurar variables de entorno**
   ```
   NODE_ENV=production
   PORT=5001
   MONGODB_URI=tu_uri_de_mongodb
   JWT_SECRET=374a1203346163e9ef51382cbe8adb9037c7d5a8e28bf3702bba8204ac03277ef3ccb774cba271471686a4ffb8b957c36b79d69ebbaa04d85e47598d35053188
   CORS_ORIGIN=*
   ```

4. **Configurar build**
   - Root Directory: `backend`
   - Start Command: `npm start`
   - Deploy!

5. **Copiar URL del backend**
   - Ejemplo: `https://tu-app.railway.app`

### Paso 2: Desplegar Frontend en Vercel

1. **Crear cuenta en Vercel**
   - Ve a https://vercel.com
   - Regístrate con GitHub

2. **Importar proyecto**
   - Click en "Add New Project"
   - Selecciona tu repositorio
   - Root Directory: `frontend`

3. **Actualizar config.js ANTES de desplegar**
   - Abre `frontend/config.js`
   - Cambia: `API_URL: 'https://tu-app.railway.app/api'`

4. **Deploy!**
   - Vercel desplegará automáticamente
   - Tu app estará en: `https://tu-app.vercel.app`

---

## 🎯 Opción 2: Netlify (Frontend) + Render (Backend)

### Backend en Render

1. **Crear cuenta en Render**
   - Ve a https://render.com
   - Regístrate con GitHub

2. **Crear Web Service**
   - Click en "New +"
   - Selecciona "Web Service"
   - Conecta tu repo
   - Root Directory: `backend`
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Agregar variables de entorno** (igual que Railway)

4. **Deploy y copiar URL**

### Frontend en Netlify

1. **Crear cuenta en Netlify**
   - Ve a https://netlify.com
   - Regístrate con GitHub

2. **Importar proyecto**
   - Click en "Add new site"
   - Selecciona tu repositorio
   - Base directory: `frontend`
   - Publish directory: `frontend`

3. **Actualizar config.js** (con URL de Render)

4. **Deploy!**

---

## 🎯 Opción 3: Todo en Render (Más Simple)

1. **Crear cuenta en Render**

2. **Desplegar Backend**
   - New Web Service
   - Root: `backend`
   - Variables de entorno
   - Deploy

3. **Desplegar Frontend**
   - New Static Site
   - Publish directory: `frontend`
   - Deploy

4. **Actualizar config.js** con URL del backend

---

## 📝 Checklist Post-Despliegue

### Backend
- [ ] Servidor corriendo sin errores
- [ ] Health check funcionando: `https://tu-backend.com/api/health`
- [ ] Conexión a MongoDB exitosa
- [ ] Variables de entorno configuradas

### Frontend
- [ ] Sitio cargando correctamente
- [ ] Imágenes mostrándose
- [ ] CSS aplicado
- [ ] JavaScript funcionando

### Funcionalidades
- [ ] Registro de usuario funciona
- [ ] Login funciona
- [ ] Completar rutinas funciona
- [ ] Barra de progreso actualiza
- [ ] Modal de login aparece
- [ ] Responsive funciona en móvil

---

## 🔧 Comandos Útiles

### Verificar Backend Local
```bash
cd backend
npm start
# Visita: http://localhost:5001/api/health
```

### Verificar Frontend Local
```bash
# Abre frontend/index.html en navegador
# O usa Live Server en VS Code
```

### Generar nuevo JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 🐛 Troubleshooting

### Error: Cannot connect to MongoDB
- Verifica que la URI sea correcta
- Verifica que tu IP esté en whitelist de MongoDB Atlas
- Agrega `0.0.0.0/0` para permitir todas las IPs

### Error: CORS
- Verifica que CORS_ORIGIN incluya tu dominio frontend
- O usa `*` para permitir todos (solo desarrollo)

### Error: JWT Invalid
- Verifica que JWT_SECRET sea el mismo en producción
- Regenera tokens si cambiaste el secret

### Frontend no conecta con Backend
- Verifica que API_URL en config.js sea correcto
- Debe incluir `/api` al final
- Debe ser HTTPS en producción

---

## 🎉 ¡Listo!

Tu app debería estar funcionando en:
- **Frontend**: https://tu-app.vercel.app
- **Backend**: https://tu-app.railway.app

**Tiempo estimado**: 30-45 minutos

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en tu plataforma de hosting
2. Verifica las variables de entorno
3. Prueba el backend con Postman/Thunder Client
4. Revisa la consola del navegador para errores de frontend

**¡Felicidades por desplegar tu app! 🎊**
