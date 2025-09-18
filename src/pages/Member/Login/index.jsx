
import React from 'react'
import { login } from '@services/authService'


const Login = () => {

  const data = {
    "phoneNumber": "0901234567",
    "password": "123456a"
  }

  const handleLogin = async (e) => {
    try {
      const result = await login(data);
      console.log(result);
    } catch (error) {
      if (error.response && error.response.data) {
        console.log("Error:", error.response.data);
      } else {
        console.log("Unexpected Error:", error);
      }
    }

  }

  return (
    <>
      <div>
        <button onClick={handleLogin}>Login</button>
      </div>
    </>
  )
}

export default Login;
