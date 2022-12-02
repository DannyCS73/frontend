import React, {useState} from "react"
import {FaUserAlt} from "react-icons/fa"; 
import {AiFillLock} from "react-icons/ai"
import {useNavigate} from "react-router-dom";
import base64 from 'react-native-base64'
import ReCAPTCHA from 'react-google-recaptcha'


function Login() {
    
    let navigate = useNavigate(); 

    const[showMessage, setShowMessage] = useState(false)

    const[errMsg, setErrMsg] = useState("")

    const[verified, setVerified] = useState(true)

    const[formData, setFormData]= React.useState({
        username: "",
        password: ""
    })

    function handleChange(event){
        const {name, value} = event.target
        setFormData(prevFormData =>{
            return  {
                ...prevFormData,
                [name] : value
            }
        })
    }
  
    function onChange(){
        setVerified(false)
    }

    function naviagteToRegisterPage(){
        navigate('/register')
    }

    function navigateToAdminPage(){
        navigate('/admin')
    }

    function navigateToHomePage(){
        navigate('/home')
    }

    function naviagteToForgotPasswordPage(){
        navigate('/forgotpassword')
    }

    function handleSubmit(event){
        event.preventDefault()
        fetch("http://dan565.pythonanywhere.com/login", {
            method: 'GET',
            headers:{
                'Authorization': 'Basic ' + base64.encode(formData.username + ":" + formData.password) //send username and password through authorization headers
            }}).then(res => {
                if(!res.ok){
                    throw Error(res.status)
                }
                return res.json()}).then(data => {
                    localStorage.setItem("token", JSON.stringify(data.token)) //store user token in local storage
                    if(data.role === 1){ //send to page depending on the role each user has.
                        navigateToAdminPage()
                    } else{
                        navigateToHomePage()
                    }
                }) 
                .catch(err => {
                    if(err.message == 429){
                        setErrMsg("Too many attempts. Try again in 1 minute.")
                    } else{
                        setErrMsg("No account for this username and password. Try again?")
                    }
                    window.grecaptcha.reset();
                    setVerified(true)
                    setShowMessage(true)
                })
            }
    return (
    <div className="login-page">
        <div className="login-text">
            <p className="login-title">LoveJoy</p>
            <p className="login-subtitle">Fair and quick pricing for all antique items.</p>
        </div>
        <div className= "login-container">
            <div className = "form-container">
                <form onSubmit={handleSubmit}>
                     <div >
                        <FaUserAlt/>
                        <input 
                            className="login-input"
                            type="text"
                            placeholder="email"
                            name="username"
                            onChange={handleChange}
                            value={formData.username}
                        />
                    </div>
                    <div>
                        <AiFillLock/>
                        <input 
                            className="login-input"
                            type="password"
                            placeholder="password"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                    </div>
                    <div className="form_group_recaptcha">
                        <ReCAPTCHA
                                sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                                onChange={onChange}
                            />
                    </div>
                    <button disabled={verified} className="login-submit">
                            <p>log in </p>
            
                     </button>
                    {verified && <p>If captcha is not visible, refresh page!</p>}
                    {showMessage && <p className="errorMsg">{errMsg}</p>}
                    <hr className="h-line" />
                    <div className="register" onClick={naviagteToRegisterPage} >click here to sign up!</div>
                    <div className="forgot-password" onClick = {naviagteToForgotPasswordPage} >forgot password?</div>
                </form>
            </div>
        </div>
    </div>
  )}
export default Login;
