import { io } from 'socket.io-client'

const apiUrl = window.location.hostname !== 'localhost' ?
 import.meta.env.VITE_API_URL : 'http://localhost:3000'


const url = apiUrl.replace(/\/$/, '')
const isSecure = apiUrl.startsWith('https:')

// establish socket connection (proxied by Vite)
const socket = io(url, {
   path: '/socket.io',
   transports: ['websocket'],
   withCredentials: true,
   secure: isSecure,
   reconnection: true,
   reconnectionAttempts: Infinity,
   reconnectionDelay: 1000,
   timeout: 20000
 })



socket.on('ping', (data) => {
  console.log('ping from server:', data)
})

// export socket for other modules if needed
export default socket