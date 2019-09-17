// Importing Section
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button';
import img from '../components/background_images/homepage_background_2.jpg'
import Socket from '../utils/socket'

// Stylings Section
const Body = styled.div`
background-image: url(${ img });
background-repeat: no-repeat;
background-attachment: fixed;
position: fixed;
top: 0;
left: 0;
min-width: 100%;
min-height: 100%;
background-size: cover;
`

const Title = styled.h1`
font-family: 'Kavoon', cursive;
text-align: center;
margin-top: 30px;
font-size: 100px;
`

const SubBody = styled.div`
display: flex;
flex-direction: column;
justify-content: center;
align-items: center;
`

// Rendering Section
export default class Homepage extends React.Component {
    state = {}

    componentDidMount() {
        Socket.on('connect', () => {
            console.log("You've connected!")
        })
    }

    render() {
        return (
            <Body>
                <div>
                <Title>Welcome to FoodyMoody!</Title>
                </div>

                <SubBody>
                <div>
                <Link to={ '/game_lobby' }><Button style={{marginBottom:"50px"}} variant="outlined" color="primary">Let's Play</Button></Link>
                </div>

                <div>
                <Link to={ '/random_restaurants' }><Button style={{marginBottom:"50px"}} variant="outlined" color="primary">I JUST WANT TO EAT!</Button></Link>
                </div>

                <div>
                <Button variant="outlined" color="primary">Hidden Gems</Button>
                </div>
                </SubBody> 
            </Body>
        )
    }
}