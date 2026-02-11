// Enhanced fitness app with questionnaire and modal functionality
document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    if (hamburger) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // El botón de cuestionario se maneja completamente en auth.js a través de updateAuthUI()
    // No mostramos el cuestionario automáticamente, solo cuando el usuario inicie sesión
    // y haga clic en "Evaluar Nivel"
    
    // Update active nav link on scroll
    const sections = document.querySelectorAll('.routine-section');
    const updateActiveLink = () => {
        let current = '';
        const scrollPosition = window.scrollY + 150;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${current}`) {
                link.classList.add('active');
            }
        });
    };
    
    window.addEventListener('scroll', updateActiveLink);
    
    // Smooth scroll animation when scrolling (solo primera vez)
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('animated');
                observer.unobserve(entry.target); // Dejar de observar después de animar
            }
        });
    }, observerOptions);

    // Observe all routine sections
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Add hover effects to routine cards
    const routineCards = document.querySelectorAll('.routine-card');
    routineCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    // Add interactive day routines
    const dayRoutines = document.querySelectorAll('.day-routine');
    dayRoutines.forEach(routine => {
        routine.addEventListener('click', function() {
            this.style.transform = 'scale(1.02)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Lazy load images for better performance
    const images = document.querySelectorAll('.routine-image');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.complete) {
                    img.classList.add('loaded');
                } else {
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                observer.unobserve(img);
            }
        });
    }, { threshold: 0.1 });
    
    images.forEach(img => {
        imageObserver.observe(img);
        if (img.complete) {
            img.classList.add('loaded');
        }
    });

    // Enhanced tips animation on scroll
    const tipsElements = document.querySelectorAll('.tips');
    const tipsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting && !entry.target.classList.contains('tips-animated')) {
                // Add staggered delay for multiple tips
                setTimeout(() => {
                    entry.target.classList.add('tips-animated');
                    entry.target.style.animationDelay = '0s';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    tipsElements.forEach((tip, index) => {
        tip.style.animationDelay = `${index * 0.1}s`;
        tipsObserver.observe(tip);
        
        // Add interactive click effect
        tip.addEventListener('click', function() {
            this.style.transform = 'scale(1.05)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });

    // NAVIGATION - Enhanced system with level card functionality
    function smoothScrollTo(target) {
        const navbar = document.querySelector('.navbar');
        const navbarHeight = navbar ? navbar.offsetHeight : 80;
        const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    // Level card navigation
    const levelCards = document.querySelectorAll('.level-card');
    levelCards.forEach(card => {
        card.addEventListener('click', function() {
            const level = this.getAttribute('data-level');
            let targetId = '';
            
            switch(level) {
                case 'beginner':
                    targetId = 'principiante';
                    break;
                case 'intermediate':
                    targetId = 'intermedio';
                    break;
                case 'advanced':
                    targetId = 'avanzado';
                    break;
            }
            
            const targetSection = document.getElementById(targetId);
            if (targetSection) {
                // Update active nav link
                navLinks.forEach(l => l.classList.remove('active'));
                const activeLink = document.querySelector(`.nav-link[href="#${targetId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
                
                smoothScrollTo(targetSection);
            }
        });
    });

    // Click handler para todos los enlaces con #
    document.addEventListener('click', function(e) {
        const link = e.target.closest('a[href^="#"]');
        
        if (!link) return;
        
        e.preventDefault();
        
        const href = link.getAttribute('href');
        
        // Cerrar menú móvil si está abierto
        if (navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
        
        // Si es home o logo
        if (href === '#' || link.id === 'home-link') {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            navLinks.forEach(l => l.classList.remove('active'));
            return;
        }
        
        // Para otras secciones
        const targetId = href.replace('#', '');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            // Update active class
            navLinks.forEach(l => l.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="${href}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
            
            // Scroll to section
            smoothScrollTo(targetSection);
        }
    });

    console.log('💪 Rutinas de Ejercicio - Sitio cargado correctamente');
    
    // Scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.setAttribute('aria-label', 'Volver arriba');
    document.body.appendChild(scrollBtn);
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
        navLinks.forEach(l => l.classList.remove('active'));
    });

    // Add retake quiz button functionality
    if (retakeQuizBtn) {
        retakeQuizBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Close mobile menu if open
            if (navMenu && navMenu.classList.contains('active')) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
            }
            
            // Reset quiz state
            currentQuestion = 0;
            totalScore = 0;
            
            // Show questionnaire
            showQuestionnaire();
        });
    }
});

    // QUESTIONNAIRE SYSTEM
    const questions = [
        {
            question: "¿Con qué frecuencia realizas actividad física actualmente?",
            options: [
                { text: "Nunca (vida sedentaria)", points: 1 },
                { text: "1-2 veces por semana", points: 2 },
                { text: "3-4 veces por semana", points: 3 },
                { text: "5 o más veces por semana", points: 4 }
            ]
        },
        {
            question: "¿Cuántas flexiones de pecho puedes hacer sin parar con buena forma?",
            options: [
                { text: "No puedo hacer ninguna", points: 1 },
                { text: "1-10 flexiones", points: 2 },
                { text: "11-25 flexiones", points: 3 },
                { text: "Más de 25 flexiones", points: 4 }
            ]
        },
        {
            question: "¿Cuánto tiempo puedes mantener una plancha abdominal correctamente?",
            options: [
                { text: "Menos de 20 segundos o no puedo", points: 1 },
                { text: "20-45 segundos", points: 2 },
                { text: "45-90 segundos", points: 3 },
                { text: "Más de 90 segundos", points: 4 }
            ]
        },
        {
            question: "¿Cuántas sentadillas profundas puedes hacer seguidas con buena técnica?",
            options: [
                { text: "Menos de 10 o ninguna", points: 1 },
                { text: "10-20 sentadillas", points: 2 },
                { text: "21-35 sentadillas", points: 3 },
                { text: "Más de 35 sentadillas", points: 4 }
            ]
        },
        {
            question: "¿Puedes correr o trotar sin parar durante 15 minutos?",
            options: [
                { text: "No, me canso antes de 5 minutos", points: 1 },
                { text: "Sí, pero con dificultad", points: 2 },
                { text: "Sí, cómodamente", points: 3 },
                { text: "Sí, y puedo mantenerlo 30+ minutos", points: 4 }
            ]
        },
        {
            question: "¿Cuánto tiempo llevas entrenando de forma consistente?",
            options: [
                { text: "Nunca he entrenado regularmente", points: 1 },
                { text: "Menos de 3 meses", points: 2 },
                { text: "Entre 3 meses y 1 año", points: 3 },
                { text: "Más de 1 año", points: 4 }
            ]
        },
        {
            question: "¿Cómo te recuperas después de hacer ejercicio intenso?",
            options: [
                { text: "Me duele todo por varios días", points: 1 },
                { text: "Necesito 2-3 días para recuperarme", points: 2 },
                { text: "Me recupero en 1 día", points: 3 },
                { text: "Me recupero rápido, puedo entrenar al día siguiente", points: 4 }
            ]
        },
        {
            question: "¿Puedes hacer burpees (salto-plancha-salto) correctamente?",
            options: [
                { text: "No sé qué es eso o no puedo hacerlos", points: 1 },
                { text: "Puedo hacer 5-10 con esfuerzo", points: 2 },
                { text: "Puedo hacer 10-20 seguidos", points: 3 },
                { text: "Puedo hacer más de 20 sin problema", points: 4 }
            ]
        }
    ];

    let currentQuestion = 0;
    let totalScore = 0;

    function showQuestionnaire() {
        const modal = document.getElementById('questionnaireModal');
        modal.style.display = 'block';
        displayQuestion();
    }

    function displayQuestion() {
        const container = document.getElementById('questionContainer');
        const question = questions[currentQuestion];
        
        container.innerHTML = `
            <div class="question-card">
                <div class="question-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${((currentQuestion + 1) / questions.length) * 100}%"></div>
                    </div>
                    <span class="progress-text">Pregunta ${currentQuestion + 1} de ${questions.length}</span>
                </div>
                <h3 class="question-title">${question.question}</h3>
                <div class="options-container">
                    ${question.options.map((option, index) => `
                        <button class="option-btn" data-points="${option.points}">
                            <span class="option-text">${option.text}</span>
                        </button>
                    `).join('')}
                </div>
            </div>
        `;

        // Add click handlers to options
        const optionBtns = container.querySelectorAll('.option-btn');
        optionBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                // Remove active class from all buttons
                optionBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                this.classList.add('active');
                
                // Enable next button
                const nextBtn = document.getElementById('nextBtn');
                const finishBtn = document.getElementById('finishBtn');
                
                if (currentQuestion === questions.length - 1) {
                    nextBtn.style.display = 'none';
                    finishBtn.style.display = 'inline-block';
                } else {
                    nextBtn.style.display = 'inline-block';
                    finishBtn.style.display = 'none';
                }
                
                nextBtn.disabled = false;
                finishBtn.disabled = false;
            });
        });

        // Update button states
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const finishBtn = document.getElementById('finishBtn');
        
        prevBtn.style.display = currentQuestion > 0 ? 'inline-block' : 'none';
        nextBtn.style.display = currentQuestion < questions.length - 1 ? 'inline-block' : 'none';
        finishBtn.style.display = currentQuestion === questions.length - 1 ? 'inline-block' : 'none';
        
        nextBtn.disabled = true;
        finishBtn.disabled = true;
    }

    // Questionnaire navigation
    document.getElementById('nextBtn').addEventListener('click', function() {
        const activeOption = document.querySelector('.option-btn.active');
        if (activeOption) {
            totalScore += parseInt(activeOption.getAttribute('data-points'));
            currentQuestion++;
            displayQuestion();
        }
    });

    document.getElementById('prevBtn').addEventListener('click', function() {
        if (currentQuestion > 0) {
            currentQuestion--;
            displayQuestion();
        }
    });

    document.getElementById('finishBtn').addEventListener('click', function() {
        const activeOption = document.querySelector('.option-btn.active');
        if (activeOption) {
            totalScore += parseInt(activeOption.getAttribute('data-points'));
            calculateLevel();
        }
    });

    function calculateLevel() {
        let level = '';
        let levelDisplay = '';
        let targetSection = '';
        let message = '';
        let tips = '';
        
        // Rangos ajustados para 8 preguntas (8-32 puntos)
        if (totalScore <= 14) {
            level = 'principiante';
            levelDisplay = 'Principiante';
            targetSection = 'principiante';
            message = '¡Perfecto para empezar tu viaje fitness!';
            tips = 'Enfócate en aprender la forma correcta de cada ejercicio y construir consistencia. Empieza con rutinas cortas de 30 minutos.';
        } else if (totalScore <= 23) {
            level = 'intermedio';
            levelDisplay = 'Intermedio';
            targetSection = 'intermedio';
            message = '¡Tienes una buena base para crecer!';
            tips = 'Es hora de aumentar la intensidad y agregar más variedad a tus entrenamientos. Apunta a 45 minutos por sesión.';
        } else {
            level = 'avanzado';
            levelDisplay = 'Avanzado';
            targetSection = 'avanzado';
            message = '¡Estás listo para desafíos intensos!';
            tips = 'Mantén la intensidad alta y enfócate en técnicas avanzadas y variaciones complejas. Sesiones de 60+ minutos.';
        }

        // Show result with login invitation
        const container = document.getElementById('questionContainer');
        const isAuthenticated = window.authSystem && window.authSystem.isAuthenticated();
        
        container.innerHTML = `
            <div class="results-card">
                <div class="results-icon">
                    <i class="fas fa-trophy"></i>
                </div>
                <h3>Tu nivel es: <span class="level-result">${levelDisplay}</span></h3>
                <p class="results-message">${message}</p>
                <p class="results-tips"><i class="fas fa-lightbulb"></i> ${tips}</p>
                
                ${!isAuthenticated ? `
                    <div class="login-invitation">
                        <div class="invitation-icon">
                            <i class="fas fa-user-plus"></i>
                        </div>
                        <h4>¡Guarda tu progreso!</h4>
                        <p>Crea una cuenta para:</p>
                        <ul class="benefits-list">
                            <li><i class="fas fa-check"></i> Seguir tu progreso semanal</li>
                            <li><i class="fas fa-check"></i> Registrar rutinas completadas</li>
                            <li><i class="fas fa-check"></i> Ver tus estadísticas</li>
                            <li><i class="fas fa-check"></i> Mantener tu racha activa</li>
                        </ul>
                        <button class="btn-login-invite" id="loginInviteBtn">
                            <i class="fas fa-sign-in-alt"></i>
                            Iniciar Sesión o Registrarse
                        </button>
                    </div>
                ` : ''}
                
                <p class="auto-redirect-message">
                    <i class="fas fa-arrow-right"></i>
                    Llevándote a tu sección en 5 segundos...
                </p>
            </div>
        `;

        // Add event listener for login button if not authenticated
        if (!isAuthenticated) {
            const loginBtn = document.getElementById('loginInviteBtn');
            if (loginBtn) {
                loginBtn.addEventListener('click', function() {
                    // Close questionnaire modal
                    document.getElementById('questionnaireModal').style.display = 'none';
                    // Open auth modal
                    if (window.authSystem) {
                        const authModal = document.getElementById('authModal');
                        if (authModal) {
                            authModal.style.display = 'block';
                        }
                    }
                });
            }
        }

        // Hide navigation buttons during auto-redirect
        document.getElementById('prevBtn').style.display = 'none';
        document.getElementById('nextBtn').style.display = 'none';
        document.getElementById('finishBtn').style.display = 'none';

        // Save assessment locally
        localStorage.setItem('fitnessLevelAssessed', 'true');
        localStorage.setItem('fitnessLevel', level);
        localStorage.setItem('quizCompleted', 'true'); // Marcar que completó el cuestionario
        
        // Ocultar el botón de "Evaluar Nivel" después de la categorización
        const quizBtn = document.getElementById('retakeQuizBtn');
        if (quizBtn) {
            quizBtn.style.display = 'none';
        }
        
        // Guardar estadísticas del cuestionario
        saveQuestionnaireStats(totalScore, level);

        // Save to backend if user is authenticated - CORREGIDO: pasar 'level' no 'targetSection'
        saveQuestionnaireResult(totalScore, level).then(() => {
            // Auto-navigate after showing result for 2 seconds
            setTimeout(() => {
                const modal = document.getElementById('questionnaireModal');
                modal.style.display = 'none';
                
                // Navigate to recommended section
                const targetSectionElement = document.getElementById(targetSection);
                if (targetSectionElement) {
                    // Update active nav link
                    const navLinks = document.querySelectorAll('.nav-link');
                    navLinks.forEach(l => l.classList.remove('active'));
                    const activeLink = document.querySelector(`.nav-link[href="#${targetSection}"]`);
                    if (activeLink) {
                        activeLink.classList.add('active');
                    }
                    
                    // Smooth scroll to section
                    const navbar = document.querySelector('.navbar');
                    const navbarHeight = navbar ? navbar.offsetHeight : 80;
                    const targetPosition = targetSectionElement.getBoundingClientRect().top + window.scrollY - navbarHeight - 10;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    // Show a brief notification
                    showLevelRecommendationNotification(levelDisplay, targetSection);
                }
            }, 2500);
        });
    }

    // Function to save questionnaire result to backend
    async function saveQuestionnaireResult(puntuacion, nivelCalculado) {
        // Check if user is authenticated
        if (!window.authSystem || !window.authSystem.isAuthenticated()) {
            console.log('Usuario no autenticado, solo guardando localmente');
            return;
        }

        try {
            console.log('📤 Guardando cuestionario en servidor...', { puntuacion, nivelCalculado });
            
            const response = await window.authSystem.makeAuthenticatedRequest(
                `${window.CONFIG?.API_URL || 'http://localhost:5001/api'}/auth/cuestionario`,
                {
                    method: 'PUT',
                    body: JSON.stringify({
                        puntuacion: puntuacion,
                        nivelCalculado: nivelCalculado
                    })
                }
            );

            const data = await response.json();
            console.log('📥 Respuesta del servidor:', data);
            
            if (data.success && data.usuario) {
                console.log('✅ Cuestionario guardado. Usuario actualizado:', data.usuario);
                
                // Actualizar con los datos completos del servidor
                if (window.authSystem.updateCurrentUser) {
                    window.authSystem.updateCurrentUser({
                        nivelActividad: data.usuario.nivelActividad,
                        cuestionarioCompletado: data.usuario.cuestionarioCompletado,
                        puntuacionCuestionario: puntuacion
                    });
                }
            } else {
                console.warn('⚠️ No se pudo guardar el cuestionario:', data.message);
            }
        } catch (error) {
            console.error('❌ Error al guardar cuestionario:', error);
        }
    }

    // Show level recommendation notification
    function showLevelRecommendationNotification(level, section) {
        const notification = document.createElement('div');
        notification.className = 'level-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>Nivel ${level} - ¡Aquí están tus rutinas recomendadas!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Hide notification after 4 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 4000);
    }

    // EXERCISE MODAL SYSTEM
    const exerciseData = {
        'lunes-cardio': {
            title: 'Lunes - Cardio Ligero',
            waterIntake: '500-750ml durante la sesión',
            exercises: [
                {
                    name: 'Caminata rápida',
                    duration: '20 minutos',
                    description: 'Mantén un ritmo constante que te permita conversar pero que sientas que trabajas.',
                    tips: 'Usa calzado cómodo y mantén una postura erguida.',
                    video: 'https://www.youtube.com/embed/RrphLKih470'
                },
                {
                    name: 'Estiramientos',
                    duration: '10 minutos',
                    description: 'Estira todos los grupos musculares principales, especialmente piernas y espalda.',
                    tips: 'Mantén cada estiramiento por 15-30 segundos sin rebotes.',
                    video: 'https://www.youtube.com/embed/L_xrDAtykMI'
                },
                {
                    name: 'Ejercicios de respiración',
                    duration: '5 minutos',
                    description: 'Respiración profunda para relajar y oxigenar el cuerpo.',
                    tips: 'Inhala por 4 segundos, mantén por 4, exhala por 6.',
                    video: 'https://www.youtube.com/embed/DbDoBzGY3vo'
                }
            ]
        },
        'miercoles-fuerza': {
            title: 'Miércoles - Fuerza Básica',
            waterIntake: '400-600ml durante la sesión',
            exercises: [
                {
                    name: 'Sentadillas',
                    reps: '3 series x 10 repeticiones',
                    description: 'Baja como si te fueras a sentar en una silla, mantén la espalda recta.',
                    tips: 'Las rodillas no deben pasar la punta de los pies.',
                    video: 'https://www.youtube.com/embed/aclHkVaku9U'
                },
                {
                    name: 'Flexiones de rodillas',
                    reps: '3 series x 8 repeticiones',
                    description: 'Flexiones modificadas apoyando las rodillas en el suelo.',
                    tips: 'Mantén el cuerpo en línea recta desde las rodillas hasta la cabeza.',
                    video: 'https://www.youtube.com/embed/8XQ-okb5NWE'
                },
                {
                    name: 'Plancha',
                    reps: '3 series x 20 segundos',
                    description: 'Mantén el cuerpo rígido como una tabla, apoyado en antebrazos y pies.',
                    tips: 'No dejes caer las caderas ni las levantes demasiado.',
                    video: 'https://www.youtube.com/embed/B296mZDhrP4'
                },
                {
                    name: 'Abdominales',
                    reps: '3 series x 10 repeticiones',
                    description: 'Acostado boca arriba, eleva el torso hacia las rodillas.',
                    tips: 'No tires del cuello, el movimiento debe venir del abdomen.',
                    video: 'https://www.youtube.com/embed/1fbU_MkV7NE'
                }
            ]
        },
        'viernes-flex': {
            title: 'Viernes - Flexibilidad',
            waterIntake: '300-500ml durante la sesión',
            exercises: [
                {
                    name: 'Yoga básico',
                    duration: '25 minutos',
                    description: 'Secuencia de posturas básicas de yoga para mejorar flexibilidad.',
                    tips: 'Respira profundamente y no fuerces las posturas.',
                    video: 'https://www.youtube.com/embed/v7AYKMP6rOE'
                },
                {
                    name: 'Estiramientos completos',
                    duration: '15 minutos',
                    description: 'Rutina completa de estiramientos para todo el cuerpo.',
                    tips: 'Mantén cada posición y siente el estiramiento sin dolor.',
                    video: 'https://www.youtube.com/embed/g_tea8ZNk5A'
                },
                {
                    name: 'Relajación',
                    duration: '10 minutos',
                    description: 'Tiempo de relajación y meditación para terminar la sesión.',
                    tips: 'Encuentra una posición cómoda y enfócate en tu respiración.',
                    video: 'https://www.youtube.com/embed/inpok4MKVLM'
                }
            ]
        }
    };

    // Add more exercise data for intermediate and advanced levels
    Object.assign(exerciseData, {
        'lunes-superior': {
            title: 'Lunes - Tren Superior',
            waterIntake: '600-800ml durante la sesión',
            exercises: [
                {
                    name: 'Flexiones',
                    reps: '4 series x 15 repeticiones',
                    description: 'Flexiones completas manteniendo el cuerpo recto.',
                    tips: 'Baja hasta que el pecho casi toque el suelo.',
                    video: 'https://www.youtube.com/embed/IODxDxX7oi4'
                },
                {
                    name: 'Fondos en silla',
                    reps: '4 series x 12 repeticiones',
                    description: 'Usando una silla estable, baja y sube el cuerpo con los brazos.',
                    tips: 'Mantén los codos cerca del cuerpo.',
                    video: 'https://www.youtube.com/embed/0326dy_-CzM'
                },
                {
                    name: 'Plancha lateral',
                    reps: '3 series x 45 segundos cada lado',
                    description: 'Plancha de lado apoyado en un antebrazo.',
                    tips: 'Mantén el cuerpo en línea recta lateral.',
                    video: 'https://www.youtube.com/embed/K2VljzCC16g'
                },
                {
                    name: 'Remo con peso',
                    reps: '3 series x 12 repeticiones',
                    description: 'Usando botellas de agua o mancuernas, simula el movimiento de remo.',
                    tips: 'Aprieta los omóplatos al tirar hacia atrás.',
                    video: 'https://www.youtube.com/embed/roCP6wCXPqo'
                }
            ]
        },
        'miercoles-inferior': {
            title: 'Miércoles - Tren Inferior',
            waterIntake: '600-800ml durante la sesión',
            exercises: [
                {
                    name: 'Sentadillas',
                    reps: '4 series x 15 repeticiones',
                    description: 'Sentadillas completas con mayor profundidad.',
                    tips: 'Baja hasta que los muslos estén paralelos al suelo.',
                    video: 'https://www.youtube.com/embed/aclHkVaku9U'
                },
                {
                    name: 'Zancadas',
                    reps: '3 series x 12 cada pierna',
                    description: 'Paso largo hacia adelante, baja la rodilla trasera.',
                    tips: 'Mantén el torso erguido durante todo el movimiento.',
                    video: 'https://www.youtube.com/embed/QOVaHwm-Q6U'
                },
                {
                    name: 'Elevaciones de talón',
                    reps: '4 series x 20 repeticiones',
                    description: 'Ponte de puntillas y baja lentamente.',
                    tips: 'Contrae los gemelos en la parte superior del movimiento.',
                    video: 'https://www.youtube.com/embed/gwLzBJYoWlI'
                },
                {
                    name: 'Puente de glúteos',
                    reps: '3 series x 15 repeticiones',
                    description: 'Acostado boca arriba, eleva las caderas.',
                    tips: 'Aprieta los glúteos en la parte superior.',
                    video: 'https://www.youtube.com/embed/wPM8icPu6H8'
                }
            ]
        },
        'viernes-cardio-core': {
            title: 'Viernes - Cardio y Core',
            exercises: [
                {
                    name: 'HIIT',
                    duration: '20 minutos (30 seg on / 30 seg off)',
                    description: 'Intervalos de alta intensidad alternando con descanso.',
                    tips: 'Da todo en los 30 segundos de trabajo.',
                    video: 'https://www.youtube.com/embed/ml6cT4AZdqI'
                },
                {
                    name: 'Abdominales variados',
                    reps: '4 series x 20 repeticiones',
                    description: 'Diferentes tipos de abdominales: normales, bicicleta, oblicuos.',
                    tips: 'Varía el tipo de abdominal en cada serie.',
                    video: 'https://www.youtube.com/embed/9FGilxCbdz8'
                },
                {
                    name: 'Plancha completa',
                    reps: '4 series x 60 segundos',
                    description: 'Plancha tradicional manteniendo la posición.',
                    tips: 'Respira normalmente durante la plancha.',
                    video: 'https://www.youtube.com/embed/B296mZDhrP4'
                },
                {
                    name: 'Mountain climbers',
                    reps: '3 series x 30 repeticiones',
                    description: 'En posición de plancha, alterna llevando las rodillas al pecho.',
                    tips: 'Mantén las caderas estables durante el movimiento.',
                    video: 'https://www.youtube.com/embed/nmwgirgXLYM'
                }
            ]
        }
    });

    // Add advanced level exercises
    Object.assign(exerciseData, {
        'lunes-push': {
            title: 'Lunes - Push (Empuje)',
            exercises: [
                {
                    name: 'Flexiones con palmada',
                    reps: '4 series x 10 repeticiones',
                    description: 'Flexiones explosivas con palmada en el aire.',
                    tips: 'Aterriza suavemente y mantén el control.',
                    video: 'https://www.youtube.com/embed/zmQ3D6BKyqE'
                },
                {
                    name: 'Fondos avanzados',
                    reps: '5 series x 15 repeticiones',
                    description: 'Fondos en paralelas o sillas con mayor profundidad.',
                    tips: 'Baja hasta sentir estiramiento en el pecho.',
                    video: 'https://www.youtube.com/embed/0326dy_-CzM'
                },
                {
                    name: 'Plancha con elevación',
                    reps: '4 series x 20 repeticiones',
                    description: 'Plancha alternando elevación de brazos y piernas.',
                    tips: 'Mantén la estabilidad del core durante el movimiento.',
                    video: 'https://www.youtube.com/embed/Sbs64vZAqRE'
                },
                {
                    name: 'Pike push-ups',
                    reps: '4 series x 12 repeticiones',
                    description: 'Flexiones en posición de V invertida.',
                    tips: 'Enfócate en trabajar los hombros.',
                    video: 'https://www.youtube.com/embed/XckEEwa1BPI'
                }
            ]
        },
        'miercoles-pull': {
            title: 'Miércoles - Pull (Jalón)',
            exercises: [
                {
                    name: 'Dominadas',
                    reps: '5 series x máximo',
                    description: 'Dominadas completas o asistidas según tu nivel.',
                    tips: 'Si no puedes hacer dominadas completas, usa una banda elástica.',
                    video: 'https://www.youtube.com/embed/eGo4IYlbE5g'
                },
                {
                    name: 'Remo invertido',
                    reps: '4 series x 15 repeticiones',
                    description: 'Colgado de una barra baja, tira del cuerpo hacia arriba.',
                    tips: 'Mantén el cuerpo recto durante todo el movimiento.',
                    video: 'https://www.youtube.com/embed/hXTc1mDnZCw'
                },
                {
                    name: 'Superman',
                    reps: '4 series x 20 repeticiones',
                    description: 'Boca abajo, eleva pecho y piernas simultáneamente.',
                    tips: 'Mantén la posición por 2 segundos en la parte superior.',
                    video: 'https://www.youtube.com/embed/cc6UVRS7PW4'
                },
                {
                    name: 'Plancha lateral avanzada',
                    reps: '3 series x 60 segundos',
                    description: 'Plancha lateral con elevación de pierna superior.',
                    tips: 'Mantén las caderas elevadas durante todo el ejercicio.',
                    video: 'https://www.youtube.com/embed/K2VljzCC16g'
                }
            ]
        },
        'viernes-legs-core': {
            title: 'Viernes - Legs y Core',
            exercises: [
                {
                    name: 'Sentadillas con salto',
                    reps: '5 series x 15 repeticiones',
                    description: 'Sentadillas explosivas con salto vertical.',
                    tips: 'Aterriza suavemente y controla el descenso.',
                    video: 'https://www.youtube.com/embed/A-cFYWvaHr0'
                },
                {
                    name: 'Zancadas con salto',
                    reps: '4 series x 12 cada pierna',
                    description: 'Zancadas alternando piernas con salto.',
                    tips: 'Cambia de pierna en el aire durante el salto.',
                    video: 'https://www.youtube.com/embed/Gd4H2uKDHIg'
                },
                {
                    name: 'Pistol squats',
                    reps: '3 series x 8 cada pierna',
                    description: 'Sentadillas a una pierna con la otra extendida.',
                    tips: 'Usa apoyo si es necesario hasta dominar el movimiento.',
                    video: 'https://www.youtube.com/embed/qDcniqddTeE'
                },
                {
                    name: 'Core completo',
                    duration: '25 minutos',
                    description: 'Rutina completa de ejercicios de core variados.',
                    tips: 'Incluye abdominales, oblicuos, y ejercicios de estabilidad.',
                    video: 'https://www.youtube.com/embed/DHD1-2P94DI'
                }
            ]
        },
        'sabado-fullbody': {
            title: 'Sábado - Full Body',
            exercises: [
                {
                    name: 'Burpees',
                    reps: '20 repeticiones por ronda',
                    description: 'Movimiento completo: sentadilla, plancha, flexión, salto.',
                    tips: 'Mantén un ritmo constante durante todo el circuito.',
                    video: 'https://www.youtube.com/embed/JZQA08SlJnM'
                },
                {
                    name: 'Mountain climbers',
                    reps: '30 repeticiones por ronda',
                    description: 'Rodillas al pecho alternadas en posición de plancha.',
                    tips: 'Mantén las caderas estables y el core activado.',
                    video: 'https://www.youtube.com/embed/nmwgirgXLYM'
                },
                {
                    name: 'Jump squats',
                    reps: '15 repeticiones por ronda',
                    description: 'Sentadillas con salto explosivo.',
                    tips: 'Aterriza en posición de sentadilla para la siguiente repetición.',
                    video: 'https://www.youtube.com/embed/A-cFYWvaHr0'
                },
                {
                    name: 'Plancha',
                    duration: '60 segundos por ronda',
                    description: 'Mantén la posición de plancha durante todo el tiempo.',
                    tips: 'Si no puedes completar 60 segundos, descansa y continúa.',
                    video: 'https://www.youtube.com/embed/B296mZDhrP4'
                }
            ]
        }
    });

    // Make exerciseData globally accessible
    window.exerciseData = exerciseData;

    // MODAL FUNCTIONALITY - FIXED
    const modal = document.getElementById('exerciseModal');
    const individualModal = document.getElementById('individualExerciseModal');
    const authModal = document.getElementById('authModal');
    
    // Function to close all modals
    function closeAllModals() {
        if (modal) modal.style.display = 'none';
        if (individualModal) individualModal.style.display = 'none';
        if (authModal) authModal.style.display = 'none';
        const questionnaireModal = document.getElementById('questionnaireModal');
        if (questionnaireModal) questionnaireModal.style.display = 'none';
    }
    
    // Exercise modal close button
    const exerciseCloseBtn = document.querySelector('#exerciseModal .close');
    if (exerciseCloseBtn) {
        exerciseCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            modal.style.display = 'none';
        });
    }

    // Individual exercise modal close button
    const individualCloseBtn = document.querySelector('#individualExerciseModal .individual-exercise-close');
    if (individualCloseBtn) {
        individualCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            individualModal.style.display = 'none';
        });
    }

    // Auth modal close button
    const authCloseBtn = document.querySelector('#authModal .auth-modal-close');
    if (authCloseBtn) {
        authCloseBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            authModal.style.display = 'none';
        });
    }

    // Click outside modal to close
    window.addEventListener('click', function(event) {
        if (event.target === modal && modal) {
            modal.style.display = 'none';
        }
        if (event.target === individualModal && individualModal) {
            individualModal.style.display = 'none';
        }
        if (event.target === authModal && authModal) {
            authModal.style.display = 'none';
        }
    });

    // Close modals with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeAllModals();
        }
    });

    // Add click handlers to day routines and images
    document.addEventListener('click', function(e) {
        // Si se hace clic en el botón de completar, no abrir el modal
        if (e.target.closest('.complete-routine-btn')) {
            return;
        }
        
        const dayRoutine = e.target.closest('.day-routine');
        const routineImage = e.target.closest('.routine-image');
        const exerciseVideoContainer = e.target.closest('.exercise-video-container');
        
        // Check if clicking on individual exercise video
        if (exerciseVideoContainer && !e.target.closest('.btn-complete')) {
            const exerciseItem = exerciseVideoContainer.closest('.exercise-item');
            const exerciseIndex = parseInt(exerciseItem.getAttribute('data-exercise-index'));
            const routineTitle = document.getElementById('modalTitle').textContent;
            
            // Find the exercise data
            let exerciseData = null;
            let routineData = null;
            
            Object.values(window.exerciseData || exerciseData).forEach(routine => {
                if (routine.title === routineTitle) {
                    routineData = routine;
                    exerciseData = routine.exercises[exerciseIndex];
                }
            });
            
            if (exerciseData) {
                showIndividualExerciseModal(exerciseData, routineData, exerciseIndex);
            }
            return;
        }
        
        if (dayRoutine) {
            const routineId = dayRoutine.getAttribute('data-routine-id');
            if (exerciseData[routineId]) {
                showExerciseModal(exerciseData[routineId]);
            }
        } else if (routineImage) {
            // Find the parent section to determine level
            const section = routineImage.closest('.routine-section');
            if (section) {
                const sectionId = section.id;
                let exercises = [];
                
                // Collect all exercises for this level
                Object.keys(exerciseData).forEach(key => {
                    if ((sectionId === 'principiante' && ['lunes-cardio', 'miercoles-fuerza', 'viernes-flex'].includes(key)) ||
                        (sectionId === 'intermedio' && ['lunes-superior', 'miercoles-inferior', 'viernes-cardio-core'].includes(key)) ||
                        (sectionId === 'avanzado' && ['lunes-push', 'miercoles-pull', 'viernes-legs-core', 'sabado-fullbody'].includes(key))) {
                        exercises.push(exerciseData[key]);
                    }
                });
                
                showLevelOverview(sectionId, exercises);
            }
        }
    });

    function showIndividualExerciseModal(exercise, routine, exerciseIndex) {
        const individualModal = document.getElementById('individualExerciseModal');
        const individualTitle = document.getElementById('individualExerciseTitle');
        const individualBody = document.getElementById('individualExerciseBody');
        
        individualTitle.textContent = exercise.name;
        
        // Get progress data for this exercise
        const routineProgress = getRoutineProgress(routine.title);
        const completedExercises = routineProgress.completed || [];
        const isCompleted = completedExercises.includes(exerciseIndex);
        
        // Extract video ID from YouTube URL
        const videoId = extractYouTubeId(exercise.video);
        const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
        
        individualBody.innerHTML = `
            <div class="individual-exercise-video-container">
                <iframe 
                    src="${exercise.video}" 
                    title="${exercise.name}"
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                    allowfullscreen
                    class="individual-exercise-video">
                </iframe>
                ${isCompleted ? '<div class="completion-overlay"><i class="fas fa-check-circle"></i></div>' : ''}
                <a href="${youtubeUrl}" target="_blank" class="video-open-btn" title="Abrir en YouTube">
                    <i class="fas fa-external-link-alt"></i>
                </a>
            </div>
            
            <div class="individual-exercise-details">
                <h3 class="individual-exercise-name">${exercise.name}</h3>
                <span class="individual-exercise-meta">${exercise.reps || exercise.duration}</span>
                
                <p class="individual-exercise-description">${exercise.description}</p>
                
                <div class="individual-exercise-tips">
                    <strong><i class="fas fa-lightbulb"></i> Consejo:</strong>
                    <p>${exercise.tips}</p>
                </div>
                
                <div class="individual-exercise-actions">
                    <button class="btn btn-complete ${isCompleted ? 'completed' : ''}" 
                            data-routine="${routine.title}" 
                            data-exercise-index="${exerciseIndex}">
                        <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
                        ${isCompleted ? 'Completado' : 'Marcar como completado'}
                    </button>
                </div>
            </div>
        `;
        
        // Add event listener for completion button
        const completeBtn = individualBody.querySelector('.btn-complete');
        completeBtn.addEventListener('click', function() {
            const routineName = this.getAttribute('data-routine');
            const exerciseIdx = parseInt(this.getAttribute('data-exercise-index'));
            toggleExerciseCompletion(routineName, exerciseIdx, this);
            
            // Update the modal view
            setTimeout(() => {
                showIndividualExerciseModal(exercise, routine, exerciseIndex);
            }, 100);
        });
        
        individualModal.style.display = 'block';
    }
    
    // Helper function to extract YouTube video ID
    function extractYouTubeId(url) {
        const match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
        return match ? match[1] : '';
    }

    function showExerciseModal(routine) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = routine.title;
        
        // Get progress data for this routine
        const routineProgress = getRoutineProgress(routine.title);
        const completedExercises = routineProgress.completed || [];
        
        modalBody.innerHTML = `
            <div class="routine-info">
                ${routine.waterIntake ? `
                <div class="water-intake">
                    <i class="fas fa-tint"></i>
                    <span>Hidratación recomendada: ${routine.waterIntake}</span>
                </div>
                ` : ''}
                
                <div class="routine-progress">
                    <div class="routine-progress-bar">
                        <div class="routine-progress-fill" style="width: ${(completedExercises.length / routine.exercises.length) * 100}%"></div>
                    </div>
                    <span class="progress-text">${completedExercises.length}/${routine.exercises.length} ejercicios completados</span>
                </div>
            </div>
            
            <div class="exercises-list">
                ${routine.exercises.map((exercise, index) => {
                    const isCompleted = completedExercises.includes(index);
                    const videoId = extractYouTubeId(exercise.video);
                    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
                    
                    return `
                    <div class="exercise-item ${isCompleted ? 'completed' : ''}" data-exercise-index="${index}">
                        <div class="exercise-video-container">
                            <iframe 
                                src="${exercise.video}" 
                                title="${exercise.name}"
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                                allowfullscreen
                                class="exercise-video">
                            </iframe>
                            ${isCompleted ? '<div class="completion-overlay"><i class="fas fa-check-circle"></i></div>' : ''}
                            <a href="${youtubeUrl}" target="_blank" class="video-open-btn-small" title="Abrir en YouTube" onclick="event.stopPropagation();">
                                <i class="fas fa-external-link-alt"></i>
                            </a>
                        </div>
                        
                        <div class="exercise-content">
                            <div class="exercise-header">
                                <h3 class="exercise-name">${exercise.name}</h3>
                                <span class="exercise-meta">${exercise.reps || exercise.duration}</span>
                            </div>
                            
                            <p class="exercise-description">${exercise.description}</p>
                            
                            <div class="exercise-tips">
                                <strong><i class="fas fa-lightbulb"></i> Consejo:</strong>
                                <p>${exercise.tips}</p>
                            </div>
                            
                            <button class="btn btn-complete ${isCompleted ? 'completed' : ''}" 
                                    data-routine="${routine.title}" 
                                    data-exercise-index="${index}"
                                    onclick="event.stopPropagation();">
                                <i class="fas ${isCompleted ? 'fa-check-circle' : 'fa-circle'}"></i>
                                ${isCompleted ? 'Completado' : 'Marcar como completado'}
                            </button>
                        </div>
                    </div>
                `}).join('')}
            </div>
        `;
        
        // Add event listeners for completion buttons
        const completeBtns = modalBody.querySelectorAll('.btn-complete');
        completeBtns.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                const routineName = this.getAttribute('data-routine');
                const exerciseIndex = parseInt(this.getAttribute('data-exercise-index'));
                toggleExerciseCompletion(routineName, exerciseIndex, this);
            });
        });
        
        modal.style.display = 'block';
        
        // Load exercise images
        loadExerciseImages();
    }

    function showLevelOverview(levelId, routines) {
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        const levelNames = {
            'principiante': 'Principiante',
            'intermedio': 'Intermedio',
            'avanzado': 'Avanzado'
        };
        
        modalTitle.textContent = `Rutinas ${levelNames[levelId]}`;
        
        modalBody.innerHTML = `
            <div class="level-overview">
                <p class="level-intro">Haz clic en cualquier día para ver los ejercicios detallados:</p>
                <div class="routines-grid">
                    ${routines.map(routine => `
                        <div class="routine-overview-card" data-routine-title="${routine.title}">
                            <h4>${routine.title}</h4>
                            <p>${routine.exercises.length} ejercicios</p>
                            <button class="btn btn-primary btn-view-routine">Ver ejercicios</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
        
        // Add click handlers for routine cards
        const routineCards = modalBody.querySelectorAll('.routine-overview-card');
        routineCards.forEach(card => {
            card.addEventListener('click', function() {
                const routineTitle = this.getAttribute('data-routine-title');
                const routine = routines.find(r => r.title === routineTitle);
                if (routine) {
                    showExerciseModal(routine);
                }
            });
        });
        
        modal.style.display = 'block';
    }

    function loadExerciseImages() {
        const exerciseImages = modal.querySelectorAll('.exercise-image');
        exerciseImages.forEach(img => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.addEventListener('load', function() {
                    this.classList.add('loaded');
                });
                
                img.addEventListener('error', function() {
                    this.style.display = 'none';
                    // Create a placeholder div
                    const placeholder = document.createElement('div');
                    placeholder.className = 'exercise-image-placeholder';
                    placeholder.innerHTML = `
                        <i class="fas fa-dumbbell"></i>
                        <span>${this.alt}</span>
                    `;
                    this.parentNode.appendChild(placeholder);
                });
            }
        });
    }
    // PROGRESS TRACKING SYSTEM - Enhanced with backend integration
    function getRoutineProgress(routineName) {
        const progress = localStorage.getItem('routineProgress');
        const allProgress = progress ? JSON.parse(progress) : {};
        return allProgress[routineName] || { completed: [] };
    }
    
    function saveRoutineProgress(routineName, progressData) {
        const progress = localStorage.getItem('routineProgress');
        const allProgress = progress ? JSON.parse(progress) : {};
        allProgress[routineName] = progressData;
        localStorage.setItem('routineProgress', JSON.stringify(allProgress));
    }
    
    // Enhanced function to sync with backend
    async function syncProgressWithBackend(routineName, exerciseIndex, isCompleted) {
        // DESACTIVADO: No registrar automáticamente la rutina completa
        // El usuario debe hacer clic manualmente en "Marcar como completada"
        return;
        
        /* CÓDIGO DESACTIVADO
        if (!window.authSystem?.isAuthenticated()) {
            return; // Skip sync if not authenticated
        }
        
        try {
            // Get routine data
            const routineData = Object.values(exerciseData).find(data => data.title === routineName);
            if (!routineData) return;
            
            // Check if all exercises are completed
            const currentProgress = getRoutineProgress(routineName);
            const completedExercises = currentProgress.completed || [];
            const allCompleted = completedExercises.length === routineData.exercises.length;
            
            if (allCompleted && isCompleted) {
                // Send completed routine to backend
                const response = await window.authSystem.makeAuthenticatedRequest(
                    `${API_URL}/progress/rutina`,
                    {
                        method: 'POST',
                        body: JSON.stringify({
                            rutinaId: routineName.toLowerCase().replace(/\s+/g, '-'),
                            nombreRutina: routineName,
                            nivel: determineLevel(routineName),
                            tiempoTotal: routineData.exercises.length * 5, // Estimate 5 min per exercise
                            calorias: routineData.exercises.length * 15, // Estimate 15 cal per exercise
                            ejercicios: routineData.exercises.map((ex, idx) => ({
                                ejercicioId: `${routineName}-${idx}`,
                                nombreEjercicio: ex.name,
                                completado: completedExercises.includes(idx)
                            }))
                        })
                    }
                );
                
                if (response.ok) {
                    console.log('✅ Progreso sincronizado con el servidor');
                    updateProgressBar();
                }
            }
        } catch (error) {
            console.error('Error syncing progress:', error);
        }
        */
    }
    
    function determineLevel(routineName) {
        if (routineName.includes('Principiante') || routineName.includes('Cardio Ligero') || routineName.includes('Fuerza Básica')) {
            return 'principiante';
        } else if (routineName.includes('Intermedio') || routineName.includes('Tren Superior') || routineName.includes('Tren Inferior')) {
            return 'intermedio';
        } else {
            return 'avanzado';
        }
    }
    
    function toggleExerciseCompletion(routineName, exerciseIndex, buttonElement) {
        const currentProgress = getRoutineProgress(routineName);
        const completedExercises = currentProgress.completed || [];
        
        const isCurrentlyCompleted = completedExercises.includes(exerciseIndex);
        
        if (isCurrentlyCompleted) {
            // Remove from completed
            const index = completedExercises.indexOf(exerciseIndex);
            completedExercises.splice(index, 1);
            
            // Update button
            buttonElement.classList.remove('completed');
            buttonElement.innerHTML = '<i class="fas fa-circle"></i> Marcar como completado';
            
            // Update exercise item
            const exerciseItem = buttonElement.closest('.exercise-item');
            exerciseItem.classList.remove('completed');
            
            // Remove completion overlay
            const overlay = exerciseItem.querySelector('.completion-overlay');
            if (overlay) overlay.remove();
            
        } else {
            // Add to completed
            completedExercises.push(exerciseIndex);
            
            // Update button
            buttonElement.classList.add('completed');
            buttonElement.innerHTML = '<i class="fas fa-check-circle"></i> Completado';
            
            // Update exercise item
            const exerciseItem = buttonElement.closest('.exercise-item');
            exerciseItem.classList.add('completed');
            
            // Add completion overlay
            const videoContainer = exerciseItem.querySelector('.exercise-video-container');
            if (!videoContainer.querySelector('.completion-overlay')) {
                const overlay = document.createElement('div');
                overlay.className = 'completion-overlay';
                overlay.innerHTML = '<i class="fas fa-check-circle"></i>';
                videoContainer.appendChild(overlay);
            }
            
            // Show completion animation
            showCompletionAnimation(buttonElement);
        }
        
        // Save progress locally
        saveRoutineProgress(routineName, { completed: completedExercises });
        
        // Update progress bar
        updateProgressBar(routineName, completedExercises.length);
        
        // Sync with backend
        syncProgressWithBackend(routineName, exerciseIndex, !isCurrentlyCompleted);
    }
    
    // Enhanced progress bar with backend data
    async function updateProgressBar(routineName, completedCount) {
        const progressFill = document.querySelector('.routine-progress-fill');
        const progressText = document.querySelector('.progress-text');
        
        if (progressFill && progressText) {
            // Get total exercises for this routine
            const routineData = Object.values(exerciseData).find(data => data.title === routineName);
            const totalExercises = routineData ? routineData.exercises.length : 0;
            
            const percentage = totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;
            
            progressFill.style.width = percentage + '%';
            progressText.textContent = `${completedCount}/${totalExercises} ejercicios completados`;
            
            // Add completion celebration if all exercises are done
            if (percentage === 100) {
                showRoutineCompletionCelebration();
                
                // Update global progress bar if authenticated
                if (window.authSystem?.isAuthenticated()) {
                    await updateGlobalProgressBar();
                }
            }
        }
    }
    
    // Initialize progress bar on page load
    document.addEventListener('DOMContentLoaded', function() {
        if (window.authSystem?.isAuthenticated() && window.updateGlobalProgressBar) {
            setTimeout(window.updateGlobalProgressBar, 1000);
        }
    });
    
    function showCompletionAnimation(element) {
        element.style.transform = 'scale(1.1)';
        element.style.transition = 'transform 0.2s ease';
        
        setTimeout(() => {
            element.style.transform = 'scale(1)';
        }, 200);
        
        // Add a small celebration effect
        const celebration = document.createElement('div');
        celebration.className = 'completion-celebration';
        celebration.innerHTML = '🎉';
        element.appendChild(celebration);
        
        setTimeout(() => {
            celebration.remove();
        }, 1000);
    }
    
    function showRoutineCompletionCelebration() {
        const modal = document.getElementById('exerciseModal');
        
        // Evitar mostrar múltiples celebraciones
        if (modal.querySelector('.routine-completion-celebration')) {
            console.log('⚠️ Ya hay una celebración activa');
            return;
        }
        
        const celebration = document.createElement('div');
        celebration.className = 'routine-completion-celebration';
        celebration.innerHTML = `
            <div class="celebration-content">
                <i class="fas fa-trophy"></i>
                <h3>¡Rutina Completada!</h3>
                <p>¡Excelente trabajo! Has completado todos los ejercicios.</p>
                <p class="celebration-reminder">💡 No olvides marcar la rutina como completada</p>
            </div>
        `;
        
        // Prevenir que los clics pasen a través del modal
        celebration.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
        });
        
        modal.appendChild(celebration);
        
        // NO auto-completar, solo mostrar el mensaje
        
        setTimeout(() => {
            celebration.remove();
        }, 3000);
    }
    // VIDEO FUNCTIONALITY
    // Show level badge for assessed users
    function showLevelBadge(level) {
        const heroSection = document.querySelector('.banner-overlay .container');
        if (heroSection && !document.querySelector('.level-badge')) {
            const badge = document.createElement('div');
            badge.className = 'level-badge';
            badge.innerHTML = `
                <div class="badge-content">
                    <i class="fas fa-medal"></i>
                    <span>Tu nivel: <strong>${level}</strong></span>
                    <button class="badge-retake" onclick="document.getElementById('retakeQuizBtn').click()">
                        <i class="fas fa-redo"></i> Reevaluar
                    </button>
                </div>
            `;
            
            // Insert after the subtitle
            const subtitle = heroSection.querySelector('.subtitle');
            if (subtitle) {
                subtitle.insertAdjacentElement('afterend', badge);
            }
        }
    }
    // Show current level indicator
    function showCurrentLevelIndicator() {
        const savedLevel = localStorage.getItem('fitnessLevel');
        if (savedLevel) {
            // Show a subtle notification about current level
            setTimeout(() => {
                const levelBadge = document.createElement('div');
                levelBadge.className = 'current-level-badge';
                levelBadge.innerHTML = `
                    <div class="badge-content">
                        <i class="fas fa-star"></i>
                        <span>Tu nivel actual: <strong>${savedLevel}</strong></span>
                        <button class="badge-close" onclick="this.parentElement.parentElement.remove()">×</button>
                    </div>
                `;
                
                document.body.appendChild(levelBadge);
                
                setTimeout(() => {
                    levelBadge.classList.add('show');
                }, 100);
                
                // Auto-hide after 5 seconds
                setTimeout(() => {
                    if (levelBadge.parentElement) {
                        levelBadge.classList.remove('show');
                        setTimeout(() => {
                            levelBadge.remove();
                        }, 300);
                    }
                }, 5000);
            }, 2000);
        }
    }

    // Click outside modal to close - Fixed
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
        if (event.target === individualModal) {
            individualModal.style.display = 'none';
        }
        if (event.target === authModal) {
            authModal.style.display = 'none';
        }
    });

    // Close modals with Escape key - Fixed
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            if (modal) modal.style.display = 'none';
            if (individualModal) individualModal.style.display = 'none';
            if (authModal) authModal.style.display = 'none';
            const questionnaireModal = document.getElementById('questionnaireModal');
            if (questionnaireModal) questionnaireModal.style.display = 'none';
        }
    });


// ========================================
// FUNCIONALIDAD DE COMPLETAR RUTINAS
// ========================================

// Tiempos y calorías por nivel
const datosPorNivel = {
    principiante: { tiempo: 30, calorias: 200 },
    intermedio: { tiempo: 45, calorias: 350 },
    avanzado: { tiempo: 60, calorias: 500 }
};

// Manejar botones de completar rutina
document.addEventListener('click', async function(e) {
    const btn = e.target.closest('.complete-routine-btn');
    
    if (btn) {
        console.log('🔵 Botón de completar rutina clickeado');
        
        // Verificar si el botón está deshabilitado (procesando)
        if (btn.disabled) {
            console.log('⏳ Botón deshabilitado, operación en proceso');
            return;
        }
        
        // Si ya está completada, permitir desmarcar eliminando del backend
        if (btn.classList.contains('completed')) {
            const rutinaId = btn.getAttribute('data-routine-id');
            const nivel = btn.getAttribute('data-level');
            
            if (!window.authSystem || !window.authSystem.isAuthenticated()) {
                // Si no está autenticado, solo desmarcar visualmente
                btn.classList.remove('completed');
                btn.innerHTML = '<i class="fas fa-check-circle"></i> Marcar como completada';
                return;
            }
            
            try {
                btn.disabled = true;
                btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Desmarcando...';
                
                // Eliminar del backend
                const response = await window.authSystem.makeAuthenticatedRequest(
                    `${window.CONFIG?.API_URL || 'http://localhost:5001/api'}/progress/rutina/${rutinaId}`,
                    {
                        method: 'DELETE'
                    }
                );
                
                const data = await response.json();
                
                if (data.success) {
                    btn.classList.remove('completed');
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> Marcar como completada';
                    btn.disabled = false;
                    
                    window.authSystem.showNotification('Rutina desmarcada correctamente', 'info');
                    
                    // Actualizar barra de progreso
                    if (window.updateGlobalProgressBar) {
                        setTimeout(() => window.updateGlobalProgressBar(), 300);
                    }
                } else {
                    throw new Error(data.message || 'Error al desmarcar');
                }
            } catch (error) {
                console.error('Error al desmarcar:', error);
                btn.disabled = false;
                btn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Completada!';
                window.authSystem?.showNotification('Error al desmarcar la rutina', 'error');
            }
            
            return;
        }
        
        // Verificar autenticación
        if (!window.authSystem) {
            console.error('❌ authSystem no está disponible');
            alert('Error: Sistema de autenticación no disponible');
            return;
        }
        
        if (!window.authSystem.isAuthenticated()) {
            console.log('⚠️ Usuario no autenticado');
            showLoginRecommendationModal();
            return;
        }
        
        const rutinaId = btn.getAttribute('data-routine-id');
        const nivel = btn.getAttribute('data-level');
        const dayRoutine = btn.closest('.day-routine');
        const modalBody = btn.closest('#modalBody');
        
        let nombreRutina = '';
        
        if (dayRoutine) {
            nombreRutina = dayRoutine.querySelector('h4')?.textContent;
        } else if (modalBody) {
            // Si está en el modal, obtener el título del modal
            nombreRutina = document.getElementById('modalTitle')?.textContent;
        }
        
        if (!rutinaId || !nivel || !nombreRutina) {
            console.error('❌ Faltan datos de la rutina:', { rutinaId, nivel, nombreRutina });
            window.authSystem.showNotification('Error: Faltan datos de la rutina', 'error');
            return;
        }
        
        console.log('📊 Datos de la rutina:', { rutinaId, nivel, nombreRutina });
        
        // Obtener datos según nivel
        const datos = datosPorNivel[nivel] || datosPorNivel.principiante;
        
        try {
            // MARCADO OPTIMISTA: Marcar inmediatamente antes de enviar al servidor
            btn.classList.add('completed');
            btn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Completada!';
            
            // Deshabilitar botón mientras se procesa
            btn.disabled = true;
            
            console.log('📤 Enviando petición al servidor...');
            
            const response = await window.authSystem.makeAuthenticatedRequest(
                `${window.CONFIG?.API_URL || 'http://localhost:5001/api'}/progress/rutina`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        rutinaId,
                        nombreRutina,
                        nivel,
                        tiempoTotal: datos.tiempo,
                        calorias: datos.calorias,
                        ejercicios: []
                    })
                }
            );
            
            console.log('📥 Respuesta recibida:', response.status);
            
            const data = await response.json();
            console.log('📋 Datos de respuesta:', data);
            
            if (data.success) {
                // Ya está marcada, solo habilitar el botón
                btn.disabled = false;
                
                console.log('✅ Rutina completada exitosamente');
                
                // Mostrar notificación con detalles
                window.authSystem.showNotification(
                    `¡Rutina completada! +${datos.tiempo} min, +${datos.calorias} cal 💪`, 
                    'success'
                );
                
                // Actualizar barra de progreso global si existe
                if (window.updateGlobalProgressBar) {
                    setTimeout(() => window.updateGlobalProgressBar(), 500);
                }
            } else {
                throw new Error(data.message || 'Error al registrar rutina');
            }
        } catch (error) {
            console.error('❌ Error al completar rutina:', error);
            window.authSystem.showNotification('Error al registrar la rutina: ' + error.message, 'error');
            
            // Revertir marcado optimista
            btn.classList.remove('completed');
            btn.disabled = false;
            btn.innerHTML = '<i class="fas fa-check-circle"></i> Marcar como completada';
        }
    }
});

// Cargar rutinas completadas al iniciar
async function loadCompletedRoutines() {
    console.log('🔄 Cargando rutinas completadas...');
    
    if (!window.authSystem || !window.authSystem.isAuthenticated()) {
        console.log('⚠️ Usuario no autenticado');
        return;
    }
    
    try {
        // Obtener el progreso semanal que incluye las rutinas completadas
        const response = await window.authSystem.makeAuthenticatedRequest(
            `${window.CONFIG?.API_URL || 'http://localhost:5001/api'}/progress/semanal`
        );
        
        const data = await response.json();
        console.log('📥 Datos del servidor:', data);
        
        if (data.success && data.rutinasDetalle) {
            // Obtener la fecha de hoy en formato YYYY-MM-DD
            const hoy = new Date().toISOString().split('T')[0];
            console.log('📅 Hoy:', hoy);
            
            // Filtrar rutinas completadas hoy
            const rutinasHoy = data.rutinasDetalle.filter(rutina => {
                const fechaRutina = new Date(rutina.fecha).toISOString().split('T')[0];
                return fechaRutina === hoy;
            });
            
            console.log('✅ Rutinas hoy:', rutinasHoy);
            
            // Marcar los botones de las rutinas completadas hoy
            rutinasHoy.forEach(rutina => {
                const btn = document.querySelector(
                    `.complete-routine-btn[data-routine-id="${rutina.rutinaId}"][data-level="${rutina.nivel}"]`
                );
                
                console.log(`🔍 Botón para ${rutina.rutinaId}:`, btn);
                
                if (btn && !btn.classList.contains('completed')) {
                    btn.classList.add('completed');
                    btn.innerHTML = '<i class="fas fa-check-circle"></i> ¡Completada!';
                    console.log(`✅ Marcado: ${rutina.rutinaId}`);
                }
            });
            
            // Actualizar barra de progreso
            if (typeof updateGlobalProgressBar === 'function') {
                updateGlobalProgressBar();
            }
        }
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

// Cargar rutinas completadas cuando el usuario inicia sesión
if (window.authSystem && window.authSystem.isAuthenticated()) {
    loadCompletedRoutines();
}

// También cargar cuando se actualiza la UI de autenticación
window.addEventListener('userLoggedIn', loadCompletedRoutines);

// IMPORTANTE: Cargar rutinas completadas cuando la página se carga
document.addEventListener('DOMContentLoaded', function() {
    // Esperar menos tiempo para que authSystem esté listo
    setTimeout(() => {
        if (window.authSystem && window.authSystem.isAuthenticated()) {
            loadCompletedRoutines();
        }
    }, 100);
});


// ============================================
// NUEVAS FUNCIONALIDADES MEJORADAS
// ============================================

// 1. TEMPORIZADOR DE DESCANSO
let restTimer = null;
let restTimeRemaining = 0;

function startRestTimer(seconds = 60) {
    // Crear modal de temporizador
    const timerModal = document.createElement('div');
    timerModal.className = 'rest-timer-modal';
    timerModal.id = 'restTimerModal';
    timerModal.innerHTML = `
        <div class="rest-timer-content">
            <div class="timer-header">
                <h3><i class="fas fa-clock"></i> Tiempo de Descanso</h3>
                <button class="timer-close" onclick="closeRestTimer()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="timer-display">
                <div class="timer-circle">
                    <svg class="timer-svg" viewBox="0 0 100 100">
                        <circle class="timer-bg" cx="50" cy="50" r="45"></circle>
                        <circle class="timer-progress" cx="50" cy="50" r="45" id="timerProgress"></circle>
                    </svg>
                    <div class="timer-text">
                        <span class="timer-minutes" id="timerMinutes">00</span>
                        <span class="timer-separator">:</span>
                        <span class="timer-seconds" id="timerSeconds">00</span>
                    </div>
                </div>
            </div>
            <div class="timer-controls">
                <button class="timer-btn timer-pause" id="timerPauseBtn" onclick="pauseRestTimer()">
                    <i class="fas fa-pause"></i> Pausar
                </button>
                <button class="timer-btn timer-reset" onclick="resetRestTimer(${seconds})">
                    <i class="fas fa-redo"></i> Reiniciar
                </button>
                <button class="timer-btn timer-skip" onclick="closeRestTimer()">
                    <i class="fas fa-forward"></i> Saltar
                </button>
            </div>
            <div class="timer-presets">
                <button class="preset-btn" onclick="resetRestTimer(30)">30s</button>
                <button class="preset-btn" onclick="resetRestTimer(60)">60s</button>
                <button class="preset-btn" onclick="resetRestTimer(90)">90s</button>
                <button class="preset-btn" onclick="resetRestTimer(120)">2min</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(timerModal);
    
    // Iniciar temporizador
    restTimeRemaining = seconds;
    updateTimerDisplay();
    
    restTimer = setInterval(() => {
        restTimeRemaining--;
        updateTimerDisplay();
        
        if (restTimeRemaining <= 0) {
            clearInterval(restTimer);
            playTimerSound();
            showTimerComplete();
        }
    }, 1000);
    
    // Mostrar modal con animación
    setTimeout(() => {
        timerModal.classList.add('show');
    }, 10);
}

function updateTimerDisplay() {
    const minutes = Math.floor(restTimeRemaining / 60);
    const seconds = restTimeRemaining % 60;
    
    const minutesEl = document.getElementById('timerMinutes');
    const secondsEl = document.getElementById('timerSeconds');
    
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    
    // Actualizar círculo de progreso
    const progressCircle = document.getElementById('timerProgress');
    if (progressCircle) {
        const totalSeconds = parseInt(progressCircle.getAttribute('data-total') || 60);
        const progress = (restTimeRemaining / totalSeconds) * 283; // 283 es la circunferencia
        progressCircle.style.strokeDashoffset = 283 - progress;
    }
}

function pauseRestTimer() {
    const pauseBtn = document.getElementById('timerPauseBtn');
    if (restTimer) {
        clearInterval(restTimer);
        restTimer = null;
        pauseBtn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
        pauseBtn.onclick = resumeRestTimer;
    }
}

function resumeRestTimer() {
    const pauseBtn = document.getElementById('timerPauseBtn');
    restTimer = setInterval(() => {
        restTimeRemaining--;
        updateTimerDisplay();
        
        if (restTimeRemaining <= 0) {
            clearInterval(restTimer);
            playTimerSound();
            showTimerComplete();
        }
    }, 1000);
    pauseBtn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    pauseBtn.onclick = pauseRestTimer;
}

function resetRestTimer(seconds) {
    if (restTimer) clearInterval(restTimer);
    restTimeRemaining = seconds;
    
    const progressCircle = document.getElementById('timerProgress');
    if (progressCircle) {
        progressCircle.setAttribute('data-total', seconds);
    }
    
    updateTimerDisplay();
    resumeRestTimer();
}

function closeRestTimer() {
    if (restTimer) clearInterval(restTimer);
    const modal = document.getElementById('restTimerModal');
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => modal.remove(), 300);
    }
}

function playTimerSound() {
    // Crear un beep simple usando Web Audio API
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
}

function showTimerComplete() {
    const timerContent = document.querySelector('.rest-timer-content');
    if (timerContent) {
        timerContent.classList.add('timer-complete');
        setTimeout(() => {
            timerContent.classList.remove('timer-complete');
        }, 2000);
    }
}

// 2. BOTONES DE TEMPORIZADOR EN RUTINAS
function addTimerButtonsToRoutines() {
    const dayRoutines = document.querySelectorAll('.day-routine');
    
    dayRoutines.forEach(routine => {
        if (!routine.querySelector('.timer-quick-btn')) {
            const timerBtn = document.createElement('button');
            timerBtn.className = 'timer-quick-btn';
            timerBtn.innerHTML = '<i class="fas fa-stopwatch"></i> Descanso';
            timerBtn.onclick = (e) => {
                e.stopPropagation();
                startRestTimer(60);
            };
            
            routine.appendChild(timerBtn);
        }
    });
}

// 3. ESTADÍSTICAS DE CUESTIONARIO
function showQuestionnaireStats() {
    const stats = {
        totalAttempts: parseInt(localStorage.getItem('quizAttempts') || 0),
        lastScore: parseInt(localStorage.getItem('lastQuizScore') || 0),
        bestScore: parseInt(localStorage.getItem('bestQuizScore') || 0),
        lastLevel: localStorage.getItem('fitnessLevel') || 'No evaluado'
    };
    
    return stats;
}

function saveQuestionnaireStats(score, level) {
    const attempts = parseInt(localStorage.getItem('quizAttempts') || 0) + 1;
    const bestScore = Math.max(score, parseInt(localStorage.getItem('bestQuizScore') || 0));
    
    localStorage.setItem('quizAttempts', attempts);
    localStorage.setItem('lastQuizScore', score);
    localStorage.setItem('bestQuizScore', bestScore);
    localStorage.setItem('fitnessLevel', level);
}

// 4. NOTIFICACIONES DE MOTIVACIÓN
function showMotivationalNotification() {
    const messages = [
        '💪 ¡Es hora de entrenar! Tu cuerpo te lo agradecerá',
        '🔥 ¡No te rindas! Cada día eres más fuerte',
        '⭐ ¡Recuerda tu objetivo! Tú puedes lograrlo',
        '🎯 La consistencia es la clave del éxito',
        '💯 ¡Hoy es un gran día para entrenar!',
        '🏆 Los campeones se hacen con esfuerzo diario',
        '✨ Tu versión mejorada te está esperando'
    ];
    
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('Rutinas de Ejercicio', {
            body: randomMessage,
            icon: '/imgs/principiante.jpg',
            badge: '/imgs/principiante.jpg'
        });
    }
}

function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                showNotification('¡Notificaciones activadas! Te recordaremos entrenar', 'success');
            }
        });
    }
}

// 5. COMPARTIR PROGRESO
function shareProgress() {
    const level = localStorage.getItem('fitnessLevel') || 'Principiante';
    const score = localStorage.getItem('lastQuizScore') || 0;
    
    const shareData = {
        title: 'Mi Progreso Fitness',
        text: `¡Estoy en nivel ${level} con ${score} puntos! 💪 Únete a mí en este viaje fitness.`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData)
            .then(() => console.log('Compartido exitosamente'))
            .catch(err => console.log('Error al compartir:', err));
    } else {
        // Fallback: copiar al portapapeles
        navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`)
            .then(() => showNotification('¡Enlace copiado al portapapeles!', 'success'))
            .catch(err => console.error('Error al copiar:', err));
    }
}

// 6. EXPORTAR PROGRESO
function exportProgress() {
    const progressData = {
        nivel: localStorage.getItem('fitnessLevel'),
        puntuacion: localStorage.getItem('lastQuizScore'),
        intentos: localStorage.getItem('quizAttempts'),
        mejorPuntuacion: localStorage.getItem('bestQuizScore'),
        fechaExportacion: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(progressData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `progreso-fitness-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    
    URL.revokeObjectURL(url);
    showNotification('Progreso exportado exitosamente', 'success');
}

// Inicializar nuevas funcionalidades
document.addEventListener('DOMContentLoaded', function() {
    // Agregar botones de temporizador
    setTimeout(() => {
        addTimerButtonsToRoutines();
    }, 1000);
    
    // Mostrar notificación motivacional cada 2 horas (si está permitido)
    if ('Notification' in window && Notification.permission === 'granted') {
        setInterval(showMotivationalNotification, 2 * 60 * 60 * 1000);
    }
});

// Exponer funciones globalmente para uso en HTML
window.startRestTimer = startRestTimer;
window.closeRestTimer = closeRestTimer;
window.pauseRestTimer = pauseRestTimer;
window.resumeRestTimer = resumeRestTimer;
window.resetRestTimer = resetRestTimer;
window.shareProgress = shareProgress;
window.exportProgress = exportProgress;
window.requestNotificationPermission = requestNotificationPermission;


// ========================================
// MODAL DE RECOMENDACIÓN DE LOGIN
// ========================================

function showLoginRecommendationModal() {
    // Crear modal si no existe
    let modal = document.getElementById('loginRecommendationModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'loginRecommendationModal';
        modal.className = 'modal login-recommendation-modal';
        modal.innerHTML = `
            <div class="modal-content login-recommendation-content">
                <div class="login-recommendation-icon">
                    <i class="fas fa-user-lock"></i>
                </div>
                <h3 class="login-recommendation-title">¡Guarda tu progreso!</h3>
                <p class="login-recommendation-message">
                    Para registrar tus rutinas completadas y hacer seguimiento de tu progreso, necesitas iniciar sesión.
                </p>
                <div class="login-recommendation-benefits">
                    <div class="benefit-item">
                        <i class="fas fa-chart-line"></i>
                        <span>Seguimiento de progreso</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-fire"></i>
                        <span>Mantén tu racha activa</span>
                    </div>
                    <div class="benefit-item">
                        <i class="fas fa-trophy"></i>
                        <span>Logros y estadísticas</span>
                    </div>
                </div>
                <div class="login-recommendation-actions">
                    <button class="btn-login-recommendation" id="loginRecommendationBtn">
                        <i class="fas fa-sign-in-alt"></i>
                        Iniciar Sesión
                    </button>
                    <button class="btn-cancel-recommendation" id="cancelRecommendationBtn">
                        Continuar sin guardar
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Event listeners
        document.getElementById('loginRecommendationBtn').addEventListener('click', function() {
            modal.style.display = 'none';
            // Abrir modal de autenticación
            const authModal = document.getElementById('authModal');
            if (authModal) {
                authModal.style.display = 'block';
            }
        });
        
        document.getElementById('cancelRecommendationBtn').addEventListener('click', function() {
            modal.classList.add('fade-out');
            setTimeout(() => {
                modal.style.display = 'none';
                modal.classList.remove('fade-out');
            }, 300);
        });
        
        // Cerrar al hacer clic fuera
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.add('fade-out');
                setTimeout(() => {
                    modal.style.display = 'none';
                    modal.classList.remove('fade-out');
                }, 300);
            }
        });
    }
    
    // Mostrar modal con animación
    modal.style.display = 'block';
    setTimeout(() => {
        modal.classList.add('show');
    }, 10);
}


// ========================================
// ANIMACIONES DE SCROLL SUAVES
// ========================================

// Intersection Observer para animar secciones al hacer scroll
const observeSections = () => {
    const sections = document.querySelectorAll('.routine-section');
    
    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Dejar de observar después de animar
                sectionObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    sections.forEach(section => {
        sectionObserver.observe(section);
    });
};

// Inicializar observador cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', observeSections);
} else {
    observeSections();
}

// Animación suave para los botones de completar al cargar
document.addEventListener('DOMContentLoaded', function() {
    const completeButtons = document.querySelectorAll('.complete-routine-btn');
    
    completeButtons.forEach((btn, index) => {
        btn.style.opacity = '0';
        btn.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            btn.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            btn.style.opacity = '1';
            btn.style.transform = 'translateY(0)';
        }, 100 + (index * 50));
    });
});
