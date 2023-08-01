import React, { useState } from 'react'
import '../styles/Auth.scss'
import loginImg from  '../assets/loginImg.jpg'
import tasks from '../assets/tasks.svg'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleUsername = (event, type)=>{
    
  }

  const changePage = () => {
    setIsLogin(!isLogin)
    setUsername('')
    setPassword('')
    setConfirmPassword('')
  }

  const handleFormChange = (event, type)=>{
    let value = event.target.value
    console.log(value)
    
    switch(type){
      case 'username':
        setUsername(value)
        break
      case 'password':
        setPassword(value)
        break
      case 'confirmPassword':
        setConfirmPassword(value)
        break
    }
  }

  return (
    <div className="hero-box">
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
                    <input type="text" placeholder="Username" onChange={(event)=>{handleFormChange(event, 'username')}}/>
                  </div>

                  <div className="form-field">
                    <p className="name">Password</p>
                    <input type="password" placeholder="Password" onChange={(event)=>{handleFormChange(event, 'password')}}/>
                  </div>
                  
                </div>
                <div className="btm-box">
                  <button className="btn">Login</button>
                  <p className="text">Don't have an account? <span onClick={changePage}>Sign Up</span></p>
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
                    <input type="text" placeholder="Username" onChange={(event)=>handleFormChange(event, 'username')}/>
                  </div>

                  <div className="form-field">
                    <p className="name">Password</p>
                    <input type="password" placeholder="Password" onChange={(event)=>{handleFormChange(event, 'password')}}/>
                  </div>

                  <div className="form-field">
                    <p className="name">Confirm Password</p>
                    <input type="text" placeholder="Confirm Password" onChange={(event)=>{handleFormChange(event, 'confirmPassword')}}/>
                  </div>
                  
                </div>
                <div className="btm-box">
                  <button className="btn">Sign Up</button>
                  <p className="text">Already have an account? <span onClick={changePage}>login</span></p>
                </div>
              </div>
            
          }
        </div>
    </div>
  )
}

export default Auth