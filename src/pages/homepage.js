// Importing Section
import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import Button from '@material-ui/core/Button'
import img from '../components/background_images/homepage_background_2.jpg'
import Socket from '../utils/socket'
import PageTitle from '../components/PageTitle'


// Stylings Section
const Body = styled.div`
background-image: url(${ img });
background-attachment: fixed;
position: fixed;
height: 100vh;
width: 100vw;
background-size: cover;
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
                <PageTitle>Welcome to FoodyMoody!</PageTitle>
                </div>

                <SubBody>
                <div>
                <Link to={ '/create_lobby' }><Button size="large" style={{ marginBottom:"50px" }} variant="contained" color="primary">Let's Play</Button></Link>
                </div>

                <div>
                <Link to={ '/random_restaurants' }><Button size="large" style={{ marginBottom:"50px" }} variant="contained" color="primary">I JUST WANT TO EAT</Button></Link>
                </div>

                <div>
                <Button size="large" variant="contained" color="primary">Hidden Gems</Button>
                </div>
                </SubBody> 
            </Body>
        )
    }
}