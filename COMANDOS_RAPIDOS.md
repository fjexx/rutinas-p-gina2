# ⚡ Comandos Rápidos

## 🚀 Despliegue

### Verificar antes de desplegar
```bash
node verificar-produccion.js
```

### Subir a GitHub (primera vez)
```bash
git init
git add .
git commit -m "Initial commit - Fitness App v1.0"
git branch -M main
git remote add origin https://github.com/tu-usuario/fitness-app.git
git push -u origin main
```

### Actualizar GitHub
```bash
git add .
git commit -m "Descripción de cambios"
git push
```

---

## 🔧 Desarrollo Local

### Iniciar Backend
```bash
cd backend
npm start
```

### Iniciar Backend (modo desarrollo)
```bash
cd backend
npm run dev
```

### Ver usuarios registrados
```bash
cd backend
npm run ver-usuarios
```

### Test de base de datos
```bash
cd backend
npm run test-db
```

---

## 🌐 URLs Útiles

### Local
- Frontend: `file:///ruta/a/frontend/index.html`
- Backend: `http://localhost:5001`
- Health Check: `http://localhost:5001/api/health`
- Test DB: `http://localhost:5001/api/test-db`

### Producción (después de desplegar)
- Frontend: `https://tu-app.vercel.app`
- Backend: `https://tu-app.railway.app`
- API Health: `https://tu-app.railway.app/api/health`

---

## 🔑 Generar JWT Secret
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

---

## 📦 Instalar Dependencias

### Backend
```bash
cd backend
npm install
```

### Instalar solo producción
```bash
cd backend
npm install --production
```

---

## 🐛 Debugging

### Ver logs del servidor
```bash
cd backend
npm run debug
```

### Verificar conexión MongoDB
```bash
cd backend
node test-connection.js
```

### Resetear password de usuario
```bash
cd backend
npm run reset-password
```

---

## 🧹 Limpieza

### Limpiar node_modules
```bash
cd backend
rm -rf node_modules
npm install
```

### Limpiar caché de npm
```bash
npm cache clean --force
```

---

## 📊 Estadísticas

### Ver tamaño del proyecto
```bash
# Windows
dir /s

# Linux/Mac
du -sh .
```

### Contar líneas de código
```bash
# Windows PowerShell
(Get-ChildItem -Recurse -Include *.js,*.html,*.css | Get-Content | Measure-Object -Line).Lines

# Linux/Mac
find . -name "*.js" -o -name "*.html" -o -name "*.css" | xargs wc -l
```

---

## 🔄 Actualizar Dependencias

### Ver dependencias desactualizadas
```bash
cd backend
npm outdated
```

### Actualizar dependencias
```bash
cd backend
npm update
```

### Actualizar a última versión
```bash
cd backend
npm install express@latest mongoose@latest
```

---

## 🎨 Frontend

### Abrir con Live Server (VS Code)
1. Instala extensión "Live Server"
2. Click derecho en `index.html`
3. "Open with Live Server"

### Minificar CSS (opcional)
```bash
npm install -g clean-css-cli
cleancss -o style.min.css style.css
```

### Minificar JS (opcional)
```bash
npm install -g terser
terser app.js -o app.min.js
```

---

## 📱 Testing en Móvil

### Obtener IP local
```bash
# Windows
ipconfig

# Linux/Mac
ifconfig
```

### Acceder desde móvil
1. Asegúrate de estar en la misma red WiFi
2. Abre: `http://TU_IP:5001` en el móvil

---

## 🔐 Seguridad

### Verificar variables de entorno
```bash
cd backend
cat .env
```

### Verificar que .env no esté en Git
```bash
git status
# .env NO debe aparecer
```

---

## 📝 Git Útiles

### Ver estado
```bash
git status
```

### Ver historial
```bash
git log --oneline
```

### Deshacer último commit (mantener cambios)
```bash
git reset --soft HEAD~1
```

### Ver diferencias
```bash
git diff
```

### Crear rama nueva
```bash
git checkout -b feature/nueva-funcionalidad
```

---

## 🎯 Atajos de Teclado (VS Code)

- `Ctrl + P` - Buscar archivo
- `Ctrl + Shift + P` - Paleta de comandos
- `Ctrl + B` - Toggle sidebar
- `Ctrl + J` - Toggle terminal
- `Ctrl + /` - Comentar línea
- `Alt + Shift + F` - Formatear documento

---

## 💡 Tips

### Reiniciar servidor automáticamente
```bash
cd backend
npm install -g nodemon
nodemon server.js
```

### Ver logs en tiempo real (producción)
- **Railway**: Dashboard → Logs
- **Render**: Dashboard → Logs
- **Vercel**: Dashboard → Deployments → View Logs

### Backup de base de datos
```bash
# Exportar
mongodump --uri="tu_mongodb_uri" --out=backup

# Importar
mongorestore --uri="tu_mongodb_uri" backup/
```

---

## 🆘 Ayuda Rápida

### Error: Cannot find module
```bash
cd backend
npm install
```

### Error: Port already in use
```bash
# Windows
netstat -ano | findstr :5001
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5001 | xargs kill
```

### Error: MongoDB connection
1. Verifica URI en .env
2. Verifica IP whitelist en MongoDB Atlas
3. Verifica conexión a internet

---

**💪 ¡Mantente productivo!**
