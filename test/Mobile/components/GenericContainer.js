import React, {Component} from "react";
import {Keyboard, PermissionsAndroid} from "react-native";
import {API_KEY} from '../config/googleAPI';
import Geolocation from "@react-native-community/geolocation";
import PolyLine from '@mapbox/polyline';

const genericContainer = (WrapperComponent)=>{
    return class extends Component{
        constructor(props){
            super(props);
            this.state = {
                latitude: null,
                longitude: null,
                pointCoords:[],
                routeResponse: {},
                destination: '',
            }
            this.getRouteDirection = this.getRouteDirection.bind(this);
        }

        componentWillUnmount(){
            Geolocation.clearWatch(this.watchId);
        }

        async checkAndroidPermissions() {
            try {
              const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                  title: "Lyft",
                  message:
                    "Ứng dụng này sẽ cần phải định vị vị trí của bạn !!!"
                }
              );
              if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
              } else {
                return false;
              }
            } catch (err) {
              console.warn(err);
            }
          }

        async componentDidMount(){
              let granted = false;
              granted = await this.checkAndroidPermissions();
              if(granted){
                this.watchId =Geolocation.watchPosition(
                    position=>{
                        this.setState({
                            latitude: position.coords.latitude,
                            longitude: position.coords.longitude,
                        });
                    },
                    error=> this.setState({error: error.message})
                  );
              }
        }
        

        async getRouteDirection(placeId,placeName){
            try{
                const api = `https://maps.googleapis.com/maps/api/directions/json?origin=${this.state.latitude},${this.state.longitude}&destination=place_id:${placeId}&key=${API_KEY}`;
                console.log(api);
                const result = await fetch(api);
                const json = await result.json();
                const points = PolyLine.decode(json.routes[0].overview_polyline.points);
                const pointCoords = points.map(point => {
                    return { latitude: point[0], longitude: point[1] };
                });
                this.setState({
                    pointCoords, 
                    predictions:[],
                    routeResponse: json
                });
                Keyboard.dismiss();
                this.map.fitToCoordinates(pointCoords,{
                    edgePadding: { top: 20, bottom: 20, left: 20, right: 20 }
                });
            }catch(error){
                console.log(error);
            }
        }
    

        render(){
            return <WrapperComponent
                getRouteDirection= {this.getRouteDirection}
                latitude={this.state.latitude}
                longitude ={this.state.longitude}
                pointCoords={this.state.pointCoords}
                routeResponse={this.state.routeResponse}
                destination={this.state.destination}
            />;
        }
    };
}

export default genericContainer;