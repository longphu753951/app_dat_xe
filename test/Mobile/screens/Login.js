import React,{Component} from "react";
import {
    Text,
    View,
    StyleSheet,TextInput, Button,Image,TouchableOpacity,Alert
} from "react-native";
import {test2o,localhost} from '../config/googleAPI';
import axios from "axios";
axios.defaults.baseURL = `http://${localhost}:4000`;
axios.defaults.timeout= 5000;
var jwtDecode = require('jwt-decode');
import PassengerMap from './PassengerMap';
import DriverMap from './DriverMap';
import GenericContainer from "../components/GenericContainer";

const DriverWithGenericConainer = GenericContainer(DriverMap);
const PassengerWithGenericConainer = GenericContainer(PassengerMap);

export default class LoginPage extends Component{
    constructor(props){
        super(props);
        this.state={
            telephone:"",
            password:"",
            isDriver: false,
            isPassenger : false,
        }
        this.handleSignIn = this.handleSignIn.bind(this);
    }

    async handleSignIn() {
      driver = false;
      passenger= false;
      try {
        const { telephone, password } = this.state;
        console.log(this.state.telephone, this.state.password);
        const result = await axios.post("/user/login", { telephone, password }, {
          headers: {
            'Authorization': test2o 
          }
        }).then(function (response) {
          
          console.log(response.data.token);
          var decoded = jwtDecode(response.data.token);
          console.log(decoded.kind);
          if(decoded.kind == "Passenger"){
            passenger = true;
          }
          else{
            driver = true
          }
        })
        .catch(function (error) {
          // handle error
          Alert.alert("Log in fail",error.response.data.error);
          
        });
      } catch (error) {
        this.setState({ errorMessage: error.response.data.message });
      }
      this.setState({isPassenger:passenger,isDriver:driver});
      
    }
    
    render(){
      const { navigation } = this.props;
      if (this.state.isPassenger){
        navigation.navigate('passengerScreen');
      }
      if (this.state.isDriver){
        navigation.navigate('driverScreen');
      }
        return(
            <View style={styles.container}>
            <View style={styles.logo_container}>
                <Image style={styles.logo}
                    source={require('../assets/lyft_logo.png')}>
                </Image>
            </View>
            <View style={styles.title_container}>
                <Text style={styles.fontTitle}>Hello~{"\n"}Welcome back{"\u2764"}</Text>
            </View>
            <View>
            <TextInput
                placeholder="Telephone"
                returnKeyType={'next'}
                keyboardType={'phone-pad'}
                selectionColor="#ef0376"
                value={this.state.telephone}
                onChangeText={telephone=>{
                  this.setState({telephone:telephone})
                }}
                style={styles.textInput}/>
            </View>
            <View>
              <TextInput
                  placeholder="Password"
                  selectionColor="#ef0376"
                  secureTextEntry={true}
                  value={this.state.password}
                  onChangeText={password=>{
                    this.setState({password:password})
                  }}
                  style={styles.textInput}/>
            </View>
            <View>
              <Button style={styles.button} title="Login" color='#ef0376' onPress={this.handleSignIn} />
               
            </View>
            <View style={styles.signUp}>
                <Text style={styles.newUser}>NEW USER ?</Text>
                <TouchableOpacity >
                  <Text style={styles.signUpFont} onPress={()=>{navigation.navigate('signUpScreen')}}>LOG IN</Text>
                </TouchableOpacity>
            </View>
            
        </View>
        )
    }
}
    
const styles = StyleSheet.create({

    loading: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      alignItems: 'center',
      justifyContent: 'center'
    },

      signUp:{
        marginLeft:5,
        marginTop: 50,
        marginBottom:15,
        flexDirection:'row',
      },
      newUser:{
        fontSize:18,
        fontFamily:"Roboto_400Regular",
        color:'#969090',
      },
      signUpFont:{
        fontSize:18,
        fontFamily:"Roboto_400Regular",
        color:'#ef0376',
        paddingLeft: 12,
      },
      container:{
        flex:1,
        flexDirection:'column',
        justifyContent: 'flex-end',
        paddingLeft:30,
        paddingTop: 50,
        backgroundColor:"#fff",
        paddingRight:30,
      },
      
      logo_container:{
       width:200,
       height:120,
       marginBottom:30,
      },
      logo:{
        width:81*2,
        height:60*2,
      },
      fontTitle:{
          fontSize:30,
          fontFamily:"Roboto_700Bold",
      },
      textButtonSignIn:{
        color: '#ffff',
      },
      textInput:{
        borderBottomColor: '#ef0376',
        borderBottomWidth: 2  ,
        marginBottom:25,
        fontSize:20,
      },
      button:{
        marginTop: 30,
        paddingTop:8,
        paddingBottom:8,
        
      }
  })
