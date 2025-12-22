

 const baseUrl = window.location.hostname === 'localhost' 
  ? ''  // Uses vite proxy
  : import.meta.env.VITE_API_URL



 export default baseUrl