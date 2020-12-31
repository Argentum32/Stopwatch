import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import Stopwatch from "./stopwatch.png";

  

function App() {

  
  const [s, setSec] = useState(0)
  const [mobS, setMobSec] = useState(0)
  const [uName, setUName] = useState(null)

  

  const form = () => {
    
      return (
      <div>
        <div className="regForm hidden">
          <h4>Register</h4>
          <form className="register" id='regForm' 
            onSubmit={}>
            <input type="text" id="name" className="name" placeholder="First name" />
            <input type="text" id="sname" className="lastName" placeholder="Last name" />
            <input type="email" id="email" className="email" placeholder="Email"/>
            <input type="password" id="password" className="password" placeholder="Password" pattern="\w{8,}" title="8 character password" />
            <input className="input-btn" type="submit" value="Sign up" form='regForm'/> 
          </form>
          <a className="input-link" href="#" 
            onClick={() => {
                          document.querySelector('.regForm').classList.toggle('hidden')
                          document.querySelector('.loginForm').classList.toggle('hidden')
                        }}
            >Already registered? <b>Log in</b></a>
        </div>

        <div className="loginForm">
        <h4>Log in</h4>
        <form className="login" id='logForm'
          onSubmit={} >
          <input type="email" id="lEmail" className="email" placeholder="Email" />
          <input type="password" id="lPassword" className="password" placeholder="Password" pattern="\w{8,}" title="8 character password" />
          <input className="input-btn" type="submit" value="Login" form='logForm'/> 
        </form>
        <a className="input-link" href="#" 
          onClick={() => {
                        document.querySelector('.loginForm').classList.toggle('hidden')
                        document.querySelector('.regForm').classList.toggle('hidden')
          }}>Don`t have an account yet? <b>Register</b></a>
      </div>
    </div>)
    }

  let w = document.documentElement.clientWidth || document.body.clientWidth || window.innerWidth
  let targetW = 768;

  useEffect(() => {
    let interval
    interval = w >= targetW ? 
      setInterval(() => setSec(prev => prev + 1), 1000) : 
      setInterval(() => setMobSec(prev => prev + 1), 1000)
    return () => clearInterval(interval);
  });
  let h = 0,
  m = 0,
  sec = 0
  
  const formatTime = (s) => {
      sec = s%60 
      m = ~~(s/60%60)
      h = ~~(s/3600)

      sec = sec < 10 ? `0${sec}` : sec
      m = m < 10 ? `0${m}` : m
      h = h < 10 ? `0${h}` : h
      
      return `${h}:${m}:${sec}`
  }
  
  const timers = () => {
    return (
      <div>
        <div className='header'>
          <div className='username'>{uName}</div>
          <button onClick={} className='logout-btn'>Log out</button>
        </div>
        <div className='timeSection'>
          <div className='desktopSection'>
            <h3>Desktop</h3>
            <img src={Stopwatch} className='stopwatch' alt='Stopwatch'/>
            <div className='time'>{formatTime(s)}</div>
          </div>
          <div className='mobileSection'>
            <h3>Mobile</h3> 
            <img src={Stopwatch} className='stopwatch' alt='Stopwatch'/>
            <div className='time'>{formatTime(mobS)}</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      {id===null ? form() : timers()} 
    </div>
  );
}

export default App;