import React, { useContext, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom";
import {RegisterContext} from "./Register"
import { BrowserRouter, Routes, Router , Route, Link} from 'react-router-dom'

function VerifyRegister(props) {


    const {state} = useLocation();
    console.log(state)


    const[formData, setFormData]= React.useState({
        state,
        number: ""
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
        console.log(formData)

        fetch(`http://dan565.pythonanywhere.com/user/verify`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
              },
            body: JSON.stringify({
              name: formData.state.name,
              password: formData.state.password,
              email: formData.state.email,
              phone: formData.state.phone,
              question: formData.state.question,
              answer: formData.state.answer,
              code: formData.number
            }

            )
        }).then(res => {
            if(!res.ok) throw new Error(res.status);
            return res.json()
        }).then(data => {
            console.log(data)
        }).catch(err => {
            console.log(err)
        })
    }

    return (
        <div>
            <p>Enter code sent to your email to verify account.</p>
            <form onSubmit={handleSubmit}>
                <input 
                    type="text"
                    name="number"
                    onChange={handleChange}
                    value={formData.number}
                />
                <button>Sumbit</button>
            </form>

        </div>
    )
}

export default VerifyRegister;