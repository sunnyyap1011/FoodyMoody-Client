import React from 'react'
import styled from 'styled-components'
import {
    Card, CardText, CardBody,
    CardTitle, Button
} from 'reactstrap';
import Axios from 'axios';
import "../discover_page.css";

import { toast } from 'react-toastify';
import ReactCardFlip from 'react-card-flip'

const Discover = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    background-color: #9dbde3;
    color: black;
    height: 100vh;
    font-family: 'Mansalva', cursive;

    .cards_container{
        display: flex;
        justify-content: space-between;
        height: 80vh;
        margin: 2vh 0;
        border: 2px border black;
        overflow-x: auto;
        max-width: 100vw;
    }
 
        .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            height: 100%;
            min-width: 300px;


            
            background-color: #f0f0f0;
            color: black;
            margin: 0 2vw;
            width: 20vw;
            
            
            .card-title{
                margin: 0.5rem;
                text-align: center;
                height: 6vh;
                font-size: 15px;
                color: deeppink;
            }

            img {
                width: 100%;
                height: 40%;
                object-fit: cover
            }
    
            .card-body {
                display: flex;
                flex-direction: column;
                align-items: start;
                margin-bottom: 0.5rem;
                width: 100%;
                padding: 3px 20px 5px 20px;

                .card-text {
                    display: flex;
                    width: 100%;
                    font-size: 15px;

                    span {
                        color: blue;
                        margin-right: 1rem;
                        width: 30%;
                    }

                    .address {
                        width: 100%;
                        color: black;
                        font-size: 11px;
                    }
                }
            }
    
    
            .btn_container {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .button {
                    margin-bottom: 2rem;             
                    padding: 2px;
                }
            }

            .btn_container_2 {
                display:flex;
                flex-direction:column;
                justify-content: space-between;
                align-items: center;
                width: 100%;
                height: 25%
                 
                .button {
                    margin-bottom: 0.5rem
                }

            }

            
    
        }
    }
`

const DiscoverForm = styled.div`
    background-color: #9dbde3;
    height: 100vh;
    width: 100vw;
    border: red;
    position: fixed;
    top: 0;
    left: 0;
`



const google = window.google

const display_round = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
]

export default class DiscoverPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            restaurant_list: '',
            location: '',
            rounds: 0,
            isFlippedA: false,
            isFlippedB: false,
            isFlippedC: false,

        }
        this.autocompleteInput = React.createRef();
        this.autocomplete = null;
        this.handlePlaceChanged = this.handlePlaceChanged.bind(this);
    }

    componentDidMount() {
        this.autocomplete = new google.maps.places.Autocomplete(this.autocompleteInput.current,
            { "types": ["geocode"], componentRestrictions: { country: 'my' } });

        this.autocomplete.addListener('place_changed', this.handlePlaceChanged);

    }

    discover = () => {
        // const url = 'https://developers.zomato.com/api/v2.1/search?lat=' + this.state.location.lat + '&lon=' + this.state.location.lng + '&radius=1500&category=restaurant&sort=rating&order=desc'
        const url = 'https://developers.zomato.com/api/v2.1/geocode?lat=' + this.state.location.lat + '&lon=' + this.state.location.lng + '&radius=1500&category=nearby_restaurants&sort=rating&order=desc'
        const config = {
            headers:
                { 'user-key': 'b4073a8a5aadcf3500d69d4b861b218b' },
            'Access-Control-Allow-Origin': '*'

        }
        Axios.get(url, config)
            .then(res => {
                // const results = res.data.restaurants
                const results = res.data.nearby_restaurants
                const restaurants = []
                for (let i = 0; i < results.length; i++) {
                    let each_restaurant = {}
                    each_restaurant['name'] = results[i]['restaurant']['name']
                    each_restaurant['rating'] = results[i]['restaurant']['user_rating']['aggregate_rating']
                    each_restaurant['rating_text'] = results[i]['restaurant']['user_rating']['rating_text']
                    each_restaurant['votes'] = results[i]['restaurant']['user_rating']['votes']
                    each_restaurant['timing'] = results[i]['restaurant']['timings']
                    each_restaurant['price_range'] = results[i]['restaurant']['price_range']
                    each_restaurant['address'] = results[i]['restaurant']['location']['address']
                    each_restaurant['cuisines'] = results[i]['restaurant']['cuisines']
                    each_restaurant['cost_for_two'] = results[i]['restaurant']['average_cost_for_two']
                    each_restaurant['lat'] = results[i]['restaurant']['location']['latitude']
                    each_restaurant['lng'] = results[i]['restaurant']['location']['longitude']
                    // each_restaurant['photo_url'] = results[i]['restaurant']['photos'][0]['photo']['url']
                    each_restaurant['photo_url'] = results[i]['restaurant']['featured_image']


                    restaurants.push(each_restaurant)
                }

                this.setState({
                    restaurant_list: restaurants
                });
            });
    }

    handlePlaceChanged = (e) => {
        const place = this.autocomplete.getPlace();

        if (place.geometry) {
            const place_lat = place.geometry.location.lat()
            const place_lng = place.geometry.location.lng()

            this.setState({
                location: { lat: place_lat, lng: place_lng }
            })

        }

    }

    handleChangeLocation = (e) => {
        e.preventDefault()
        this.setState({
            location: e.target.value,
        })


    }


    getLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(this.showPosition, this.showError)

        } else {
            console.log("Geolocation is not supported by this browser.")
        }
    }

    showPosition = (position) => {
        this.setState({
            location: { "lat": position.coords.latitude, "lng": position.coords.longitude }
        })
        toast.success("Your current location is chosen", {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true
        });
    }

    showError = () => {
        console.log('Errors')
    }

    refresh = () => {
        const { rounds } = this.state
        if (rounds < (display_round.length - 1)) {
            this.setState({
                rounds: this.state.rounds + 1
            })
        } else {
            this.setState({
                rounds: 0
            })
        }
    }

    goToMap = data => {
        const target = encodeURI(data)
        return window.open(`https://www.google.com/maps/search/?api=1&query=${target}`)
    }

    handleFlipA = (e) => {
        e.preventDefault()
        this.setState(prevState => ({
            isFlippedA: !prevState.isFlippedA
        }))
    }

    handleFlipB = (e) => {
        e.preventDefault()
        this.setState(prevState => ({
            isFlippedB: !prevState.isFlippedB
        }))
    }

    handleFlipC = (e) => {
        e.preventDefault()
        this.setState(prevState => ({
            isFlippedC: !prevState.isFlippedC
        }))
    }


    render() {
        const { restaurant_list, location, rounds } = this.state

        const i = display_round[rounds]

        console.log(restaurant_list[i[0]])
        console.log(location.lat)
        console.log(location.lng)

        if (restaurant_list.length == 0) {
            return (
                <DiscoverForm>
                    <p id='discover_welcome_text'>Discover top restaurants nearby</p>
                    <div className="location">
                        <div className='discover_input_form'>
                            <div class='input_location_div'>
                                <input className='input_location' ref={this.autocompleteInput} onChange={this.handleChangeLocation} id="autocomplete" placeholder="Input location" type="text"></input>
                            </div>
                            <button id='get_current_location_btn' onClick={this.getLocation}>Get current location</button>

                        </div>
                        <button id="discover_button" onClick={this.discover} disabled={!location} size="large">Discover</button>
                    </div>
                </DiscoverForm>
            )
        }

        return (
            <Discover>

                <h4 id='discover_page_text'>Restaurants around you</h4>
                <button id='refresh-btn' onClick={this.refresh}>Refresh</button>


                {/* first card - front */}
                <div className="cards_container">
                    <ReactCardFlip isFlipped={this.state.isFlippedA} flipDirection="horizontal">
                        <Card key='front'>
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardTitle>{restaurant_list[i[0]]['name']}</CardTitle>
                            </CardBody>
                            <img width="100%" src={restaurant_list[i[0]]['photo_url']} alt="Card cap" />
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardText>Rating: {restaurant_list[i[0]]['rating']} - {restaurant_list[i[0]]['votes']} people votes</CardText>
                                <CardText>Price range: {restaurant_list[i[0]]['price_range']} - Cost for two: {restaurant_list[i[0]]['cost_for_two']} </CardText>
                                <CardText>Operating Hours: {restaurant_list[i[0]]['timing']} </CardText>
                                {/* <Button onClick={() => this.goToMap(restaurant_list[i[0]]['address'])} className="letgo_button btn-danger" >Let's go</Button> */}

                                <div className="btn_container">
                                    <Button onClick={() => this.goToMap(restaurant_list[i[0]]['address'])} className="letgo_button btn-danger" >Let's go</Button>
                                    <Button className="btn-info" onClick={this.handleFlipA} >More details</Button>
                                </div>

                            </CardBody>
                        </Card>

                        <Card key="back">
                            <CardTitle>{restaurant_list[i[0]]['name']}</CardTitle>
                            <CardBody>
                                <CardText><span>Cuisine:</span> {restaurant_list[i[0]]['cuisines']}</CardText>
                                <CardText><span>Price Range:</span> {restaurant_list[i[0]]['price_range']}</CardText>
                                <CardText><span>Address:</span> <span className="address">{restaurant_list[i[0]]['address']}</span></CardText>
                                <div className="btn_container_2">
                                    <Button onClick={this.goToMap} className="btn-success">Let's GO</Button>
                                    <Button className="btn-info" onClick={this.handleFlipA}>Back to front</Button>
                                </div>
                            </CardBody>
                        </Card>

                    </ReactCardFlip>

                    {/* second card - front */}
                    <ReactCardFlip isFlipped={this.state.isFlippedB} flipDirection="horizontal">
                        <Card key='front'>
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardTitle>{restaurant_list[i[1]]['name']}</CardTitle>
                            </CardBody>
                            <img width="100%" src={restaurant_list[i[1]]['photo_url']} alt="Card cap" />
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardText>Rating: {restaurant_list[i[1]]['rating']} - {restaurant_list[i[1]]['votes']} people votes</CardText>
                                <CardText>Price range: {restaurant_list[i[1]]['price_range']} - Cost for two: {restaurant_list[i[1]]['cost_for_two']} </CardText>
                                <CardText>Operating Hours: {restaurant_list[i[1]]['timing']} </CardText>

                                <div className="btn_container">
                                    <Button onClick={() => this.goToMap(restaurant_list[i[1]]['address'])} className="btn-danger" >Let's go</Button>
                                    <Button className="btn-info" onClick={this.handleFlipB}>More details</Button>
                                </div>
                            </CardBody>
                        </Card>

                        <Card key="back">
                            <CardTitle>{restaurant_list[i[0]]['name']}</CardTitle>
                            <CardBody>
                                <CardText><span>Cuisine:</span> {restaurant_list[i[0]]['cuisines']}</CardText>
                                <CardText><span>Price Range:</span> {restaurant_list[i[0]]['price_range']}</CardText>
                                <CardText><span>Address:</span> <span className="address">{restaurant_list[i[0]]['address']}</span></CardText>
                                <div className="btn_container_2">
                                    <Button onClick={this.goToMap} className="btn-success">Let's GO</Button>
                                    <Button className="btn-info" onClick={this.handleFlipB}>Back to front</Button>
                                </div>
                            </CardBody>
                        </Card>
                    </ReactCardFlip>


                    {/* third card - front */}

                    <ReactCardFlip isFlipped={this.state.isFlippedC} flipDirection="horizontal">
                        <Card key='front'>
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardTitle>{restaurant_list[i[2]]['name']}</CardTitle>
                            </CardBody>
                            <img width="100%" src={restaurant_list[i[2]]['photo_url']} alt="Card cap" />
                            <CardBody className="d-flex flex-column align-items-center">
                                <CardText>Rating: {restaurant_list[i[2]]['rating']} - {restaurant_list[i[2]]['votes']} people votes</CardText>
                                <CardText>Price range: {restaurant_list[i[2]]['price_range']} - Cost for two: {restaurant_list[i[2]]['cost_for_two']} </CardText>
                                <CardText>Operating Hours: {restaurant_list[i[2]]['timing']} </CardText>

                                <div className="btn_container">
                                    <Button onClick={() => this.goToMap(restaurant_list[i[2]]['address'])} className="btn-danger" >Let's go</Button>
                                    <Button className="btn-info" onClick={this.handleFlipC}>More details</Button>
                                </div>
                            </CardBody>
                        </Card>

                        <Card key="back">
                            <CardTitle>{restaurant_list[i[0]]['name']}</CardTitle>
                            <CardBody>
                                <CardText><span>Cuisine:</span> {restaurant_list[i[0]]['cuisines']}</CardText>
                                <CardText><span>Price Range:</span> {restaurant_list[i[0]]['price_range']}</CardText>
                                <CardText><span>Address:</span> <span className="address">{restaurant_list[i[0]]['address']}</span></CardText>
                                <div className="btn_container_2">
                                    <Button onClick={this.goToMap} className="btn-success">Let's GO</Button>
                                    <Button className="btn-info" onClick={this.handleFlipC}>Back to front</Button>
                                </div>
                            </CardBody>
                        </Card>

                    </ReactCardFlip>
                </div>
            </Discover>

        )
    }
}