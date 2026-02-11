// Frontend Authentication System
const API_URL = window.CONFIG?.API_URL || 'http://localhost:5001/api';

// Authentication state management
let currentUser = null;
let authToken = localStorage.getItem('authToken');

// Initialize authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeAuth();
    setupAuthEventListeners();
});

// Initialize authentication state
async function initializeAuth() {
    if (authToken) {
        // Verificar si el token está expirado antes de usarlo
        const timeRemaining = getTokenTimeRemaining ? getTokenTimeRemaining(authToken) : 0;
        
        if (timeRemaining <= 0) {
            console.warn('⚠️ Token expirado detectado en localStorage, limpiando...');
            authToken = null;
            currentUser = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('currentUser');
        } else {
            // Cargar usuario guardado primero
            const savedUser = localStorage.getItem('currentUser');
            
            if (savedUser) {
                try {
                    currentUser = JSON.parse(savedUser);
                } catch (e) {
                    console.error('Error al parsear usuario guardado:', e);
                }
            }
        }
    }
    
    updateAuthUI();
    
    // Si el usuario está autenticado, navegar a su nivel y resaltar rutinas
    if (currentUser && authToken) {
        navigateToUserLevel();
    }
}

// Setup event listeners for authentication
function setupAuthEventListeners() {
    // Login button in navigation
    const loginNavBtn = document.getElementById('loginNavBtn');
    if (loginNavBtn) {
        loginNavBtn.addEventListener('click', showAuthModal);
    }

    // Auth modal close buttons
    const authModal = document.getElementById('authModal');
    if (authModal) {
        const closeBtn = authModal.querySelector('.auth-modal-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                hideAuthModal();
            });
        }
        
        // Close modal when clicking outside
        authModal.addEventListener('click', function(e) {
            if (e.target === authModal) {
                hideAuthModal();
            }
        });
    }

    // Form switch buttons
    const showRegisterBtn = document.getElementById('showRegisterForm');
    const showLoginBtn = document.getElementById('showLoginForm');
    
    showRegisterBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToRegisterForm();
    });
    
    showLoginBtn.addEventListener('click', function(e) {
        e.preventDefault();
        switchToLoginForm();
    });

    // Register form steps navigation
    const nextStep1Btn = document.getElementById('nextStep1');
    const nextStep2Btn = document.getElementById('nextStep2');
    const prevStep2Btn = document.getElementById('prevStep2');
    const prevStep3Btn = document.getElementById('prevStep3');
    
    if (nextStep1Btn) {
        nextStep1Btn.addEventListener('click', function() {
            // Validar paso 1
            const nombre = document.getElementById('registerName').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            
            if (!nombre || !email || !password) {
                showAuthMessage('Por favor completa todos los campos', 'error');
                return;
            }
            
            if (password.length < 6) {
                showAuthMessage('La contraseña debe tener al menos 6 caracteres', 'error');
                return;
            }
            
            // Ir al paso 2
            document.getElementById('registerStep1').style.display = 'none';
            document.getElementById('registerStep2').style.display = 'block';
            clearAuthMessage();
        });
    }
    
    if (nextStep2Btn) {
        nextStep2Btn.addEventListener('click', function() {
            // Validar paso 2
            const edad = document.getElementById('registerAge').value;
            const genero = document.getElementById('registerGender').value;
            const peso = document.getElementById('registerWeight').value;
            const altura = document.getElementById('registerHeight').value;
            
            if (!edad || !genero || !peso || !altura) {
                showAuthMessage('Por favor completa todos los campos obligatorios', 'error');
                return;
            }
            
            // Ir al paso 3
            document.getElementById('registerStep2').style.display = 'none';
            document.getElementById('registerStep3').style.display = 'block';
            clearAuthMessage();
        });
    }
    
    if (prevStep2Btn) {
        prevStep2Btn.addEventListener('click', function() {
            document.getElementById('registerStep2').style.display = 'none';
            document.getElementById('registerStep1').style.display = 'block';
        });
    }
    
    if (prevStep3Btn) {
        prevStep3Btn.addEventListener('click', function() {
            document.getElementById('registerStep3').style.display = 'none';
            document.getElementById('registerStep2').style.display = 'block';
        });
    }

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }

    // User menu dropdown
    const userMenuBtn = document.querySelector('.user-menu-btn');
    const userDropdown = document.querySelector('.user-dropdown');
    
    if (userMenuBtn && userDropdown) {
        userMenuBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            userDropdown.classList.toggle('active');
        });

        // Close dropdown when clicking outside
        document.addEventListener('click', function(e) {
            if (!e.target.closest('.user-dropdown')) {
                userDropdown.classList.remove('active');
            }
        });
    }
}

// Show authentication modal
function showAuthModal() {
    const authModal = document.getElementById('authModal');
    authModal.style.display = 'block';
    switchToLoginForm(); // Default to login form
}

// Hide authentication modal
function hideAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'none';
        clearAuthMessage();
        clearForms();
    }
}

// Switch to register form
function switchToRegisterForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalTitle = document.getElementById('authModalTitle');
    
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    modalTitle.textContent = 'Crear Cuenta';
    
    // Resetear a paso 1
    document.getElementById('registerStep1').style.display = 'block';
    document.getElementById('registerStep2').style.display = 'none';
    document.getElementById('registerStep3').style.display = 'none';
    
    clearAuthMessage();
}

// Switch to login form
function switchToLoginForm() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const modalTitle = document.getElementById('authModalTitle');
    
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    modalTitle.textContent = 'Iniciar Sesión';
    clearAuthMessage();
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!email || !password) {
        showAuthMessage('Por favor completa todos los campos', 'error');
        return;
    }

    try {
        showAuthMessage('Iniciando sesión...', 'info');
        
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.usuario;
            
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Iniciar sistema de renovación automática de token
            if (typeof startTokenRefreshSystem === 'function') {
                startTokenRefreshSystem();
            }
            
            showAuthMessage('¡Bienvenido de vuelta!', 'success');
            
            setTimeout(() => {
                hideAuthModal();
                updateAuthUI(); // Esto ya llama a updateGlobalProgressBar internamente
                
                // Disparar evento de login para que otras partes de la app reaccionen
                window.dispatchEvent(new Event('userLoggedIn'));
                
                // Navegar al nivel del usuario y resaltar rutinas recomendadas
                navigateToUserLevel();
                
                // Verificar si el perfil está completo
                checkProfileCompletion();
            }, 1500);
        } else {
            showAuthMessage(data.message || 'Error al iniciar sesión', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAuthMessage('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    }
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    const nombre = document.getElementById('registerName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const edad = parseInt(document.getElementById('registerAge').value);
    const genero = document.getElementById('registerGender').value;
    const peso = parseFloat(document.getElementById('registerWeight').value);
    const altura = parseInt(document.getElementById('registerHeight').value);
    const pesoObjetivo = document.getElementById('registerTargetWeight').value;
    const objetivo = document.getElementById('registerGoal').value;
    const nivel = document.getElementById('registerLevel').value;
    const diasDisponibles = parseInt(document.getElementById('registerDays').value);
    const tiempoDisponible = parseInt(document.getElementById('registerTime').value);
    
    // Validar paso 3
    if (!objetivo || !nivel || !diasDisponibles || !tiempoDisponible) {
        showAuthMessage('Por favor completa todos los campos', 'error');
        return;
    }

    try {
        showAuthMessage('Creando tu cuenta...', 'info');
        
        const requestBody = {
            nombre,
            email,
            password,
            edad,
            genero,
            peso,
            altura,
            objetivo,
            nivelActividad: nivel,
            diasDisponibles,
            tiempoDisponible
        };
        
        // Agregar peso objetivo si se proporcionó
        if (pesoObjetivo) {
            requestBody.pesoObjetivo = parseFloat(pesoObjetivo);
        }
        
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody)
        });

        const data = await response.json();

        if (data.success) {
            authToken = data.token;
            currentUser = data.usuario;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            showAuthMessage('¡Cuenta creada exitosamente!', 'success');
            
            setTimeout(() => {
                hideAuthModal();
                updateAuthUI();
                if (typeof updateGlobalProgressBar === 'function') {
                    updateGlobalProgressBar();
                }
                
                // Disparar evento de login para que otras partes de la app reaccionen
                window.dispatchEvent(new Event('userLoggedIn'));
                
                // Navegar al nivel del usuario y resaltar rutinas recomendadas
                navigateToUserLevel();
            }, 2500);
        } else {
            console.error('Registro fallido:', data.message);
            showAuthMessage(data.message || 'Error al crear la cuenta', 'error');
        }
    } catch (error) {
        console.error('Register error:', error);
        showAuthMessage('Error de conexión. Verifica que el servidor esté funcionando.', 'error');
    }
}


// Validate token with server
async function validateToken() {
    if (!authToken) {
        throw new Error('No token available');
    }

    try {
        const response = await fetch(`${API_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });

        // Si el servidor responde con 401, el token es inválido
        if (response.status === 401) {
            throw new Error('401: Token inválido o expirado');
        }

        const data = await response.json();

        if (data.success) {
            currentUser = data.usuario;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            console.log('Usuario validado:', currentUser);
            return data.usuario;
        } else {
            console.error('Validación fallida:', data.message);
            throw new Error(data.message || 'Token validation failed');
        }
    } catch (error) {
        console.error('Error en validateToken:', error);
        
        // Si es un error de red (no 401), mantener sesión
        if (error.message !== '401: Token inválido o expirado' && 
            (error.message === 'Failed to fetch' || error.name === 'TypeError')) {
            console.warn('Error de red, manteniendo token');
            // Usar datos del localStorage si existen
            const savedUser = localStorage.getItem('currentUser');
            if (savedUser) {
                try {
                    currentUser = JSON.parse(savedUser);
                    console.log('Usando usuario guardado:', currentUser);
                    return currentUser;
                } catch (e) {
                    console.error('Error al parsear usuario guardado');
                }
            }
        }
        throw error;
    }
}

// Logout user
function logout() {
    // Detener sistema de renovación de token
    if (typeof stopTokenRefreshSystem === 'function') {
        stopTokenRefreshSystem();
    }
    
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    updateAuthUI();
    
    // Show logout message
    showNotification('Sesión cerrada correctamente', 'info');
}

// Update authentication UI
function updateAuthUI() {
    const loginNavBtn = document.getElementById('loginNavBtn');
    const userMenuContainer = document.getElementById('userMenuContainer');
    const userNameDisplay = document.getElementById('userNameDisplay');
    const retakeQuizBtnContainer = document.getElementById('retakeQuizBtnContainer');

    if (currentUser && authToken) {
        // User is logged in
        if (loginNavBtn) loginNavBtn.style.display = 'none';
        if (userMenuContainer) userMenuContainer.style.display = 'block';
        if (userNameDisplay) userNameDisplay.textContent = currentUser.nombre;
        
        // Siempre mostrar botón de cuestionario para usuarios autenticados
        // Permite re-evaluar su nivel cuando quieran
        if (retakeQuizBtnContainer) {
            retakeQuizBtnContainer.classList.remove('hidden');
        }
        
        // Reset progress bar closed state and show it
        localStorage.removeItem('progressBarClosed');
        
        // Actualizar barra de progreso con un pequeño delay para asegurar que el token esté guardado
        if (typeof updateGlobalProgressBar === 'function') {
            setTimeout(() => {
                updateGlobalProgressBar();
            }, 500);
        }
    } else {
        // User is not logged in
        if (loginNavBtn) loginNavBtn.style.display = 'block';
        if (userMenuContainer) userMenuContainer.style.display = 'none';
        
        // Ocultar botón de cuestionario para usuarios no autenticados
        if (retakeQuizBtnContainer) {
            retakeQuizBtnContainer.classList.add('hidden');
        }
        
        // Hide progress bar
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.display = 'none';
        }
    }
}

// Show authentication message
function showAuthMessage(message, type = 'info') {
    const authMessage = document.getElementById('authMessage');
    authMessage.textContent = message;
    authMessage.className = `auth-message ${type}`;
    authMessage.style.display = 'block';
}

// Clear authentication message
function clearAuthMessage() {
    const authMessage = document.getElementById('authMessage');
    authMessage.style.display = 'none';
    authMessage.textContent = '';
}

// Clear form inputs
function clearForms() {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    
    if (loginForm) loginForm.reset();
    if (registerForm) {
        registerForm.reset();
        // Resetear a paso 1
        const step1 = document.getElementById('registerStep1');
        const step2 = document.getElementById('registerStep2');
        const step3 = document.getElementById('registerStep3');
        
        if (step1) step1.style.display = 'block';
        if (step2) step2.style.display = 'none';
        if (step3) step3.style.display = 'none';
    }
}

// Show notification (for logout and other messages)
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `auth-notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Get current user (utility function)
function getCurrentUser() {
    return currentUser;
}

// Update current user (utility function)
function updateCurrentUser(updates) {
    if (currentUser) {
        currentUser = { ...currentUser, ...updates };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        updateAuthUI();
        console.log('✅ Usuario actualizado:', currentUser);
    }
}

// Get auth token (utility function)
function getAuthToken() {
    return authToken;
}

// Check if user is authenticated (utility function)
function isAuthenticated() {
    return !!(currentUser && authToken);
}

// Make API request with authentication (utility function)
async function makeAuthenticatedRequest(url, options = {}) {
    if (!authToken) {
        throw new Error('No authentication token available');
    }

    const defaultOptions = {
        headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json',
        }
    };

    const mergedOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...options.headers
        }
    };

    const response = await fetch(url, mergedOptions);
    
    if (response.status === 401) {
        // Token expired or invalid
        console.error('❌ Token inválido (401) - Sesión expirada');
        
        // Cerrar sesión automáticamente
        logout();
        
        // Mostrar mensaje al usuario
        showNotification('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.', 'warning');
        
        // Abrir modal de login después de un momento
        setTimeout(() => {
            const authModal = document.getElementById('authModal');
            if (authModal) {
                authModal.style.display = 'block';
            }
        }, 1500);
        
        throw new Error('Authentication expired. Please login again.');
    }

    return response;
}

// Export functions for use in other scripts
window.authSystem = {
    getCurrentUser,
    updateCurrentUser,
    getAuthToken,
    isAuthenticated,
    makeAuthenticatedRequest,
    logout,
    showNotification
};


// Manejar modal de perfil
const profileLink = document.getElementById('profileLink');
const profileModal = document.getElementById('profileModal');
const profileModalClose = document.querySelector('.profile-modal-close');

if (profileLink) {
    profileLink.addEventListener('click', function(e) {
        e.preventDefault();
        showProfileModal();
    });
}

if (profileModalClose) {
    profileModalClose.addEventListener('click', function() {
        profileModal.style.display = 'none';
    });
}

function showProfileModal() {
    if (!currentUser) return;
    
    // Llenar el formulario con los datos actuales
    document.getElementById('profileName').value = currentUser.nombre || '';
    document.getElementById('profileEmail').value = currentUser.email || '';
    document.getElementById('profileLevel').value = currentUser.nivelActividad || 'principiante';
    
    // Datos físicos
    document.getElementById('profileAge').value = currentUser.edad || '';
    document.getElementById('profileGender').value = currentUser.genero || '';
    document.getElementById('profileWeight').value = currentUser.peso || '';
    document.getElementById('profileHeight').value = currentUser.altura || '';
    document.getElementById('profileTargetWeight').value = currentUser.pesoObjetivo || '';
    
    // Objetivos y preferencias
    document.getElementById('profileGoal').value = currentUser.objetivo || '';
    document.getElementById('profileDays').value = currentUser.diasDisponibles || '';
    document.getElementById('profileTime').value = currentUser.tiempoDisponible || '';
    
    // Cargar progreso semanal
    loadProfileProgress();
    
    profileModal.style.display = 'block';
}

// Función para cargar el progreso semanal en el perfil
async function loadProfileProgress() {
    try {
        const response = await makeAuthenticatedRequest(`${API_URL}/progress/semanal`);
        
        if (!response.ok) {
            console.warn('No se pudo cargar el progreso semanal');
            return;
        }
        
        const data = await response.json();
        
        if (data.success) {
            const weekly = data.progresoSemanal;
            const objectives = data.objetivos;
            
            // Actualizar rutinas
            const rutinasEl = document.getElementById('profileRutinasCompletadas');
            const rutinasObjEl = document.getElementById('profileRutinasObjetivo');
            const rutinasProgressEl = document.getElementById('profileRutinasProgress');
            
            if (rutinasEl) rutinasEl.textContent = weekly.rutinasCompletadas || 0;
            if (rutinasObjEl) rutinasObjEl.textContent = objectives.rutinasSemanales || 3;
            if (rutinasProgressEl) {
                const rutinasPercent = Math.min(100, (weekly.rutinasCompletadas / objectives.rutinasSemanales) * 100);
                rutinasProgressEl.style.width = rutinasPercent + '%';
            }
            
            // Actualizar minutos
            const minutosEl = document.getElementById('profileMinutosCompletados');
            const minutosObjEl = document.getElementById('profileMinutosObjetivo');
            const minutosProgressEl = document.getElementById('profileMinutosProgress');
            
            if (minutosEl) minutosEl.textContent = weekly.minutosEntrenados || 0;
            if (minutosObjEl) minutosObjEl.textContent = objectives.minutosSemanales || 150;
            if (minutosProgressEl) {
                const minutosPercent = Math.min(100, (weekly.minutosEntrenados / objectives.minutosSemanales) * 100);
                minutosProgressEl.style.width = minutosPercent + '%';
            }
            
            // Actualizar racha
            const statsResponse = await makeAuthenticatedRequest(`${API_URL}/progress/estadisticas`);
            if (statsResponse.ok) {
                const statsData = await statsResponse.json();
                if (statsData.success) {
                    const rachaEl = document.getElementById('profileRachaActual');
                    const rachaDiasEl = document.getElementById('profileRachaDias');
                    const racha = statsData.estadisticas.rachaActual || 0;
                    if (rachaEl) rachaEl.textContent = racha;
                    if (rachaDiasEl) rachaDiasEl.textContent = racha === 1 ? 'día' : 'días';
                }
            }
            
            // Calcular progreso general
            const rutinasPercent = Math.min(100, (weekly.rutinasCompletadas / objectives.rutinasSemanales) * 100);
            const minutosPercent = Math.min(100, (weekly.minutosEntrenados / objectives.minutosSemanales) * 100);
            const generalProgress = (rutinasPercent + minutosPercent) / 2;
            
            const progresoEl = document.getElementById('profileProgresoGeneral');
            const progresoProgressEl = document.getElementById('profileProgresoProgress');
            
            if (progresoEl) progresoEl.textContent = Math.round(generalProgress);
            if (progresoProgressEl) progresoProgressEl.style.width = generalProgress + '%';
        }
    } catch (error) {
        console.error('Error al cargar progreso en perfil:', error);
    }
}

// Manejar formulario de perfil
const profileForm = document.getElementById('profileForm');
if (profileForm) {
    profileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const nombre = document.getElementById('profileName').value;
        const nivel = document.getElementById('profileLevel').value;
        const edad = parseInt(document.getElementById('profileAge').value) || null;
        const genero = document.getElementById('profileGender').value || null;
        const peso = parseFloat(document.getElementById('profileWeight').value) || null;
        const altura = parseInt(document.getElementById('profileHeight').value) || null;
        const pesoObjetivo = parseFloat(document.getElementById('profileTargetWeight').value) || null;
        const objetivo = document.getElementById('profileGoal').value || null;
        const diasDisponibles = parseInt(document.getElementById('profileDays').value) || null;
        const tiempoDisponible = parseInt(document.getElementById('profileTime').value) || null;
        
        try {
            const requestBody = { 
                nombre, 
                nivelActividad: nivel 
            };
            
            // Agregar campos opcionales solo si tienen valor
            if (edad) requestBody.edad = edad;
            if (genero) requestBody.genero = genero;
            if (peso) requestBody.peso = peso;
            if (altura) requestBody.altura = altura;
            if (pesoObjetivo) requestBody.pesoObjetivo = pesoObjetivo;
            if (objetivo) requestBody.objetivo = objetivo;
            if (diasDisponibles) requestBody.diasDisponibles = diasDisponibles;
            if (tiempoDisponible) requestBody.tiempoDisponible = tiempoDisponible;
            
            const response = await makeAuthenticatedRequest(`${API_URL}/auth/profile`, {
                method: 'PUT',
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (data.success) {
                currentUser = data.usuario;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                document.getElementById('userNameDisplay').textContent = currentUser.nombre;
                showProfileMessage('Perfil actualizado correctamente', 'success');
                
                setTimeout(() => {
                    profileModal.style.display = 'none';
                }, 1500);
            } else {
                showProfileMessage(data.message || 'Error al actualizar perfil', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showProfileMessage('Error de conexión', 'error');
        }
    });
}

function showProfileMessage(message, type = 'info') {
    const profileMessage = document.getElementById('profileMessage');
    profileMessage.textContent = message;
    profileMessage.className = `auth-message ${type}`;
    profileMessage.style.display = 'block';
}

// Manejar modal de progreso
const progressLink = document.getElementById('progressLink');
const progressModal = document.getElementById('progressModal');
const progressModalClose = document.querySelector('.progress-modal-close');

if (progressLink) {
    progressLink.addEventListener('click', function(e) {
        e.preventDefault();
        // Reabrir la barra de progreso semanal
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.display = 'block';
            localStorage.removeItem('progressBarClosed');
            // Actualizar datos
            if (typeof updateGlobalProgressBar === 'function') {
                updateGlobalProgressBar();
            }
        }
        // Cerrar el menú dropdown si está abierto
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.classList.remove('active');
        }
    });
}

if (progressModalClose) {
    progressModalClose.addEventListener('click', function() {
        progressModal.style.display = 'none';
    });
}

async function showProgressModal() {
    if (!isAuthenticated()) {
        showNotification('Debes iniciar sesión para ver tu progreso', 'warning');
        return;
    }
    
    progressModal.style.display = 'block';
    
    try {
        // Cargar datos del usuario
        if (currentUser) {
            // Edad
            const edadEl = document.getElementById('userData-edad');
            if (edadEl) edadEl.textContent = currentUser.edad ? `${currentUser.edad} años` : 'No especificado';
            
            // Peso actual
            const pesoEl = document.getElementById('userData-peso');
            if (pesoEl) pesoEl.textContent = currentUser.peso ? `${currentUser.peso} kg` : 'No especificado';
            
            // Altura
            const alturaEl = document.getElementById('userData-altura');
            if (alturaEl) alturaEl.textContent = currentUser.altura ? `${currentUser.altura} cm` : 'No especificado';
            
            // Peso objetivo
            const pesoObjEl = document.getElementById('userData-pesoObjetivo');
            if (pesoObjEl) {
                if (currentUser.pesoObjetivo) {
                    const diferencia = currentUser.peso - currentUser.pesoObjetivo;
                    const texto = diferencia > 0 ? 
                        `${currentUser.pesoObjetivo} kg (faltan ${Math.abs(diferencia).toFixed(1)} kg)` :
                        diferencia < 0 ?
                        `${currentUser.pesoObjetivo} kg (faltan ${Math.abs(diferencia).toFixed(1)} kg)` :
                        `${currentUser.pesoObjetivo} kg (¡Objetivo alcanzado!)`;
                    pesoObjEl.textContent = texto;
                } else {
                    pesoObjEl.textContent = 'No especificado';
                }
            }
            
            // Calorías recomendadas (calcular en frontend)
            const caloriasEl = document.getElementById('userData-calorias');
            if (caloriasEl) {
                const calorias = calcularCaloriasRecomendadas(currentUser);
                caloriasEl.textContent = calorias ? `${calorias} kcal/día` : 'No calculado';
            }
            
            // Objetivo
            const objetivoEl = document.getElementById('userData-objetivo');
            if (objetivoEl) {
                const objetivos = {
                    'perder_peso': 'Perder peso',
                    'ganar_musculo': 'Ganar músculo',
                    'mantener_peso': 'Mantener peso',
                    'mejorar_resistencia': 'Mejorar resistencia',
                    'aumentar_flexibilidad': 'Aumentar flexibilidad',
                    'salud_general': 'Salud general'
                };
                objetivoEl.textContent = objetivos[currentUser.objetivo] || 'No especificado';
            }
            
            // Nivel
            const nivelEl = document.getElementById('userData-nivel');
            if (nivelEl) {
                const niveles = {
                    'principiante': 'Principiante',
                    'intermedio': 'Intermedio',
                    'avanzado': 'Avanzado'
                };
                nivelEl.textContent = niveles[currentUser.nivelActividad] || 'No especificado';
            }
            
            // Disponibilidad
            const disponibilidadEl = document.getElementById('userData-disponibilidad');
            if (disponibilidadEl) {
                const dias = currentUser.diasDisponibles || 'No especificado';
                const tiempo = currentUser.tiempoDisponible || 'No especificado';
                disponibilidadEl.textContent = `${dias} días/semana, ${tiempo} min/sesión`;
            }
        }
        
        // Obtener estadísticas
        const statsResponse = await makeAuthenticatedRequest(`${API_URL}/progress/estadisticas`);
        const statsData = await statsResponse.json();
        
        if (statsData.success) {
            const stats = statsData.estadisticas;
            const racha = stats.rachaActual || 0;
            document.getElementById('totalRoutines').textContent = stats.totalRutinas || 0;
            document.getElementById('currentStreak').textContent = racha;
            const streakLabel = document.getElementById('currentStreakLabel');
            if (streakLabel) streakLabel.textContent = racha === 1 ? 'día' : 'días';
            document.getElementById('totalMinutes').textContent = stats.totalMinutos || 0;
        }
        
        // Obtener progreso semanal
        const weeklyResponse = await makeAuthenticatedRequest(`${API_URL}/progress/semanal`);
        const weeklyData = await weeklyResponse.json();
        
        if (weeklyData.success) {
            const weekly = weeklyData.progresoSemanal;
            const objectives = weeklyData.objetivos;
            
            // Actualizar rutinas semanales
            const routinesPercent = Math.min(100, (weekly.rutinasCompletadas / objectives.rutinasSemanales) * 100);
            document.getElementById('weeklyRoutinesText').textContent = `${weekly.rutinasCompletadas}/${objectives.rutinasSemanales}`;
            document.getElementById('weeklyRoutinesFill').style.width = `${routinesPercent}%`;
            
            // Actualizar minutos semanales
            const minutesPercent = Math.min(100, (weekly.minutosEntrenados / objectives.minutosSemanales) * 100);
            document.getElementById('weeklyMinutesText').textContent = `${weekly.minutosEntrenados}/${objectives.minutosSemanales}`;
            document.getElementById('weeklyMinutesFill').style.width = `${minutesPercent}%`;
        }
    } catch (error) {
        console.error('Error al cargar progreso:', error);
        showNotification('Error al cargar el progreso', 'error');
    }
}

// Función auxiliar para calcular calorías recomendadas
function calcularCaloriasRecomendadas(usuario) {
    if (!usuario.peso || !usuario.altura || !usuario.edad || !usuario.genero) return null;
    
    let tmb; // Tasa Metabólica Basal
    
    if (usuario.genero === 'masculino') {
        tmb = 88.362 + (13.397 * usuario.peso) + (4.799 * usuario.altura) - (5.677 * usuario.edad);
    } else if (usuario.genero === 'femenino') {
        tmb = 447.593 + (9.247 * usuario.peso) + (3.098 * usuario.altura) - (4.330 * usuario.edad);
    } else {
        // Promedio para otros géneros
        const tmbM = 88.362 + (13.397 * usuario.peso) + (4.799 * usuario.altura) - (5.677 * usuario.edad);
        const tmbF = 447.593 + (9.247 * usuario.peso) + (3.098 * usuario.altura) - (4.330 * usuario.edad);
        tmb = (tmbM + tmbF) / 2;
    }
    
    // Factor de actividad según nivel
    let factorActividad = 1.2; // Sedentario
    if (usuario.nivelActividad === 'principiante') factorActividad = 1.375;
    if (usuario.nivelActividad === 'intermedio') factorActividad = 1.55;
    if (usuario.nivelActividad === 'avanzado') factorActividad = 1.725;
    
    const caloriasDiarias = Math.round(tmb * factorActividad);
    
    // Ajustar según objetivo
    if (usuario.objetivo === 'perder_peso') return caloriasDiarias - 500;
    if (usuario.objetivo === 'ganar_musculo') return caloriasDiarias + 300;
    return caloriasDiarias;
}

// Cerrar modales al hacer click fuera
window.addEventListener('click', function(event) {
    if (event.target === profileModal) {
        profileModal.style.display = 'none';
    }
    if (event.target === progressModal) {
        progressModal.style.display = 'none';
    }
});


// Actualizar barra de progreso global
async function updateGlobalProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    if (!isAuthenticated()) {
        if (progressBar) progressBar.style.display = 'none';
        return;
    }
    
    // Verificar que el token esté disponible
    if (!authToken) {
        console.log('No hay token disponible para actualizar barra de progreso');
        if (progressBar) progressBar.style.display = 'none';
        return;
    }
    
    try {
        console.log('Actualizando barra de progreso...');
        
        // Obtener estadísticas
        const statsResponse = await makeAuthenticatedRequest(`${API_URL}/progress/estadisticas`);
        
        // Verificar si la respuesta es exitosa antes de parsear
        if (!statsResponse.ok) {
            console.warn('Error al obtener estadísticas:', statsResponse.status);
            if (progressBar) progressBar.style.display = 'none';
            return;
        }
        
        const statsData = await statsResponse.json();
        
        // Obtener progreso semanal
        const weeklyResponse = await makeAuthenticatedRequest(`${API_URL}/progress/semanal`);
        
        if (!weeklyResponse.ok) {
            console.warn('Error al obtener progreso semanal:', weeklyResponse.status);
            if (progressBar) progressBar.style.display = 'none';
            return;
        }
        
        const weeklyData = await weeklyResponse.json();
        
        if (statsData.success && weeklyData.success) {
            const stats = statsData.estadisticas;
            const weekly = weeklyData.progresoSemanal;
            const objectives = weeklyData.objetivos;
            
            // Actualizar valores
            const rutinasCompletadas = document.getElementById('rutinasCompletadas');
            const rutinasObjetivo = document.getElementById('rutinasObjetivo');
            const minutosCompletados = document.getElementById('minutosCompletados');
            const minutosObjetivo = document.getElementById('minutosObjetivo');
            const rachaActual = document.getElementById('rachaActual');
            const progressPercentage = document.getElementById('progressPercentage');
            const progressFill = document.getElementById('progressFill');
            
            if (rutinasCompletadas) rutinasCompletadas.textContent = weekly.rutinasCompletadas || 0;
            if (rutinasObjetivo) rutinasObjetivo.textContent = objectives.rutinasSemanales || 3;
            if (minutosCompletados) minutosCompletados.textContent = weekly.minutosEntrenados || 0;
            if (minutosObjetivo) minutosObjetivo.textContent = objectives.minutosSemanales || 150;
            if (rachaActual) rachaActual.textContent = stats.rachaActual || 0;
            
            // Calcular progreso general
            const routinesPercent = Math.min(100, (weekly.rutinasCompletadas / objectives.rutinasSemanales) * 100);
            const minutesPercent = Math.min(100, (weekly.minutosEntrenados / objectives.minutosSemanales) * 100);
            const generalProgress = (routinesPercent + minutesPercent) / 2;
            
            if (progressPercentage) progressPercentage.textContent = Math.round(generalProgress) + '%';
            if (progressFill) progressFill.style.width = generalProgress + '%';
            
            // Mostrar la barra
            if (progressBar) progressBar.style.display = 'block';
            
            console.log('✅ Barra de progreso actualizada correctamente');
        }
    } catch (error) {
        console.error('❌ Error al actualizar barra de progreso:', error.message);
        // Si el error es de autenticación, ya se manejó en makeAuthenticatedRequest
        // Solo ocultar la barra de progreso
        if (progressBar) progressBar.style.display = 'none';
    }
}

// Cerrar barra de progreso
const closeProgressBarBtn = document.getElementById('closeProgressBar');
if (closeProgressBarBtn) {
    closeProgressBarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        e.stopPropagation();
        document.getElementById('progressBar').style.display = 'none';
        localStorage.setItem('progressBarClosed', 'true');
    });
}

// Reiniciar progreso semanal
const resetProgressBtn = document.getElementById('resetProgressBtn');
if (resetProgressBtn) {
    resetProgressBtn.addEventListener('click', async function(e) {
        e.preventDefault();
        e.stopPropagation();
        
        if (!isAuthenticated()) {
            showNotification('Debes iniciar sesión', 'warning');
            return;
        }
        
        // Confirmar acción
        const confirmar = confirm('¿Estás seguro de que quieres reiniciar tu progreso semanal? Esta acción no se puede deshacer.');
        
        if (!confirmar) return;
        
        try {
            const response = await makeAuthenticatedRequest(
                `${API_URL}/progress/reiniciar-semanal`,
                { method: 'POST' }
            );
            
            const data = await response.json();
            
            if (data.success) {
                showNotification('Progreso semanal reiniciado correctamente', 'success');
                
                // Desmarcar y habilitar todos los botones de rutinas completadas
                const completedButtons = document.querySelectorAll('.complete-routine-btn.completed');
                completedButtons.forEach(btn => {
                    btn.classList.remove('completed');
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Marcar como completada';
                    btn.disabled = false;
                    btn.style.cursor = 'pointer';
                    btn.style.opacity = '1';
                });
                
                // Desmarcar todos los ejercicios individuales completados
                const completedExercises = document.querySelectorAll('.exercise-item.completed');
                completedExercises.forEach(item => {
                    item.classList.remove('completed');
                    
                    // Restaurar botón de ejercicio
                    const btn = item.querySelector('.complete-exercise-btn');
                    if (btn) {
                        btn.classList.remove('completed');
                        btn.innerHTML = '<i class="fas fa-circle"></i> Marcar como completado';
                    }
                    
                    // Remover overlay de completado
                    const overlay = item.querySelector('.completion-overlay');
                    if (overlay) overlay.remove();
                });
                
                // Limpiar progreso local de ejercicios (usar la clave correcta)
                localStorage.removeItem('routineProgress');
                
                // Actualizar barras de progreso en modales abiertos
                const progressBars = document.querySelectorAll('.routine-progress-fill');
                const progressTexts = document.querySelectorAll('.progress-text');
                progressBars.forEach(bar => bar.style.width = '0%');
                progressTexts.forEach(text => text.textContent = '0 ejercicios completados');
                
                // Actualizar la barra de progreso global
                setTimeout(() => {
                    updateGlobalProgressBar();
                }, 500);
            } else {
                showNotification(data.message || 'Error al reiniciar progreso', 'error');
            }
        } catch (error) {
            console.error('Error al reiniciar progreso:', error);
            showNotification('Error al reiniciar progreso', 'error');
        }
    });
}

// Mostrar barra de progreso si el usuario está autenticado
if (isAuthenticated() && localStorage.getItem('progressBarClosed') !== 'true') {
    updateGlobalProgressBar();
}

// Exportar función para uso en otros scripts
window.updateGlobalProgressBar = updateGlobalProgressBar;


// Modal para completar perfil
const completeProfileModal = document.getElementById('completeProfileModal');
const completeProfileForm = document.getElementById('completeProfileForm');
const skipCompleteProfileBtn = document.getElementById('skipCompleteProfile');

// Función para verificar si el perfil está completo
function isProfileComplete(user) {
    // Verificar que existan los campos básicos requeridos
    const hasBasicInfo = user.edad && user.genero && user.peso && user.altura;
    const hasGoals = user.objetivo && user.diasDisponibles && user.tiempoDisponible;
    
    console.log('🔍 Verificando perfil completo:', {
        edad: user.edad,
        genero: user.genero,
        peso: user.peso,
        altura: user.altura,
        objetivo: user.objetivo,
        diasDisponibles: user.diasDisponibles,
        tiempoDisponible: user.tiempoDisponible,
        hasBasicInfo,
        hasGoals,
        isComplete: hasBasicInfo && hasGoals
    });
    
    return hasBasicInfo && hasGoals;
}

// Función para mostrar modal de completar perfil
function showCompleteProfileModal() {
    if (completeProfileModal) {
        completeProfileModal.style.display = 'block';
    }
}

// Función para ocultar modal de completar perfil
function hideCompleteProfileModal() {
    if (completeProfileModal) {
        completeProfileModal.style.display = 'none';
    }
}

// Verificar perfil después del login
function checkProfileCompletion() {
    // DESHABILITADO: No molestar al usuario con el modal de completar perfil
    // Puede completar su perfil desde el menú cuando quiera
    console.log('✅ Perfil cargado, usuario puede completarlo desde el menú si lo desea');
}

// Manejar formulario de completar perfil
if (completeProfileForm) {
    completeProfileForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const edad = parseInt(document.getElementById('completeAge').value);
        const genero = document.getElementById('completeGender').value;
        const peso = parseFloat(document.getElementById('completeWeight').value);
        const altura = parseInt(document.getElementById('completeHeight').value);
        const pesoObjetivo = parseFloat(document.getElementById('completeTargetWeight').value) || null;
        const objetivo = document.getElementById('completeGoal').value;
        const diasDisponibles = parseInt(document.getElementById('completeDays').value);
        const tiempoDisponible = parseInt(document.getElementById('completeTime').value);
        
        try {
            showCompleteProfileMessage('Guardando tu información...', 'info');
            
            const requestBody = {
                edad,
                genero,
                peso,
                altura,
                objetivo,
                diasDisponibles,
                tiempoDisponible
            };
            
            if (pesoObjetivo) {
                requestBody.pesoObjetivo = pesoObjetivo;
            }
            
            const response = await makeAuthenticatedRequest(`${API_URL}/auth/profile`, {
                method: 'PUT',
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (data.success) {
                currentUser = data.usuario;
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                showCompleteProfileMessage('¡Perfil completado exitosamente!', 'success');
                
                setTimeout(() => {
                    hideCompleteProfileModal();
                    showNotification('¡Perfil completado exitosamente!', 'success');
                    
                    // Actualizar barra de progreso
                    if (typeof updateGlobalProgressBar === 'function') {
                        updateGlobalProgressBar();
                    }
                }, 2000);
            } else {
                showCompleteProfileMessage(data.message || 'Error al guardar', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showCompleteProfileMessage('Error de conexión', 'error');
        }
    });
}

// Botón para omitir completar perfil
if (skipCompleteProfileBtn) {
    skipCompleteProfileBtn.addEventListener('click', function() {
        hideCompleteProfileModal();
        showNotification('Puedes completar tu perfil más tarde desde el menú', 'info');
    });
}

function showCompleteProfileMessage(message, type = 'info') {
    const completeProfileMessage = document.getElementById('completeProfileMessage');
    if (completeProfileMessage) {
        completeProfileMessage.textContent = message;
        completeProfileMessage.className = `auth-message ${type}`;
        completeProfileMessage.style.display = 'block';
    }
}

// Cerrar modal al hacer clic fuera
window.addEventListener('click', function(event) {
    if (event.target === completeProfileModal) {
        // No cerrar automáticamente, el usuario debe completar o omitir
        showNotification('Por favor completa tu perfil o haz clic en "Omitir por ahora"', 'info');
    }
});


// Botón de logout desde modal de completar perfil
const logoutFromCompleteBtn = document.getElementById('logoutFromComplete');
if (logoutFromCompleteBtn) {
    logoutFromCompleteBtn.addEventListener('click', function(e) {
        e.preventDefault();
        hideCompleteProfileModal();
        logout();
        showNotification('Sesión cerrada. Por favor inicia sesión nuevamente.', 'info');
        setTimeout(() => {
            showAuthModal();
        }, 500);
    });
}


// ============================================
// SISTEMA DE RENOVACIÓN AUTOMÁTICA DE TOKEN
// ============================================

let tokenRefreshInterval = null;

// Función para decodificar el token JWT y obtener la fecha de expiración
function decodeToken(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (error) {
        console.error('Error al decodificar token:', error);
        return null;
    }
}

// Función para obtener el tiempo restante del token en milisegundos
function getTokenTimeRemaining(token) {
    const decoded = decodeToken(token);
    if (!decoded || !decoded.exp) {
        return 0;
    }
    
    const expirationTime = decoded.exp * 1000; // Convertir a milisegundos
    const currentTime = Date.now();
    const timeRemaining = expirationTime - currentTime;
    
    return timeRemaining;
}

// Función para renovar el token
async function refreshToken() {
    if (!authToken) {
        console.log('No hay token para renovar');
        return false;
    }
    
    try {
        console.log('🔄 Renovando token...');
        
        const response = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${authToken}`,
                'Content-Type': 'application/json',
            }
        });
        
        const data = await response.json();
        
        if (data.success && data.token) {
            authToken = data.token;
            currentUser = data.usuario;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            console.log('✅ Token renovado exitosamente');
            
            // Mostrar notificación discreta
            showNotification('Sesión renovada automáticamente', 'success');
            
            return true;
        } else {
            console.error('❌ Error al renovar token:', data.message);
            return false;
        }
    } catch (error) {
        console.error('❌ Error al renovar token:', error);
        return false;
    }
}

// Función para iniciar el sistema de renovación automática
function startTokenRefreshSystem() {
    // DESHABILITADO: El token dura 7 días, no necesita renovación automática
    // Si el usuario necesita renovar, simplemente debe iniciar sesión nuevamente
    
    if (!authToken) {
        console.log('No hay token disponible');
        return;
    }
    
    const timeRemaining = getTokenTimeRemaining(authToken);
    const hoursRemaining = timeRemaining / (1000 * 60 * 60);
    const daysRemaining = hoursRemaining / 24;
    
    console.log(`✅ Token válido. Expira en ${daysRemaining.toFixed(1)} días (${hoursRemaining.toFixed(1)} horas)`);
    
    // Si el token ya expiró, cerrar sesión
    if (hoursRemaining <= 0) {
        console.error('❌ Token expirado, cerrando sesión...');
        logout();
        showNotification('Tu sesión ha expirado. Por favor inicia sesión nuevamente.', 'error');
    }
}

// Función para detener el sistema de renovación
function stopTokenRefreshSystem() {
    if (tokenRefreshInterval) {
        clearInterval(tokenRefreshInterval);
        tokenRefreshInterval = null;
        console.log('🛑 Sistema de renovación detenido');
    }
}

// Iniciar el sistema de renovación cuando se carga la página si hay token
if (authToken) {
    startTokenRefreshSystem();
}

// Exportar funciones para uso global (simplificado)
window.tokenRefreshSystem = {
    start: startTokenRefreshSystem,
    stop: stopTokenRefreshSystem,
    getTimeRemaining: () => {
        if (!authToken) return 0;
        return getTokenTimeRemaining(authToken);
    }
};

console.log('🔐 Sistema de verificación de token inicializado');



// Función para navegar al nivel del usuario y resaltar rutinas recomendadas
function navigateToUserLevel() {
    if (!currentUser || !currentUser.nivelActividad) {
        return;
    }
    
    const nivel = currentUser.nivelActividad; // principiante, intermedio, avanzado
    const objetivo = currentUser.objetivo; // perder_peso, ganar_musculo, etc.
    
    // Esperar un momento para que la página cargue
    setTimeout(() => {
        // Navegar a la sección del nivel del usuario
        const nivelSection = document.getElementById(nivel);
        
        if (nivelSection) {
            // Scroll suave a la sección
            const navbar = document.querySelector('.navbar');
            const navbarHeight = navbar ? navbar.offsetHeight : 80;
            const targetPosition = nivelSection.getBoundingClientRect().top + window.scrollY - navbarHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Actualizar nav activo
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${nivel}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Resaltar rutinas recomendadas según objetivo
            setTimeout(() => {
                highlightRecommendedRoutines(nivel, objetivo);
                showWelcomeNotification(nivel, objetivo);
            }, 800);
        }
    }, 500);
}

// Función para resaltar rutinas recomendadas según el objetivo
function highlightRecommendedRoutines(nivel, objetivo) {
    // Mapeo de objetivos a días recomendados por nivel
    const recomendaciones = {
        principiante: {
            perder_peso: ['lunes-cardio', 'miercoles-fuerza'],
            ganar_musculo: ['miercoles-fuerza', 'viernes-flex'],
            mantener_peso: ['lunes-cardio', 'viernes-flex'],
            mejorar_resistencia: ['lunes-cardio', 'miercoles-fuerza'],
            aumentar_flexibilidad: ['viernes-flex', 'lunes-cardio'],
            salud_general: ['lunes-cardio', 'miercoles-fuerza', 'viernes-flex']
        },
        intermedio: {
            perder_peso: ['lunes-superior', 'viernes-cardio-core'],
            ganar_musculo: ['lunes-superior', 'miercoles-inferior'],
            mantener_peso: ['lunes-superior', 'viernes-cardio-core'],
            mejorar_resistencia: ['viernes-cardio-core', 'miercoles-inferior'],
            aumentar_flexibilidad: ['viernes-cardio-core', 'lunes-superior'],
            salud_general: ['lunes-superior', 'miercoles-inferior', 'viernes-cardio-core']
        },
        avanzado: {
            perder_peso: ['lunes-push', 'viernes-legs-core', 'sabado-fullbody'],
            ganar_musculo: ['lunes-push', 'miercoles-pull', 'viernes-legs-core'],
            mantener_peso: ['lunes-push', 'miercoles-pull', 'sabado-fullbody'],
            mejorar_resistencia: ['sabado-fullbody', 'viernes-legs-core'],
            aumentar_flexibilidad: ['miercoles-pull', 'viernes-legs-core'],
            salud_general: ['lunes-push', 'miercoles-pull', 'viernes-legs-core', 'sabado-fullbody']
        }
    };
    
    const rutinasRecomendadas = recomendaciones[nivel]?.[objetivo] || [];
    
    // Resaltar las rutinas recomendadas
    rutinasRecomendadas.forEach(rutinaId => {
        const dayRoutine = document.querySelector(`.day-routine[data-routine-id="${rutinaId}"][data-level="${nivel}"]`);
        if (dayRoutine) {
            // Agregar clase de recomendado
            dayRoutine.classList.add('recommended-routine');
            
            // Agregar badge de recomendado
            if (!dayRoutine.querySelector('.recommended-badge')) {
                const badge = document.createElement('div');
                badge.className = 'recommended-badge';
                badge.innerHTML = '<i class="fas fa-star"></i> Recomendado para ti';
                dayRoutine.insertBefore(badge, dayRoutine.firstChild);
            }
        }
    });
}

// Función para mostrar notificación de bienvenida personalizada
function showWelcomeNotification(nivel, objetivo) {
    const niveles = {
        principiante: 'Principiante',
        intermedio: 'Intermedio',
        avanzado: 'Avanzado'
    };
    
    const objetivos = {
        perder_peso: 'perder peso',
        ganar_musculo: 'ganar músculo',
        mantener_peso: 'mantener tu peso',
        mejorar_resistencia: 'mejorar tu resistencia',
        aumentar_flexibilidad: 'aumentar tu flexibilidad',
        salud_general: 'mejorar tu salud general'
    };
    
    const nivelDisplay = niveles[nivel] || nivel;
    const objetivoDisplay = objetivos[objetivo] || 'alcanzar tus metas';
    
    const notification = document.createElement('div');
    notification.className = 'welcome-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-bullseye"></i>
            <div class="notification-text">
                <strong>¡Rutinas personalizadas!</strong>
                <p>Nivel ${nivelDisplay} - Objetivo: ${objetivoDisplay}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Mostrar notificación
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Ocultar notificación después de 5 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 5000);
}
