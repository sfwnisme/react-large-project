import axios from 'axios';
import { useContext, useState } from "react"
import Header from '../../../Components/Header';
import { useNavigate } from 'react-router-dom';
import { User } from '../Context/UserContext';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [accept, setAccept] = useState(false)
  const [emailError, setEmailError] = useState('')
  const navigate = useNavigate()

  const user = useContext(User)

  const Submit = async (e) => {
    let flag = false;
    e.preventDefault()
    setAccept(true)
    if (password.length < 8)
      flag = false
    else
      flag = true
    if (flag) {
      try {
        let res = await axios.post('http://127.0.0.1:8000/api/login', {
          email,
          password,
        })
        console.log('%cregister response', 'color: lightgreen', res)
        if (res.status == 200) {
          localStorage.setItem('email', email)
          setEmailError('')
          navigate('/')

          //:::::::::::::[TOKEN]:::::::::::::::
          let token = res?.data?.data?.token
          let userDetails = res?.data?.data?.user
          console.log('token', token)
          await user.setAuth({ token, userDetails }) // using await to checke the data in console on try
          console.log('user auth from login', user)
          //:::::::::::::::::::::::::::::::::::
        }
      } catch (err) {
        console.log('%cregister error', 'color: red', err)
        setEmailError(err?.response?.status)
      }
    }
  }

  return (
    <div className="container">
      <Header />
      <div className="register">
        <form onSubmit={Submit} className='login'>
          <label htmlFor="email">Email:</label>
          <input type="email" id="email" placeholder="Email..." required value={email} onChange={(e) => setEmail(e.target.value)} />
          {accept && emailError == 401 && <p className='error'>This email is not registered</p>}
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
          {password.length < 8 && accept && <p className="error">Password must be more than 8 characters</p>}
          <div style={{ textAlign: "center" }}>
            <button className='button' type="submit">Log in</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login