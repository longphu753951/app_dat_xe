import React,{Component} from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Linking,
    Alert,
    Image} from "react-native";
import MapView, {Marker,Polyline} from 'react-native-maps';
import {localhost} from '../config/googleAPI';
import socketIO from "socket.io-client";
import BottomButton from "../components/botomButton";
import BackgroundGeolocation from "@mauron85/react-native-background-geolocation";


export default class driverMap extends Component {
    constructor(props){
        super(props);
        this.state = {
            lookingForPassenger: false,
            passengerFound: false,
        };
        this.acceptPassengerRequest = this.acceptPassengerRequest.bind(this);
        this.requestPassenger = this.requestPassenger.bind(this);
        this.socket = null;
    }

   
    componentDidMount() {
      BackgroundGeolocation.configure({
        desiredAccuracy: BackgroundGeolocation.HIGH_ACCURACY,
        stationaryRadius: 50,
        distanceFilter: 50,
        debug: false,
        startOnBoot: false,
        stopOnTerminate: true,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 10000,
        fastestInterval: 5000,
        activitiesInterval: 10000,
        stopOnStillActivity: false
      });
  
      BackgroundGeolocation.on("authorization", status => {
        console.log(
          "[INFO] BackgroundGeolocation authorization status: " + status
        );
        if (status !== BackgroundGeolocation.AUTHORIZED) {
          // we need to set delay or otherwise alert may not be shown
          setTimeout(
            () =>
              Alert.alert(
                "App requires location tracking permission",
                "Would you like to open app settings?",
                [
                  {
                    text: "Yes",
                    onPress: () => BackgroundGeolocation.showAppSettings()
                  },
                  {
                    text: "No",
                    onPress: () => console.log("No Pressed"),
                    style: "cancel"
                  }
                ]
              ),
            1000
          );
        }
      });
    }

    requestPassenger(){
        
        if(!this.state.lookingForPassenger)
        {
            this.setState({lookingForPassenger: true});

            this.socket = socketIO.connect(`http://${localhost}:3030`);

            this.socket.on("connect",()=>{
                this.socket.emit("lookingForPassenger");
            });

            this.socket.on("taxiRequest",  (routeResponse)=>{
                
                this.setState({
                    lookingForPassenger: false,
                    passengerFound: true,
                    routeResponse
                });
                this.props.getRouteDirection(routeResponse.geocoded_waypoints[0].place_id,"nowhere");
                this.map.fitToCoordinates(this.props.pointCoords,{
                    edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
                })
            });

        }
        
    }

    acceptPassengerRequest(){
        const passengerLocation = this.props.pointCoords[
            this.props.pointCoords.length -1
        ];
        
        BackgroundGeolocation.on("location", location => {
          console.log("send places");
          this.socket.emit("driverLocation", {
            latitude: location.latitude,
            longitude: location.longitude
          });
        });
    
        BackgroundGeolocation.checkStatus(status => {
         
          if (!status.isRunning) {
            BackgroundGeolocation.start(); 
          }
        });
        console.log("Send place");
        /*this.socket.emit("driverLocation",{
          latitude:this.props.latitude, 
          longitude: this.props.longitude,
      });*/
        
        Linking.openURL(
            `geo:0,0?q=${passengerLocation.latitude},${
                passengerLocation.longitude
              }(Passenger)`
        );
    }

    render(){
        let endMarker = null;
        let startMarker = null;
        let findingPassengerActIndicator = null;
        let passengerSearchText = "FIND PASSENGERS";
        let bottomButtonFunction = this.requestPassenger;

        if(this.props.latitude === null){
            return null;
        }

        if (this.state.lookingForPassenger) {
            passengerSearchText = "FINDING PASSENGERS...";
            findingPassengerActIndicator = (
              <ActivityIndicator
                size="large"
                color="#fff"
                animating={this.state.lookingForPassenger}
              />
            );
        }

        if (this.state.passengerFound) {
            passengerSearchText = "FOUND PASSENGER! ACCEPT RIDE?";
            bottomButtonFunction =this.acceptPassengerRequest;
        }

        if (this.props.pointCoords.length > 1) {
            endMarker = (
              <Marker
                coordinate={this.props.pointCoords[this.props.pointCoords.length - 1]}
              >
                <Image
                  style={{ width: 40, height: 40 }}
                  source={require("../assets/passenger.png")}
                />
              </Marker>
            );
          }

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
                    strokeColor= "green"
                />
                {endMarker}
                {startMarker}
                </MapView>
                <BottomButton
                    onPressFunction={bottomButtonFunction}
                    buttonText={passengerSearchText}
                >
                {findingPassengerActIndicator}
                </BottomButton>
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
