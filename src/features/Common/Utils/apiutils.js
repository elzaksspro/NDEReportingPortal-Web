

const getBaseUrl = () => {
  if (process.env.NODE_ENV === 'development') {
    return process.env.REACT_APP_API_URL;
  } else {
    return '/api/v1.0'; // Example: '/api'
  }
};

export { getBaseUrl };
