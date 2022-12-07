import React, { useEffect, useState} from "react"
import { trackPromise } from "react-promise-tracker";
import { Link } from "react-router-dom";
import {useParams} from "react-router-dom";
function ResetPassword(){

    let { id } = useParams();
    
    const[validPage, setValidPage] = useState(false)

    const[showErrMsg, setShowErrMsg] = useState(false)
    const[errMsg, setErrMsg] = useState()

    const[showPosMsg, setShowPosMsg] = useState(false)

    const[formData, setFormData]= useState({
        token: id,
        password: "",
        confirm_password: ""
      })

     function handleChange(event){
        const {name, value} = event.target
        setFormData(prevFormData =>{
            return  {
            ...prevFormData,
            [name] : value
        } })
    }

    useEffect(() => { //run before components load.
        //fetch("http://127.0.0.1:8080/verify", {
        trackPromise(
        fetch(`http://dan565.pythonanywhere.com/verifyresetoken/${id}`, { //post a new user to the API for verification.
            method: 'GET'
        }).then(res => {
            if(!res.ok){ 
                throw new Error(res.status);
            }
            else{
                return res.json()
            }
        }).then(data => {
            console.log(data)
            setValidPage(true)
        }).catch(e => {
            setValidPage(false)
        }))
    }, [])


    function handleSubmit(event){
        event.preventDefault()
        trackPromise(
        fetch(`http://dan565.pythonanywhere.com/resetpassword/${id}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(
              formData
            )
        }).then(res => {
            if(!res.ok) {
                return res.text().then(text => { throw new Error(text) })
            }
            else {
                return res.json();
            }
        }
        ).then(data => {
            setShowErrMsg(false)
            setShowPosMsg(true)
        }).catch((err) => {
            setErrMsg('' + err)
            setShowErrMsg(true)
            setShowPosMsg(false)
        }))
    }
    
    return (
    <div>
        {validPage && 
            <div className= "register-page">
            <p className="register-title">Password Recovery</p>
            <div className="register-form">
                <div className = "form-container">
                    <form onSubmit={handleSubmit}>
                        <div className="passwordListContainer">
                            <p className="passwordList">Password must have 8 characters and at least: 
                                <ul>
                                    <li><span>1 Capital Letter</span></li>
                                    <li><span>1 Lowercase Letter</span></li>
                                    <li><span>1 Number</span></li>
                                    <li><span>1 Special Character</span></li>
                                    </ul>
                                </p>
                        </div>
                        <div>
                            <input 
                                className="login-input"
                                type="password"
                                placeholder="new-password"
                                name="password"
                                onChange={handleChange}
                                value={formData.password}
                
                            />
                        </div>
                        <div>
                            <input 
                                className="login-input"
                                type="password"
                                placeholder="confirm-password"
                                name="confirm_password"
                                onChange={handleChange}
                                value={formData.confirm_password}
                            />
                        </div>
                        <button className="login-submit">
                            <p>Confirm Change</p>
                        </button>
                        {showPosMsg && 
                        <div>
                            <p className="posMsg">Password has changed successfully.</p>
                            <Link to={'/'}>Login Page</Link>
                        </div>
                        }
                        {showErrMsg && <p className="errorMsg_reg">{errMsg}</p>}
                    </form>
                </div>
            </div>
        </div>
        }
        {!validPage && <div> This is not a valid password recovery page.</div>}
    </div>
)}

export default ResetPassword;