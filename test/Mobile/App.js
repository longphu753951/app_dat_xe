import React,{Component} from 'react';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
//import {StyleSheet,Button,View} from 'react-native';
import PassengerMap from './screens/PassengerMap';
import DriverMap from './screens/DriverMap';
import GenericContainer from "./components/GenericContainer";
import LoginScreen from "./screens/Login";
import SignUpScreen from "./screens/SignUp";

const DriverWithGenericConainer = GenericContainer(DriverMap);
const PassengerWithGenericConainer = GenericContainer(PassengerMap);


const Stack = createStackNavigator();

export default class App extends Component{
  constructor(props){
    super(props);
  }

  render(){
    return(
      <NavigationContainer>
        <Stack.Navigator initialRouteName="loginScreen">
          <Stack.Screen name="loginScreen" component={LoginScreen} options={{headerShown: false}} />
          <Stack.Screen name="signUpScreen" component={SignUpScreen} options={{headerTransparent:true,headerTitle:false,headerTintColor:"#ef0376"}} />
          <Stack.Screen name="driverScreen" component={DriverWithGenericConainer} options={{headerTransparent:true,headerTitle:false,headerTintColor:"#ef0376"}}/>
          <Stack.Screen name="passengerScreen" component={PassengerWithGenericConainer} options={{headerTransparent:true,headerTitle:false,headerTintColor:"#ef0376"}}/>
        </Stack.Navigator>
    </NavigationContainer>
    )
  }
}

/*export default class App extends Component {
    constructor(props){
        super(props);
        this.state={
            isDriver: false,
            isPassenger : false,
        }
    }
    render(){
        if (this.state.isPassenger){
            return(
                <PassengerWithGenericConainer/>
            )
        }
        if (this.state.isDriver){
            return(
                <DriverWithGenericConainer/>
            )
        }
        return(
            <View style={styles.container}>
                <Button 
                    onPress={()=>{this.setState({isPassenger : true})}} title="Passenger"/>
                <Button 
                    onPress={()=>{this.setState({isDriver : true})}} title="Driver"/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex : 1,
        marginTop: 50,
    },
});
*/


