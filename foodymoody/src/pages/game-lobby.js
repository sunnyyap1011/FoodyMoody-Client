// Importing Section
import React from 'react'
import '../App.css'
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom'

// Styling Section
const LobbyBody = styled.div`
background-color: #9DBDE3;
`

// Components Section
class GameLobby extends React.Component {
  state = {
    
  }


// Rendering Section
  render() {
    return (
      <LobbyBody>
        <div>
          <h1>Choose Rounds To Play!</h1>
        </div>

        <div>
          <h2>Choose Location:</h2>
        </div>

        <div>
          <Button variant="contained" color="primary">3 Rounds</Button>{' '}
          <Button variant="contained" color="primary">5 Rounds</Button>{' '}
          <Button variant="contained" color="primary">8 Rounds</Button>{' '}
        </div>

        <Link to={ "/home" }>Return</Link>
      </LobbyBody>
    )
  }
}

export default GameLobby