# 🚂 Guía Completa de Railway - Paso a Paso

## ✅ Pre-requisitos
- [x] Código subido a GitHub
- [x] Cuenta en Railway creada
- [x] Variables de entorno listas

---

## 🚀 Paso 1: Desplegar Backend

### 1.1 Crear Nuevo Proyecto
1. Ve a https://railway.app/dashboard
2. Click en **"New Project"**
3. Selecciona **"Deploy from GitHub repo"**
4. Busca y selecciona tu repositorio `fitness-app`
5. Click en **"Deploy Now"**

### 1.2 Railway Detectará Automáticamente
Railway es inteligente y detectará:
- ✅ La carpeta `backend/`
- ✅ El archivo `package.json`
- ✅ Que es una app de Node.js

### 1.3 Configurar Variables de Entorno

1. **Click en tu servicio** (aparecerá como "backend" o "fitness-app")
2. **Ve a la pestaña "Variables"**
3. **Click en "New Variable"** y agrega estas una por una:

```env
NODE_ENV=production
MONGODB_URI=mongodb+srv://fjessielord26_db_user:ZAlok1226!@cluster0.gy46czn.mongodb.net/fitness-app?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=374a1203346163e9ef51382cbe8adb9037c7d5a8e28bf3702bba8204ac03277ef3ccb774cba271471686a4ffb8b957c36b79d69ebbaa04d85e47598d35053188
CORS_ORIGIN=*
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
DEBUG=false
```

**IMPORTANTE**: No agregues `PORT`, Railway lo asigna automáticamente.

### 1.4 Verificar el Despliegue

1. **Ve a la pestaña "Deployments"**
2. Verás el progreso del build en tiempo real
3. Espera a que diga **"SUCCESS"** (2-3 minutos)
4. Si hay errores, ve a "View Logs" para ver qué pasó

### 1.5 Obtener la URL

1. **Ve a la pestaña "Settings"**
2. Busca la sección **"Domains"**
3. Click en **"Generate Domain"**
4. Railway te dará una URL como: `https://fitness-app-production.up.railway.app`
5. **COPIA ESTA URL** - la necesitarás para el frontend

### 1.6 Probar el Backend

Abre en tu navegador:
```
https://tu-url.railway.app/api/health
```

Deberías ver:
```json
{
  "status": "ok",
  "message": "Server is running",
  "timestamp": "2024-..."
}
```

✅ **Si ves esto, tu backend está funcionando!**

---

## 🎨 Paso 2: Actualizar Frontend

### 2.1 Actualizar config.js

1. **Abre** `frontend/config.js` en tu editor
2. **Cambia** la línea de API_URL:

```javascript
const CONFIG = {
    API_URL: 'https://tu-url.railway.app/api',  // ← Pega tu URL aquí
    ENDPOINTS: {
        // ... resto del código
    }
};
```

### 2.2 Guardar y Subir Cambios

```bash
git add frontend/config.js
git commit -m "Update API URL for Railway production"
git push
```

---

## 🌐 Paso 3: Desplegar Frontend

### Opción A: Vercel (Recomendado - Gratis y Rápido)

1. **Ve a** https://vercel.com
2. **Click en "Add New..."** → **"Project"**
3. **Import tu repositorio** de GitHub
4. **Configurar**:
   - Framework Preset: **Other**
   - Root Directory: **frontend**
   - Build Command: (dejar vacío)
   - Output Directory: (dejar vacío)
5. **Click en "Deploy"**
6. Espera 1-2 minutos
7. **Tu app estará en**: `https://tu-app.vercel.app`

### Opción B: Netlify (Alternativa)

1. **Ve a** https://netlify.com
2. **Click en "Add new site"** → **"Import an existing project"**
3. **Conecta GitHub** y selecciona tu repo
4. **Configurar**:
   - Base directory: **frontend**
   - Build command: (dejar vacío)
   - Publish directory: **frontend**
5. **Click en "Deploy"**
6. **Tu app estará en**: `https://tu-app.netlify.app`

---

## ✅ Paso 4: Verificar Todo Funciona

### 4.1 Probar el Frontend
1. Abre tu URL de Vercel/Netlify
2. La página debe cargar correctamente
3. Verifica que las imágenes se vean

### 4.2 Probar Registro
1. Click en "Iniciar Sesión"
2. Cambia a "Registrarse"
3. Completa el formulario
4. Click en "Crear Cuenta"
5. ✅ Deberías ver "Cuenta creada exitosamente"

### 4.3 Probar Login
1. Inicia sesión con tu cuenta
2. ✅ Deberías ver tu nombre en la esquina superior derecha

### 4.4 Probar Completar Rutina
1. Scroll a una rutina
2. Click en "Marcar como completada"
3. ✅ Debería cambiar a "¡Completada!"
4. ✅ La barra de progreso debe aparecer arriba

---

## 🐛 Solución de Problemas

### Error: "Application failed to respond"

**Causa**: El servidor no está escuchando en el puerto correcto

**Solución**:
```javascript
// En backend/server.js, asegúrate de tener:
const PORT = process.env.PORT || 5001;
```

Railway asigna el puerto automáticamente, tu código debe usar `process.env.PORT`.

### Error: "Cannot connect to MongoDB"

**Causa**: URI incorrecta o IP no permitida

**Solución**:
1. Ve a MongoDB Atlas → Network Access
2. Click en "Add IP Address"
3. Selecciona "Allow Access from Anywhere" (0.0.0.0/0)
4. Click en "Confirm"
5. En Railway, ve a Deployments → "Restart"

### Error: Frontend no conecta con Backend

**Causa**: API_URL incorrecta en config.js

**Solución**:
1. Verifica que la URL en `config.js` sea correcta
2. Debe incluir `/api` al final
3. Debe ser HTTPS
4. Haz commit y push:
   ```bash
   git add frontend/config.js
   git commit -m "Fix API URL"
   git push
   ```
5. Vercel/Netlify desplegará automáticamente

### Error: "CORS policy"

**Causa**: CORS no configurado correctamente

**Solución**:
1. En Railway, verifica que `CORS_ORIGIN=*` esté en las variables
2. O cambia a tu dominio específico: `CORS_ORIGIN=https://tu-app.vercel.app`
3. Redeploy en Railway

---

## 📊 Monitoreo en Railway

### Ver Logs en Tiempo Real
1. Click en tu servicio
2. Ve a la pestaña "Deployments"
3. Click en el deployment activo
4. Click en "View Logs"
5. Verás todos los console.log de tu servidor

### Ver Métricas
1. Ve a la pestaña "Metrics"
2. Verás:
   - CPU usage
   - Memory usage
   - Network traffic
   - Request count

### Reiniciar Servicio
1. Ve a "Deployments"
2. Click en los tres puntos (...)
3. Selecciona "Redeploy"

---

## 💰 Plan Gratuito de Railway

### Límites del Plan Gratuito
- ✅ $5 USD de crédito gratis al mes
- ✅ Suficiente para ~500 horas de ejecución
- ✅ Despliegues ilimitados
- ✅ Variables de entorno ilimitadas
- ✅ Logs por 7 días

### Optimizar Uso
- Railway NO pone tu app a dormir (a diferencia de Render)
- Tu app estará siempre disponible
- Si necesitas más crédito, puedes agregar una tarjeta

---

## 🎯 Comandos Útiles

### Ver Variables de Entorno
```bash
# En Railway CLI (opcional)
railway variables
```

### Ver Logs
```bash
railway logs
```

### Conectar a la Base de Datos
```bash
railway connect
```

---

## 🔄 Despliegue Automático

Railway despliega automáticamente cuando:
- ✅ Haces push a la rama main
- ✅ Cambias variables de entorno
- ✅ Haces redeploy manual

Para desactivar auto-deploy:
1. Settings → "Deployments"
2. Desactiva "Auto Deploy"

---

## 🌟 Tips Pro

### 1. Agregar Dominio Personalizado
1. Ve a Settings → Domains
2. Click en "Custom Domain"
3. Agrega tu dominio (ej: api.tuapp.com)
4. Configura el DNS según las instrucciones
5. ¡Listo! Railway maneja el SSL automáticamente

### 2. Ver Uso de Recursos
- Ve a Metrics para ver cuánto CPU/RAM usas
- Optimiza si ves picos altos

### 3. Configurar Health Checks
Railway hace health checks automáticos a `/`
Si quieres usar `/api/health`:
1. Settings → Health Check Path
2. Cambia a `/api/health`

### 4. Agregar Colaboradores
1. Settings → Members
2. Invita a tu equipo por email

---

## 📱 Railway CLI (Opcional)

### Instalar
```bash
npm install -g @railway/cli
```

### Login
```bash
railway login
```

### Ver Proyectos
```bash
railway list
```

### Ver Logs
```bash
railway logs
```

---

## 🎉 ¡Felicidades!

Tu app está desplegada en:
- **Backend**: https://tu-app.railway.app
- **Frontend**: https://tu-app.vercel.app

### Próximos Pasos
1. ✅ Comparte tu app con amigos
2. ✅ Recopila feedback
3. ✅ Monitorea los logs
4. ✅ Agrega más funcionalidades

---

## 📞 Ayuda

- **Railway Docs**: https://docs.railway.app
- **Railway Discord**: https://discord.gg/railway
- **Status**: https://status.railway.app

**¡Disfruta tu app en producción! 🚀💪**
