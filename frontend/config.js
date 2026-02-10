// Frontend Configuration
const CONFIG = {
    API_URL: 'TU_URL_DE_RAILWAY_AQUI/api',  // Actualiza esto cuando tengas la URL de Railway
    ENDPOINTS: {
        AUTH: {
            LOGIN: '/auth/login',
            REGISTER: '/auth/register',
            ME: '/auth/me',
            PROFILE: '/auth/profile'
        },
        PROGRESS: {
            GET: '/progress',
            UPDATE: '/progress',
            STATS: '/progress/stats'
        },
        ROUTINES: {
            GET: '/routines',
            COMPLETE: '/routines/complete'
        }
    },
    STORAGE_KEYS: {
        AUTH_TOKEN: 'authToken',
        FITNESS_LEVEL: 'fitnessLevel',
        FITNESS_ASSESSED: 'fitnessLevelAssessed',
        ROUTINE_PROGRESS: 'routineProgress'
    }
};

// Export for use in other scripts
window.CONFIG = CONFIG;