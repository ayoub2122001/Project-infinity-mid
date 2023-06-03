import { useNavigate } from "react-router-dom";
import "./Login.css";
import Axios from "axios";
import { useCookies } from "react-cookie";
import { useEffect, useState } from "react";

function Login() {
  const api = "http://localhost:9000";
  const [username, setUserName] = useState("");
  const [password, setPassWord] = useState("");
  const [tk, setCookies] = useCookies(["access_token"]);
  const naviget = useNavigate();
    
  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await Axios.post(`${api}/login`, { username, password });
    console.log(response.data);
    const reso = response.data.success;
    if (reso === false) {
      const div1 = document.getElementById('div1');
      div1.innerHTML = `<p>Nom d\'utilisateur ou mot de passe incorrect</p>`;
    } else {
      // redirection vers la page d'accueil si login réussi
      setCookies("access_token", response.data.token);
      window.localStorage.setItem("userID", response.data.adminId);
      window.localStorage.setItem("token", response.data.token);
      naviget("/");
      window.location.reload()
    }
    
  };
  useEffect(()=>{
    const cookes = window.localStorage.getItem('token');
    if (!cookes){
      naviget('/');
    }
  },[])
  return (
    <>
      <div className="background-img"></div>
      <div className="center">
        <h1>Login</h1>
        <form method="POST" onSubmit={handleSubmit}>
          <div className="txt_field">
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUserName(e.target.value)}
            />
            <span></span>
            <label>Username</label>
          </div>
          <div className="txt_field">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassWord(e.target.value)}
            />
            <span></span>
            <label>Password</label>
          </div>
          <div id="div1" ></div>
          <input type="submit" value="Login" />
        </form>
      </div>
    </>
  );
}

export default Login;
