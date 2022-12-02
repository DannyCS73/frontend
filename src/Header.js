import React, { useEffect } from 'react'
import { useNavigate } from "react-router-dom";

function Header(props){

    let navigate = useNavigate(); 


    function handleClickLogout(){
        localStorage.removeItem("token")
        navigate('/')
    }

    return(
        <div>
            <ul className = "header-list">
                <li className="logout"><p onClick={handleClickLogout}>Logout</p></li>
            </ul>
        </div>
    )
}
export default Header;
