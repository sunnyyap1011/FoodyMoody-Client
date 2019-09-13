import React from 'react'
import { Link } from 'react-router-dom'
import styled from 'styled-components'
import img from '../components/background_images/homepage_background_2.jpg'

// Styling Section
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
`;

const Title = styled.h1`
font-family: 'Kavoon', cursive;
text-align: center;
margin-top: 30px;
font-size: 100px;
`

// Rendering Section
export default class Random extends React.Component {
    state = {
        
    }


    render() {
        return (
            <Body>
                <div>
                    <Title>Choose One Fussy Eater!</Title>
                    <Link to = { '/home' }>Return</Link>
                </div> 
            </Body>
        )
    }
}