import { io } from 'socket.io-client';

const url = window.location.origin;
const socket = io(url);

export default socket;
