// Frontend Configuration
const CONFIG = {
    API_URL: 'https://fitness-app-backend-36d6.onrender.com/api',  // Backend desplegado en Render
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