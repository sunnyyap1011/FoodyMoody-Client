import React from 'react'
import styled from 'styled-components'
import {
    Card, CardText, CardBody,
    CardTitle, Button
} from 'reactstrap';
import Axios from 'axios';
import "../discover_page.css";

import { ToastContainer, toast } from 'react-toastify';

const Discover = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #9dbde3;
    color: black;
    #card_container {
        display: flex;
        .card {
            width: 30%;
            margin: 0.5rem;
            height: 100%;
            .img {
                height: 50%;
                width: 100%;
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
            rounds: 0
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
                { 'user-key': 'b4073a8a5aadcf3500d69d4b861b218b'},
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
                <h4>This is the DiscoverPage</h4>
                <button onClick={this.refresh}>Refresh</button>

                <div id="card_container">
                    <Card>
                        <CardBody className="d-flex flex-column align-items-center">
                            <CardTitle>{restaurant_list[i[0]]['name']}</CardTitle>
                        </CardBody>
                        <img width="100%" src={restaurant_list[i[0]]['photo_url']} alt="Card cap" />
                        <CardBody className="d-flex flex-column align-items-center">
                            <CardText>Rating: {restaurant_list[i[0]]['rating']} - {restaurant_list[i[0]]['votes']} people votes</CardText>
                            <CardText>Price range: {restaurant_list[i[0]]['price_range']} - Cost for two: {restaurant_list[i[0]]['cost_for_two']} </CardText>
                            <CardText>Operating Hours: {restaurant_list[i[0]]['timing']} </CardText>
                            <Button onClick={() => this.goToMap(restaurant_list[i[0]]['address'])} className="btn-danger" >Let's go</Button>
                        </CardBody>
                    </Card>
                    <Card>
                        <CardBody className="d-flex flex-column align-items-center">
                            <CardTitle>{restaurant_list[i[1]]['name']}</CardTitle>
                        </CardBody>
                        <img width="100%" src={restaurant_list[i[1]]['photo_url']} alt="Card cap" />
                        <CardBody className="d-flex flex-column align-items-center">
                            <CardText>Rating: {restaurant_list[i[1]]['rating']} - {restaurant_list[i[1]]['votes']} people votes</CardText>
                            <CardText>Price range: {restaurant_list[i[1]]['price_range']} - Cost for two: {restaurant_list[i[1]]['cost_for_two']} </CardText>
                            <CardText>Operating Hours: {restaurant_list[i[1]]['timing']} </CardText>
                            <Button onClick={() => this.goToMap(restaurant_list[i[1]]['address'])} className="btn-danger" >Let's go</Button>
                        </CardBody>
                    </Card>

                    <Card>
                        <CardBody className="d-flex flex-column align-items-center">
                            <CardTitle>{restaurant_list[i[2]]['name']}</CardTitle>
                        </CardBody>
                        <img width="100%" src={restaurant_list[i[2]]['photo_url']} alt="Card cap" />
                        <CardBody className="d-flex flex-column align-items-center">
                            <CardText>Rating: {restaurant_list[i[2]]['rating']} - {restaurant_list[i[2]]['votes']} people votes</CardText>
                            <CardText>Price range: {restaurant_list[i[2]]['price_range']} - Cost for two: {restaurant_list[i[2]]['cost_for_two']} </CardText>
                            <CardText>Operating Hours: {restaurant_list[i[2]]['timing']} </CardText>
                            <Button onClick={() => this.goToMap(restaurant_list[i[2]]['address'])} className="btn-danger" >Let's go</Button>
                        </CardBody>
                    </Card>
                </div>
            </Discover>
        )
    }
}