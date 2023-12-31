import React, { useEffect, useState, useReducer} from 'react'
import '../styles/Auth.scss'
import tasks from '../assets/tasks.svg'
import axios from 'axios'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import {Puff} from  'react-loader-spinner'
import {InfinitySpin } from  'react-loader-spinner'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const usernameRegex = new RegExp(/^[a-zA-Z0-9_]{4,20}$/)
  const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{5,20}$/)
  const [isFocused, setIsFocused] = useState('');

  const [formData, setFormData] = useReducer(
    (state, newState) => ({...state, ...newState}),
    {
      username:'',
      password:'',
      confirmPassword:'',
    }
  )
  
  const [loader, setLoader] = useState(false)

  const [errorData, setErrorData] = useState({
    username:'',
    password:'',
    confirmPassword:'', 
  })

  const navigate = useNavigate()

  const [isValid, setisValid] = useState(false)

  // const API_URL = 'http://localhost:4000'
  const API_URL = 'https://taskify-api-fqvf.onrender.com'

  const toastify = (status, message) => {
    
    let toast_class = {
      className : `toast`,
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      closeOnClick: true,
      theme: 'dark',
      // transition: toast.TRANSITION.SLIDE
    }

    if (status === 'success') {
      toast.success(message, toast_class);
    }
    else{
      toast.error(message, toast_class);
    }
    
  };

  const isValidForm = ()=>{
    let [username, pass, repass] = [formData.username,formData.password,formData.confirmPassword]
    let [usernameError, passError, repassError] = [errorData.username,errorData.password,errorData.confirmPassword]
    
    if(username.length>0 && pass.length>0 && usernameError.length===0 && passError.length===0){
      if(!isLogin){
        if(repass.length>0 && repassError.length===0){
          setisValid(true)
        }else setisValid(false)
      }else{ 
        setisValid(true)
      }
    }else setisValid(false)


  }

  useEffect(() => {
    let username = sessionStorage.getItem('username')
    if(username){
      navigate('/todo')
    }
  }, [])

  useEffect(() => {
    isValidForm();
  }, [formData, errorData]);

  useEffect(() => {

    setFormData({
      username:'',
      password:'',
      confirmPassword:''
    })
    setErrorData({
      username:'',
      password:'',
      confirmPassword:'',
    })

    setisValid(false)
    setIsFocused('')
    setShowPassword(false)

    let [loginUsername, loginPassword] = [document.getElementById('login-username'), document.getElementById('login-password')]
    let [signupUsername, signupPassword, signupConfirmPassword] = [document.getElementById('signup-username'), document.getElementById('signup-password'), document.getElementById('signup-confirmPassword')]

    if(isLogin){
      loginUsername.value = ''
      loginPassword.value = ''
    }
    else{
      signupUsername.value = ''
      signupPassword.value = ''
      signupConfirmPassword.value = ''
    }

  }, [isLogin])

  
  const handleFormChange = (event, type)=>{
    let value = event.target.value
    switch(type){
      case 'username':
        if(usernameRegex.test(value)){ 
          setFormData( {...formData,username:value} )
          setErrorData( {...errorData,username:''} )
        }
        else setErrorData({...errorData,username:'Username not Valid!!'});
        break

      case 'password':
        if(passwordRegex.test(value)){
          setFormData( {...formData,password:value})
          setErrorData( {...errorData,password:''} )

          if(!isLogin){
            if(value!==formData.confirmPassword) setErrorData({...errorData,password : '', confirmPassword:'Password doesn\'t match!!'})
            else setErrorData({...errorData,confirmPassword:''})
          }

        }
        else{ 
          if(!isLogin){
            if(value!==formData.confirmPassword) setErrorData({...errorData,password:'Password not Valid!!', confirmPassword:'Password doesn\'t match!!'})
            else setErrorData({...errorData,confirmPassword:''})
          }
          else setErrorData({...errorData,password:'Password not Valid!!'});
        }

        break

      case 'confirmPassword':
        if(!isLogin){
          if(value===formData.password){
            setFormData( {...formData,confirmPassword:value} )
            setErrorData( {...errorData,confirmPassword:''} )
          }
          else setErrorData({...errorData,confirmPassword:'Password doesn\'t match!!'})
        }
        break
      
      default:
        break
    }
  }

  const handleLoginAndSignup = (action)=>{
    let postData = {
      username : formData.username,
      password : formData.password
    }

    setLoader(true)
    axios.post(`${API_URL}/${action}`, postData).then(
      (res)=>{
        setLoader(false)
        if(res.data.success){
          if(action==='register'){
            toastify('success', res.data.message)
            setIsLogin(true)
          }
          else{
            sessionStorage.setItem('username', formData.username)
            navigate('/todo')
          }
        }
        else{
          toastify('error', res.data.message)
        }
      }
    ).catch(
      (err)=>{
        setLoader(false)
        toastify('error', 'Something went wrong!!')
      }
    )

  }

  return (
    <div className="hero-box">
        
        <ToastContainer />
        {
            loader?
              <div className="loader">
                <Puff  width='200' color="#7c5cfc"/>
              </div>:null
          }
        

        <div className="left">
            <img src={tasks} alt="hero-img" />
        </div>
        <div className="right">
          {
            isLogin ? 
              <div className="box">
                <h1>Log<span>in</span></h1>
                <div className="form-box">

                  <div className="form-field">
                    
                    <p className="name">Username</p>
                    <div className="input"
                      style={{
                        border: isFocused==='username' ? '2px solid #7c5cfc' : '1px solid #ccc',
                      }}
                    >
                      <input 
                        id='login-username'
                        type="text" 
                        placeholder="Username" 
                        onChange={(event)=>{handleFormChange(event, 'username')}}
                        onFocus={()=>{setIsFocused('username')}}
                        onBlur={()=>{setIsFocused(false)}}
                        />
                    </div>
                    <p className="error">{errorData.username}</p>
                  </div>

                  <div className="form-field">
                    <p className="name">Password</p>
                    <div className="input"
                    style={
                      {
                        border: isFocused==='password' ? '2px solid #7c5cfc' : '1px solid #ccc',
                      }
                    }>
                      <input 
                        id='login-password'
                        type={showPassword?"text":"password"} 
                        placeholder="Password" 
                        onChange={(event)=>{handleFormChange(event, 'password')}}
                        onFocus={()=>{setIsFocused('password')}}
                        onBlur={()=>{setIsFocused(false)}}/>
                      {
                        showPassword?
                          <span className="material-symbols-outlined" onClick={()=>{setShowPassword(!showPassword)}}>visibility</span>
                        : <span className="material-symbols-outlined" onClick={()=>{setShowPassword(!showPassword)}}>visibility_off</span>

                      }
                    </div>
                    <p className="error">{errorData.password}</p>
                  </div>
                  
                </div>
                <div className="btm-box">
                  <button className="btn" 
                    onClick={()=>{handleLoginAndSignup('login')}}
                    style={{
                      backgroundColor: isValid ? '#7c5cfc' : '#ccc',
                      pointerEvents: isValid ? 'auto' : 'none'
                    }}
                  >Login</button>
                  <p className="text">Don't have an account? <span onClick={()=>setIsLogin(!isLogin)}>Sign Up</span></p>
                </div>
              </div>
            :
              <div className="box">
                <h1>Sign <span>Up</span></h1>
                <div className="form-box">

                  <div className="form-field" style={{
                    marginBottom: '0px'
                  }}>
                    <p className="name">Username</p>
                    <div className="input"
                      style={
                        {
                          border: isFocused==='username' ? '2px solid #7c5cfc' : '1px solid #ccc',
                        }
                      }
                    >
                      <input 
                        id='signup-username'
                        type="text" 
                        placeholder="Username" 
                        onChange={(event)=>handleFormChange(event, 'username')}
                        onFocus={()=>{setIsFocused('username')}}
                        onBlur={()=>{setIsFocused('')}}/>
                    </div>
                    <p className="error">{errorData.username}</p>
                  </div>

                  <div className="form-field">
                    <p className="name">Password</p>
                    <div className="input" style={
                      {
                        border: isFocused==='password' ? '2px solid #7c5cfc' : '1px solid #ccc',
                      }
                    }>
                      <input 
                        id='signup-password'
                        type={showPassword?"text":"password"} 
                        placeholder="Password" 
                        onChange={(event)=>{handleFormChange(event, 'password')}}
                        onFocus={()=>{setIsFocused('password')}}
                        onBlur={()=>{setIsFocused(false)}}
                      />
                      {
                        showPassword?
                          <span tabIndex={1} className="material-symbols-outlined" onClick={()=>{setShowPassword(!showPassword)}}>visibility</span>
                        : <span tabIndex={1} className="material-symbols-outlined" onClick={()=>{setShowPassword(!showPassword)}}>visibility_off</span>

                      }
                    </div>
                    <p className="error">{errorData.password}</p>
                  </div>

                  <div className="form-field">
                    <p className="name">Confirm Password</p>
                    <div className="input" style={
                      {
                        border: isFocused==='confirmPassword' ? '2px solid #7c5cfc' : '1px solid #ccc',
                      }
                    }>
                      <input 
                        type="text" 
                        id='signup-confirmPassword'
                        placeholder="Confirm Password" 
                        onChange={(event)=>{handleFormChange(event, 'confirmPassword')}}
                        onFocus={()=>{setIsFocused('confirmPassword')}}
                        onBlur={()=>{setIsFocused(false)}}
                        />
                    </div>
                    <p className="error">{errorData.confirmPassword}</p>
                  </div>
                  
                </div>
                <div className="btm-box">
                  <button className="btn"
                    onClick={()=>{handleLoginAndSignup('register')}}
                    style={{
                      backgroundColor: isValid ? '#7c5cfc' : '#ccc',
                      pointerEvents: isValid ? 'auto' : 'none'
                    }}
                  >Sign Up</button>
                  <p className="text">Already have an account? <span onClick={()=>setIsLogin(!isLogin)}>login</span></p>
                </div>
              </div>
            
          }
        </div>
    </div>
  )
}

export default Auth