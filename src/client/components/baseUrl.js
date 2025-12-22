

 const getBaseUrl = () => {
  if (window.location.hostname === 'localhost') {
    return ''; // Uses vite proxy
  }
  return import.meta.env.VITE_API_URL || '';
};

console.log('env backend url ', import.meta.env)
export default getBaseUrl