export const ApiConfig = {
    baseURL: process.env.REACT_APP_API_URL || '/api',
    timeout: parseInt(process.env.REACT_APP_API_TIMEOUT || '5000'),
    retryAttempts: 3,
    headers: {
        'Content-Type': 'application/json'
    }
};

export const CacheConfig = {
    ttl: 300000, // 5 minutes
    maxSize: 100
};

export const AppConfig = {
    polling: {
        interval: 30000,
        retries: 3
    },
    ui: {
        debounceDelay: 300,
        animationDuration: 200
    }
};
