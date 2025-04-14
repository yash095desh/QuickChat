import io from "socket.io-client"

const URL = process.env.NEXT_PUBLIC_URL || "http://localhost:5001"

const socket = io(URL, {
    autoConnect: false,         // Ensures you call `.connect()` manually
    transports: ["websocket"],  // Faster and more stable for real-time apps
    reconnection: true,         // Auto-reconnect for stability
    reconnectionAttempts: 5,    // Prevents endless retries
    reconnectionDelay: 1000     // 1-second delay before retry
});

export default socket;