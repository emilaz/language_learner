const ENV = {
  dev: {
    apiUrl: 'http://172.25.189.25:8000'
  },
  prod: {
    apiUrl: 'https://your-production-api.com'  // Change this when you have a production URL
  }
};

const getEnvVars = () => {
  if (__DEV__) {
    return ENV.dev;
  }
  return ENV.prod;
};

export default getEnvVars(); 