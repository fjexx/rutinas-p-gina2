# 🏋️ Fitness App - Rutinas de Ejercicios

Aplicación web completa de rutinas de ejercicios con seguimiento de progreso, autenticación de usuarios y sistema de objetivos personalizados.

![Estado](https://img.shields.io/badge/Estado-Producción-success)
![Versión](https://img.shields.io/badge/Versión-1.0.0-blue)
![Licencia](https://img.shields.io/badge/Licencia-MIT-green)

## ✨ Características

### 🎯 Funcionalidades Principales
- ✅ **Sistema de Autenticación Completo** (JWT + bcrypt)
- ✅ **Tres Niveles de Rutinas** (Principiante, Intermedio, Avanzado)
- ✅ **Cuestionario de Evaluación** para determinar tu nivel
- ✅ **Seguimiento de Progreso Semanal** con objetivos personalizados
- ✅ **Sistema de Rachas** para mantener la motivación
- ✅ **Perfil de Usuario Editable** con datos físicos y objetivos
- ✅ **Modal de Recomendación** para usuarios no autenticados
- ✅ **Animaciones Sutiles** y diseño moderno
- ✅ **100% Responsive** optimizado para móviles

### 🎨 Diseño
- Interfaz moderna con gradientes y efectos visuales
- Modo oscuro por defecto
- Animaciones sutiles y profesionales
- Accesibilidad (soporte para prefers-reduced-motion)
- Diseño responsive completo

### 🔒 Seguridad
- Autenticación JWT con tokens seguros
- Passwords hasheados con bcrypt (12 rounds)
- Validación de inputs en backend
- CORS configurado
- Variables de entorno protegidas

## 🚀 Demo

**Frontend**: [Próximamente]
**Backend API**: [Próximamente]

## 📸 Screenshots

[Agregar screenshots aquí]

## 🛠️ Tecnologías

### Frontend
- HTML5, CSS3, JavaScript ES6+
- Font Awesome 6 (iconos)
- Google Fonts (Inter)
- Vanilla JS (sin frameworks)

### Backend
- Node.js + Express.js
- MongoDB Atlas (base de datos)
- JWT (autenticación)
- bcrypt (encriptación)
- Mongoose (ODM)

## 📦 Instalación Local

### Pre-requisitos
- Node.js 18+ instalado
- Cuenta en MongoDB Atlas
- Git

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/tu-usuario/fitness-app.git
cd fitness-app
```

2. **Configurar Backend**
```bash
cd backend
npm install
cp .env.example .env
# Edita .env con tus credenciales
```

3. **Iniciar Backend**
```bash
npm start
# O para desarrollo:
npm run dev
```

4. **Abrir Frontend**
```bash
# Abre frontend/index.html en tu navegador
# O usa Live Server en VS Code
```

## 🌐 Despliegue en Producción

### Opción Recomendada: Vercel + Railway

**Ver guía completa**: [DEPLOY.md](DEPLOY.md)

**Resumen rápido**:
1. Sube tu código a GitHub
2. Despliega backend en Railway
3. Despliega frontend en Vercel
4. Actualiza `API_URL` en `frontend/config.js`

### Verificar antes de desplegar
```bash
node verificar-produccion.js
```

## 📁 Estructura del Proyecto

```
fitness-app/
├── frontend/
│   ├── index.html          # Página principal
│   ├── style.css           # Estilos principales
│   ├── auth.css            # Estilos de autenticación
│   ├── app.js              # Lógica principal
│   ├── auth.js             # Sistema de autenticación
│   ├── config.js           # Configuración
│   └── imgs/               # Imágenes
├── backend/
│   ├── server.js           # Servidor Express
│   ├── models/             # Modelos de MongoDB
│   ├── routes/             # Rutas de la API
│   ├── middleware/         # Middleware (auth)
│   └── package.json        # Dependencias
├── DEPLOY.md               # Guía de despliegue
├── CHECKLIST_PUBLICACION.md # Checklist completo
└── README.md               # Este archivo
```

## 🔧 Configuración

### Variables de Entorno (Backend)

Crea un archivo `.env` en la carpeta `backend/`:

```env
PORT=5001
NODE_ENV=production
MONGODB_URI=tu_uri_de_mongodb_atlas
JWT_SECRET=genera_uno_seguro_con_crypto
CORS_ORIGIN=*
BCRYPT_ROUNDS=12
JWT_EXPIRES_IN=7d
```

### Configuración del Frontend

Edita `frontend/config.js`:

```javascript
const CONFIG = {
    API_URL: 'https://tu-backend.com/api',  // Cambiar después de desplegar
    // ...
};
```

## 📚 API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual
- `PUT /api/auth/profile` - Actualizar perfil
- `PUT /api/auth/cuestionario` - Guardar cuestionario

### Progreso
- `GET /api/progress/semanal` - Obtener progreso semanal
- `GET /api/progress/estadisticas` - Obtener estadísticas
- `POST /api/progress/rutina` - Completar rutina
- `DELETE /api/progress/rutina/:id` - Desmarcar rutina
- `POST /api/progress/reiniciar` - Reiniciar progreso semanal

### Health Check
- `GET /api/health` - Verificar estado del servidor
- `GET /api/test-db` - Verificar conexión a BD

## 🧪 Testing

```bash
# Test de conexión a base de datos
cd backend
npm run test-db

# Ver usuarios registrados
npm run ver-usuarios
```

## 🤝 Contribuir

Las contribuciones son bienvenidas! Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más información.

## 👤 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- Email: tu@email.com

## 🙏 Agradecimientos

- Font Awesome por los iconos
- Google Fonts por la tipografía Inter
- MongoDB Atlas por la base de datos
- La comunidad de desarrolladores

## 📞 Soporte

Si tienes problemas o preguntas:
1. Revisa la [Guía de Despliegue](DEPLOY.md)
2. Revisa los [Issues](https://github.com/tu-usuario/fitness-app/issues)
3. Crea un nuevo Issue si es necesario

## 🗺️ Roadmap

- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Compartir en redes sociales
- [ ] Gráficas de progreso histórico
- [ ] Sistema de amigos
- [ ] Rutinas personalizadas con IA
- [ ] Integración con wearables

---

**⭐ Si te gusta este proyecto, dale una estrella en GitHub!**

**💪 ¡Mantente activo, mantente saludable!**
