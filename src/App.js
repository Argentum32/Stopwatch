import React, { useState, useEffect, useMemo } from 'react';
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import Stopwatch from "./stopwatch.png";

  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBlW5QuV1fAONJV6oDZ6ZT9vo6mQi7vvZE",
    authDomain: "timer-8b98c.firebaseapp.com",
    databaseURL: "https://timer-8b98c-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "timer-8b98c",
    storageBucket: "timer-8b98c.appspot.com",
    messagingSenderId: "611687105734",
    appId: "1:611687105734:web:1e591252715ecdb80283c7"
  }; 
  // Initialize Firebase  
  firebase.initializeApp(firebaseConfig);
  var database = firebase.database()


function App() {

  const [id, setId] = useState(null)
  const [s, setSec] = useState(0)
  const [mobS, setMobSec] = useState(0)
  const [uName, setUName] = useState(null)

  firebase.auth().onAuthStateChanged(user => {
    if (user) {
      setId(user.uid) 
      firebase.database().ref(`users/${firebase.auth().currentUser.uid}`).on('value', data => {
        if(w >= targetW) setMobSec(data.val().mobTime)
        if(w<targetW) setSec(data.val().time)
        setUName(data.val().username)
      })   
    }
     else setId(null)
  })
  
  const setUsers = {
      
    logIn(email, password){
      firebase.auth().signInWithEmailAndPassword(email, password)
      .catch(err => alert (err))
      .then(result => firebase.database().ref(`users/${result.user.uid}`).once('value').then(data => {
                        setMobSec(data.val().mobTime)
                        setSec(data.val().time)
                      }),
        document.getElementById("logForm").reset(),
      )
    },
    logOut(){
      firebase.auth().signOut()
      // document.getElementById("logForm").reset()
      // document.getElementById("regForm").reset()
    },
    signUp(email, password, name){
      firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .then(result => firebase.database().ref('users/' + result.user.uid).set({
          username: name,
          time: 0,
          mobTime: 0
        }),
          setMobSec(0),
          setSec(0)
      )
      document.getElementById("regForm").reset()
    } 
  }

  const form = () => {
    
      return (
      <div>
        <div className="regForm hidden">
          <h4>Register</h4>
          <form className="register" id='regForm' 
            onSubmit={event => {
              event.preventDefault()
              setUsers.signUp(document.getElementById('email').value, document.getElementById('password').value, 
                `${document.getElementById("name").value +' '+ document.getElementById('sname').value}`)
            }}>
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
          onSubmit={event => {
            event.preventDefault()
            setUsers.logIn(document.getElementById('lEmail').value, document.getElementById('lPassword').value)
          }} >
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
  
  const updateTime = () => {
    var updates = {};
    w >= targetW ? 
      updates['users/' + id + '/time/'] = s :
      updates['users/' + id + '/mobTime/'] = mobS;
    return firebase.database().ref().update(updates);
  }
  const updateTimeToDB = useMemo(() => updateTime(), [s, mobS])
  
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
          <button onClick={setUsers.logOut} className='logout-btn'>Log out</button>
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