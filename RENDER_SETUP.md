# 🚀 Guía de Despliegue en Render

## Opción 1: Usando la Interfaz Web (Recomendado)

### Paso 1: Crear Cuenta
1. Ve a https://render.com
2. Regístrate con GitHub
3. Autoriza Render a acceder a tus repositorios

### Paso 2: Desplegar Backend

1. **Click en "New +"** → **"Web Service"**

2. **Conectar Repositorio**
   - Selecciona tu repositorio `fitness-app`
   - Click en "Connect"

3. **Configurar el Servicio**
   ```
   Name: fitness-app-backend
   Region: Oregon (US West)
   Branch: main
   Root Directory: backend
   Runtime: Node
   Build Command: npm install
   Start Command: npm start
   ```

4. **Plan**: Selecciona "Free"

5. **Variables de Entorno** (Click en "Advanced")
   Agrega estas variables:
   ```
   NODE_ENV = production
   PORT = 10000
   MONGODB_URI = mongodb+srv://fjessielord26_db_user:ZAlok1226!@cluster0.gy46czn.mongodb.net/fitness-app?retryWrites=true&w=majority&appName=Cluster0
   JWT_SECRET = 374a1203346163e9ef51382cbe8adb9037c7d5a8e28bf3702bba8204ac03277ef3ccb774cba271471686a4ffb8b957c36b79d69ebbaa04d85e47598d35053188
   CORS_ORIGIN = *
   BCRYPT_ROUNDS = 12
   JWT_EXPIRES_IN = 7d
   DEBUG = false
   ```

6. **Health Check Path**: `/api/health`

7. **Click en "Create Web Service"**

8. **Espera a que termine el despliegue** (2-3 minutos)

9. **Copia la URL** que te da Render
   - Ejemplo: `https://fitness-app-backend.onrender.com`

### Paso 3: Actualizar Frontend

1. **Abre** `frontend/config.js`

2. **Cambia la URL**:
   ```javascript
   const CONFIG = {
       API_URL: 'https://fitness-app-backend.onrender.com/api',  // Tu URL de Render
       // ...
   };
   ```

3. **Guarda el archivo**

4. **Commit y push**:
   ```bash
   git add frontend/config.js
   git commit -m "Update API URL for production"
   git push
   ```

### Paso 4: Desplegar Frontend

1. **Click en "New +"** → **"Static Site"**

2. **Conectar el mismo repositorio**

3. **Configurar**:
   ```
   Name: fitness-app-frontend
   Branch: main
   Root Directory: (dejar vacío)
   Build Command: (dejar vacío)
   Publish Directory: frontend
   ```

4. **Click en "Create Static Site"**

5. **Espera a que termine** (1-2 minutos)

6. **Tu app estará en**: `https://fitness-app-frontend.onrender.com`

---

## Opción 2: Usando render.yaml (Automático)

Si prefieres usar el archivo `render.yaml`:

1. **Asegúrate de que render.yaml esté en la raíz**

2. **En Render Dashboard**:
   - Click en "New +"
   - Selecciona "Blueprint"
   - Conecta tu repositorio
   - Render detectará automáticamente el `render.yaml`

3. **Configura las variables de entorno manualmente**
   (Render no puede leer las del archivo por seguridad)

---

## ✅ Verificar que Funciona

### Backend
1. Abre: `https://tu-backend.onrender.com/api/health`
2. Deberías ver: `{"status":"ok","message":"Server is running"}`

### Frontend
1. Abre: `https://tu-frontend.onrender.com`
2. La página debe cargar correctamente
3. Prueba registrarte e iniciar sesión

---

## 🐛 Solución de Problemas

### Error: "Build failed"

**Causa**: Render no encuentra el package.json

**Solución**:
1. Verifica que "Root Directory" sea `backend`
2. Verifica que el archivo `backend/package.json` exista
3. Intenta hacer un nuevo despliegue

### Error: "Application failed to respond"

**Causa**: El servidor no está escuchando en el puerto correcto

**Solución**:
1. Verifica que la variable `PORT` sea `10000`
2. Verifica que tu código use `process.env.PORT`
3. Revisa los logs en Render Dashboard

### Error: "Cannot connect to MongoDB"

**Causa**: URI de MongoDB incorrecta o IP no permitida

**Solución**:
1. Verifica que `MONGODB_URI` esté correcta
2. En MongoDB Atlas:
   - Ve a "Network Access"
   - Agrega `0.0.0.0/0` para permitir todas las IPs
   - O agrega las IPs de Render

### Frontend no conecta con Backend

**Causa**: API_URL incorrecta

**Solución**:
1. Verifica que `API_URL` en `config.js` sea correcta
2. Debe incluir `/api` al final
3. Debe ser HTTPS
4. Haz commit y push de los cambios

---

## 📊 Monitoreo

### Ver Logs
1. Ve a tu servicio en Render Dashboard
2. Click en "Logs"
3. Verás logs en tiempo real

### Ver Métricas
1. Click en "Metrics"
2. Verás CPU, memoria, requests, etc.

### Reiniciar Servicio
1. Click en "Manual Deploy"
2. Selecciona "Clear build cache & deploy"

---

## 💡 Tips

### Despliegue Automático
- Render despliega automáticamente cuando haces push a main
- Puedes desactivar esto en Settings

### Dominios Personalizados
- Puedes agregar tu propio dominio en Settings → Custom Domains
- Es gratis!

### Variables de Entorno
- Puedes editarlas en Settings → Environment
- Los cambios requieren un nuevo despliegue

### Logs Persistentes
- Los logs se mantienen por 7 días en el plan gratuito
- Descárgalos si necesitas guardarlos más tiempo

---

## 🎉 ¡Listo!

Tu app debería estar funcionando en:
- **Backend**: https://fitness-app-backend.onrender.com
- **Frontend**: https://fitness-app-frontend.onrender.com

**Nota**: El plan gratuito de Render pone los servicios en "sleep" después de 15 minutos de inactividad. La primera request después de dormir puede tardar 30-60 segundos.

---

## 📞 Ayuda Adicional

- Documentación de Render: https://render.com/docs
- Soporte: https://render.com/support
- Status: https://status.render.com

**¡Felicidades por tu despliegue! 🎊**
