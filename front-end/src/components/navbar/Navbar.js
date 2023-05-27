import React, { useState } from "react";
import {FaBars} from "react-icons/fa";
import {AiOutlineClose}from "react-icons/ai";
import { Link } from "react-router-dom";
import { SidebarData } from "./SidebarData";
import { IconContext } from "react-icons";
import { useNavigate } from "react-router-dom";
import './navbar.css';
import {  useCookies } from "react-cookie";
function Navbar() {
  const [sidebar, setSidebar] = useState(false);
  const showSidebar = () => setSidebar(!sidebar);
  const navigate = useNavigate();
  const [cookies,setCookies] = useCookies("access_token");
  const removeCookies = ()=>{
    setCookies("access_token",null);
    window.localStorage.removeItem("adminID");
    window.localStorage.removeItem("token");
    navigate('/');
    window.location.reload()    
  }

  return (
    <>
      <IconContext.Provider value={{ color: "undefined" }}>
        <div className="navbar position-relative">
          <Link to="#" className="menu-bars">
            <FaBars onClick={showSidebar} />
          </Link>
          <div className="span-btn mt-3 mx-4 position-absolute top-0 end-0 d-flex justify-content-between col">
            <button className="btn-log" onClick={removeCookies}>log out</button>
            <Link to='/'>
                <img className="span" src={ require('../../images/infinity2.png')} alt="aaa"/>
            </Link>
          </div>
        </div>
        <nav className={sidebar ? "nav-menu active" : "nav-menu"}>
          <ul className="nav-menu-items" onClick={showSidebar}>
            <li className="navbar-toggle">
              <Link to="#" className="menu-bars">
                <AiOutlineClose />
              </Link>
            </li>
            {SidebarData.map((item, index) => {
              return (
                <li key={index} className={item.cName}>
                  <Link to={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </IconContext.Provider>
    </>
  );
}

export default Navbar;
