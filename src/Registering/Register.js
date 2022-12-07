import React, {useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import {getCookie} from "../App"
import ReCAPTCHA from 'react-google-recaptcha'
import { trackPromise } from 'react-promise-tracker';

function Register() {

    let navigate = useNavigate(); 

    const [securityQuestions, setSecurityQuestions] = useState() //array storing all security questions.
    const [errorMessage, setErrorMessage] = useState("") //string storing error message.

    const[verified, setVerified] = useState(true)
   
    function onChange(){
        setVerified(false)
    }


    useEffect(() => { //run before components load.
        //fetch("http://127.0.0.1:8080/questions", {
        fetch(`http://dan565.pythonanywhere.com/questions`,{ //get all security questions from API.
            method:"GET"
        }).then(res => res.json()).then(data => {
            var count = 0
            setSecurityQuestions(data.questions.map( question => { //store them in an array in state.
                count++
                return <option value={count}>{question.question}</option>
            }))
        })}, [])

    function navigateToLoginPage(){
        navigate('/')
    }

    function naviagteToVerifyPage(id){
       navigate('/register/'+ id +'/verify', {state: formData})
    }

    const[formData, setFormData]= React.useState({
        email: "",
        phone: "",
        password: "",
        confirm_password: "",
        question: 1, //default 1 if security question is not changed.
        answer: ""
      })
    
    function handleChange(event){ //update form data as it is changed.
        const {name, value} = event.target
        setFormData(prevFormData =>{
            return  {
                ...prevFormData,
                [name] : value
            }
        })
    }

    function handleSubmit(event){
        event.preventDefault()
        trackPromise(
        //fetch("http://127.0.0.1:8080/user", {
        fetch(`http://dan565.pythonanywhere.com/user`, { //post a new user to the API for verification.
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                },
            body: JSON.stringify(
                {
                    email: formData.email,
                    password: formData.password,
                    confirm_password: formData.confirm_password
                }
            )}).then(res => {
                if(!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.json();
                }}).then(data => {
                    naviagteToVerifyPage(data.message) //go to the verification page to finsih signing up.
                }).catch(err => {
                    setErrorMessage('' + err); //show error repsonse from API.
                }))
            }

    return(
        <div className= "register-page">
            <p className="register-title">Register</p>
            <div className="register-form">
                <div className = "form-container">
                <form onSubmit={handleSubmit}>
                    <div >
                        <input 
                            className="login-input"
                            type="text"
                            placeholder="email"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                    </div>
                    <div >
                        <input 
                            className="login-input"
                            type="text"
                            placeholder="name"
                            name="name"
                            onChange={handleChange}
                            value={formData.name}
                        />
                    </div>
                    <div >
                        <input 
                            className="login-input"
                            type="text"
                            placeholder="phone number"
                            name="phone"
                            onChange={handleChange}
                            value={formData.phone}
                            
                        />
                    </div>
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
                            placeholder="password"
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
                    <div>
                        <select 
                            onChange={handleChange}
                            name="question"
                        >
                            {securityQuestions}
                        </select>
                        <input 
                            className="security-answer"
                            type="text"
                            placeholder="answer"
                            name="answer"
                            onChange={handleChange}
                            value={formData.answer}
                        />
                    </div>
                    <p className= "errorMsg_reg">{errorMessage}</p>
                    <div className="form_group_recaptcha">
                        <ReCAPTCHA
                                sitekey='6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI'
                                onChange={onChange}
                            />
                    </div>
                    {verified && <p>If captcha is not visible, refresh page!</p>}
                    <button disabled={verified} className="login-submit">
                            <p>Register </p>
                    </button>
                    <hr className="h-line" />
                    <div className="register" onClick={navigateToLoginPage} >Already have an account?</div>
                </form>
            </div>
        </div>
    </div>
    )
}

export default Register;
