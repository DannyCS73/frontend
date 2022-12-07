import React from "react"
import { trackPromise } from "react-promise-tracker"

function ForgotPassword(){


    const[showErrorMessage, setShowErrorMessage] = React.useState(false) 

    const[showPosMessage, setShowPosMessage] = React.useState(false)

    const[formData, setFormData]= React.useState({
        email: "",
        answer: ""
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

    function handleSubmit(event){
        event.preventDefault()
        trackPromise(
        fetch("http://dan565.pythonanywhere.com/requestreset", { 
        // fetch(`http://127.0.0.1:8080/requestreset`, { //post a reset password request to API.
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify(
              formData
            )}).then(res => res.json()).then(data => {
                setShowPosMessage(true)
                setShowErrorMessage(false)
            }).catch(error => {
                setShowErrorMessage(true)
                setShowPosMessage(false)
            }))
        }

    return (
        <div className= "register-page">
            <p className="register-title">Enter your email address</p>
            <div className="register-form">
                <div className = "form-container">
                    <form onSubmit={handleSubmit}>
                        <div>
                            <input 
                                className="login-input"
                                type="email"
                                placeholder="email"
                                name="email"
                                onChange={handleChange}
                                value={formData.email}
                            />
                        </div>
                        <div>
                            <input 
                                className="login-input"
                                type="text"
                                placeholder="securtiy question answer."
                                name="answer"
                                onChange={handleChange}
                                value={formData.answer}
                            />
                        </div>
                        {showErrorMessage && <p className="errorMsg">No account for this email. Try again?</p>}
                        {showPosMessage && <p className="posMsg">Email sent</p>}
                        <button className="login-submit">
                            <p>Send recovery email</p>
                        </button>
                    </form>
                </div>
            </div>
         </div>
         )
        }
export default ForgotPassword;