//from student of HCMC OPEN UNIVERSITY with love
//Coded by Tran Long Phu_1751010108_2020

import React,{Component} from "react";  
import {
    TextInput,
    Text,
    View,
    StyleSheet,
    TouchableHighlight,
    TouchableOpacity,
    Keyboard,
    ActivityIndicator,Image} from "react-native";
import MapView, {Marker,Polyline} from 'react-native-maps';
import {API_KEY, localhost} from '../config/googleAPI';
import _ from "lodash";
import socketIO from "socket.io-client";
import BottomButton from "../components/botomButton";


export default class passengerMap extends Component {

    constructor(props){
        super(props);
        this.state = {
            predictions:[],
            lookingForDriver: false,
            buttonText:"REQUEST",
            driverIsOnTheWay: false,
        };
        this.onChangeDestinationDebounced = _.debounce(
            this.onChangeDestination,
            1000
        );
    }

    async onChangeDestination(destination){
        this.setState({ destination });
        const apiURL = `https://maps.googleapis.com/maps/api/place/autocomplete/json?key=${API_KEY}
        &input=${destination}&location=${this.props.latitude},${this.props.longitude
        }&radius=2000`;
        try{
            const result = await fetch(apiURL);
            const json = await result.json();
            this.setState({
                predictions:json.predictions,
            });
        }catch(err){
            console.error(err);
        }
    }

    async requestDriver(){
        this.setState({lookingForDriver: true,buttonText:"REQUESTING"});
        const socket = socketIO.connect(`http://${localhost}:3030`);

        socket.on("connect",()=>{
            console.log("client connected");
            socket.emit("taxiRequest",this.props.routeResponse);
        });

        socket.on("driverLocation", driverLocation=>{
            console.log(driverLocation);
            const pointCoords =[...this.props.pointCoords, driverLocation];
            this.map.fitToCoordinates(pointCoords,{
                edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
            })
            this.setState({lookingForDriver:false, buttonText:"FOUND DRIVER",driverIsOnTheWay:true,driverLocation});
        });
    }

    render(){
        let marker = null;
        let driverButton = null;
        let finding4Driver = null ;
        let driverMarker = null;

        if(this.props.latitude == null){
            return null;
        }

        if(this.state.driverIsOnTheWay){
            driverMarker =(<Marker coordinate={this.state.driverLocation}>
                <Image
                    source={require("../assets/driver.png")}
                    style={{width:40, height:20}}/>
            </Marker>)
        }

        if(this.state.lookingForDriver){
            finding4Driver =(
                <ActivityIndicator
                size = "large"
                color="#fff"
                animating={this.state.lookingForDriver}/>
            );
        }

        if(this.props.pointCoords.length > 1){
            marker = (
                <Marker
                    coordinate={this.props.pointCoords[this.props.pointCoords.length -1]}
                />
            );
            driverButton=(
                <BottomButton onPressFunction={() => this.requestDriver()}
                buttonText={this.state.buttonText}>
                    {finding4Driver}
                </BottomButton>
            )
        }


        const predictions = this.state.predictions.map(prediction => (
            <TouchableHighlight key={prediction.id} onPress={async ()=>{
                        await this.props.getRouteDirection(
                        prediction.place_id, 
                        prediction.structured_formatting.main_text);
                    this.setState({predictions:[], destination:prediction.structured_formatting.main_text});   
                    this.map.fitToCoordinates(this.props.pointCoords,{
                        edgePadding:{top:20, bottom:20, left: 20, right: 20}
                    });
                }}>
                <Text style={styles.suggestion}>
                    {prediction.description}
                </Text>
            </TouchableHighlight>

        ));
        return (
            <View style={styles.container}>
                <MapView
                ref={map=>{
                    this.map = map;
                }}
                style={styles.map}
                region={{
                    latitude:this.props.latitude,
                    longitude:this.props.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}>
                <Polyline
                    coordinates={this.props.pointCoords}
                    strokeWidth={5}
                    strokeColor= "#ef0376"
                />
                {marker}
                {driverMarker}
                </MapView>
                <TextInput style={styles.destinationInput} 
                placeholder="Mời nhập điểm đến" 
                clearButtonMode="always"
                value={this.state.destination} 
                onChangeText={destination => {
                    console.log(destination);
                    this.setState({destination});
                    this.onChangeDestination(destination);

                }}
                />
                {predictions}
                {driverButton}
            </View>
           
        )
    }
}

const styles = new StyleSheet.create({
    bottomButton:{
        backgroundColor: "black",
        marginTop: "auto" ,
        margin: 20,
        padding: 15,
        paddingLeft: 30,
        paddingRight: 30,
        alignSelf: "center"
    },
    bottomButtonText: {
        fontSize: 20,
        color: "white",
        fontWeight: "600"
    },
    suggestion:{
        backgroundColor: "#fff",
        padding: 5,
        fontSize: 18,
        borderWidth: 0.5,
        marginLeft: 5,
        marginRight: 5
    },

    destinationInput:{
        height:40,
        borderWidth:0.5,
        marginTop:50,
        marginLeft:5,
        marginRight:5,
        padding:5,
        backgroundColor:"white",
    },
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
})
