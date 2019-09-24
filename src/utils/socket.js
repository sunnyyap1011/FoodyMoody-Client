import io from 'socket.io-client'

const Socket = io('https://foodymoody-server.herokuapp.com/')
// const Socket = io('http://localhost:5000/')

export default Socket