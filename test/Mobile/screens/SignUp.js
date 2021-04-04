import React,{Component} from "react";
import {Picker} from '@react-native-picker/picker';
import {View,Text,StyleSheet,Image, ScrollView,Alert} from 'react-native';
import { TextInput, Button  } from 'react-native-paper';
import {test2o,localhost} from '../config/googleAPI';
import axios from "axios";
axios.defaults.baseURL = `http://${localhost}:4000`;
axios.defaults.timeout= 5000;
var jwtDecode = require('jwt-decode');

export default class SignUpPage extends Component{
    constructor(props){
        super(props);
        this.state={
          firstName: "",
          lastName: "",
          telephone: "",
          email:"",
          password:"",
          passwordConfirm:"",
          loaiTaiKhoan:"Passenger"
        }
        this.handleSignUp = this.handleSignUp.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePasswordConfirm = this.handlePasswordConfirm.bind(this);
    }
      
     handleEmail=(email)=>{
        var re = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
        return re.test(email);
      }
     handlePassword=(password)=>{
        var re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm;
        return re.test(password);
      }
      handlePasswordConfirm=(password,passwordConfirm)=>{
        return (password == passwordConfirm)? true : false;
      }

      async handleSignUp(){
          const { firstName, lastName, telephone,email,password,passwordConfirm} = this.state;
          if(!this.handleEmail(email))
          {
            alert("Vui lòng nhập đúng email");
            return;
          }
          else if(!this.handlePassword(password)){
            alert("Mật khẩu phải trên 8 ký tự, có ký tự hoa, thường, số và ký tự đặc biệt!!");
            return;
          }
          else if(!this.handlePasswordConfirm(password,passwordConfirm)){
            alert("Mật khẩu xác thực phải đúng với mật khẩu");
            return;
          }
          else if(!firstName.lenght == 0 || !lastName.lenght == 0){
            alert("Vui lòng điền đầy đủ thông tin");
            return;
          }
          else if(telephone.length != 10){
            alert("Số điện thoại phải có 10 ký tự");
            return;
          }
          try {
            let route = "";
            if(this.state.loaiTaiKhoan =="Passenger")
              route ="/Passenger/Signup";
            else
              route ="/Driver/Signup";
            const result = await axios.post(route, { firstName, lastName, telephone,email,password}, {
              headers: {
                'Authorization': test2o 
              }
            }).then(function (response) {
                Alert.alert("Đăng ký thành công", result.response.data);
            })
            .catch(function (error) {
             Alert.alert("Đăng ký không thành công",error.response.data);
            });
          } catch (error) {
          }
      }
    render(){
        return(
            <ScrollView>
                <View style={styles.container}>
                  <View style={styles.logo_container}>
                    <Image style={styles.logo}
                        source={require('../assets/lyft_logo_register.png')}>
                    </Image>
                  </View>
                  <View style={styles.welcome_view}>
                    <Text style={styles.welcome_text1}>Welcome abroad</Text>
                    <Text style={styles.welcome_text2}>Sign up with Lyft in Simple step</Text>
                  </View>
                  <View style={styles.input_view}>
                    <View style={styles.name_view}>
                      <TextInput
                          label="First name"
                          mode="outlined"
                         
                          returnKeyType={'next'}
                          keyboardType={'default'}
                          selectionColor="#ef0376"
                          value={this.state.firstName}
                          onChangeText={firstName=>{
                            this.setState({firstName:firstName})
                          }}
                          theme={{ colors: { primary: '#ef0376' } }}
                          style={styles.input_view_name}/>
                        <TextInput
                          label="Last name"
                          mode="outlined"
                          
                          returnKeyType={'next'}
                          keyboardType={'default'}
                          selectionColor="#ef0376"
                          value={this.state.lastName}
                          onChangeText={lastName=>{
                            this.setState({lastName:lastName})
                          }}
                          theme={{ colors: { primary: '#ef0376' } }}
                          style={styles.input_view_name}/>
                    </View>
                    <TextInput
                        label="Telephone"
                        mode="outlined"
                        value={this.state.telephone}
                          onChangeText={telephone=>{
                            this.setState({telephone:telephone})
                          }}
                        returnKeyType={'next'}
                        keyboardType={'phone-pad'}
                        left={<TextInput.Icon name="phone"/>}
                        selectionColor="#ef0376"
                        secureTextEntry={true}
                        theme={{ colors: { primary: '#ef0376' } }}
                        style={styles.textInput}/>
                      <TextInput
                        label="Email"
                        mode="outlined"
                        value={this.state.email}
                        onChangeText={email=>{
                          this.setState({email:email})
                        }}
                        returnKeyType={'next'}
                        keyboardType={'email-address'}
                        left={<TextInput.Icon name="email"/>}
                        selectionColor="#ef0376"
                        secureTextEntry={true}
                        theme={{ colors: { primary: '#ef0376' } }}
                        style={styles.textInput}/>
                      <TextInput
                        label="Password"
                        mode="outlined"
                        value={this.state.password}
                        onChangeText={password=>{
                          this.setState({password:password})
                        }}
                        left={<TextInput.Icon name="lock"/>}
                        selectionColor="#ef0376"
                        secureTextEntry={true}
                        theme={{ colors: { primary: '#ef0376' } }}
                        style={styles.textInput}/>
                      <TextInput
                        label="Password Confirm"
                        mode="outlined"
                        value={this.state.passwordConfirm}
                        onChangeText={passwordConfirm=>{
                          this.setState({passwordConfirm:passwordConfirm})
                        }}
                        left={<TextInput.Icon name="lock"/>}
                        selectionColor="#ef0376"
                        secureTextEntry={true}
                        theme={{ colors: { primary: '#ef0376' } }}
                        style={styles.textInput}/>
                        <View style={{borderRadius: 5, borderWidth: 2, borderColor: '#bdc3c7', overflow: 'hidden',marginTop:12,padding:4}}>
                        <Picker style={{flex:1}}
                            selectedValue={this.state.loaiTaiKhoan}
                            onValueChange={(itemValue, itemIndex) =>
                              this.setState({loaiTaiKhoan: itemValue})
                            }
                            >
                            <Picker.Item label="Passenger" value="Passenger" />
                            <Picker.Item label="Driver" value="Driver" />
                          </Picker>
                        </View>
                  </View>
                  <Button color="#ef0376" mode="contained" style={styles.button}
                   onPress={() => {
                    this.handleSignUp();
                  }}>
                    Sign Up
                  </Button>
                </View>
                
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
  ScrollView:{
    flexDirection: 'column',
  },
  name_view:{
    flexDirection: 'row',
    marginBottom:10,
  },
  container:{
    backgroundColor:'#fff',
    
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo_container:{
    alignItems: 'center',
    marginTop: 50,
   },
   logo:{
     width:150,
     height:150,
     borderRadius: 10,
   },
   welcome_view:{
     alignItems:'center',
     marginTop: 20,
     marginBottom:15,
   },
   welcome_text1:{
     fontFamily: 'Roboto_400Regular',
     fontSize: 25,
   },
   welcome_text2:{
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
  },
  textInput:{     
    backgroundColor:'#fff',
    marginBottom:5,
  },
  input_view:{
    width: 350,
  },
  input_view_name: {
    width:180,
    paddingRight: 12,
    backgroundColor:'#fff',
  },
  button:{
    marginTop: 30,
    paddingTop:8,
    paddingBottom:8,
    width: 350,
    marginBottom: 20,
  }
});