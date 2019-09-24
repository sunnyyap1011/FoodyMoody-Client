import io from 'socket.io-client'

const Socket = io('https://foodymoody-server.herokuapp.com/', {transports: ['websocket']})
// const Socket = io('http://192.168.1.35:5000/')

export default Socket