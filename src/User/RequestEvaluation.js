import React, {useEffect, useState } from "react"
import { trackPromise } from "react-promise-tracker";
import Header from "../Header";

function RequestEvaluation(props){

    const imageType = /image\/(png|jpg|jpeg)/i;

    const [isImage, setIsImage] = useState(false) 
    const [isImageErr, setIsImageErr] = useState(false) 

    const [blob, setBlob] = useState('') //stores a binary large object

    const [loggedOn, setLoggedOn] = useState()

    const [submitted, setSubmitted] = useState(false)
    const [submitErrMsg, setSubmitErrMsg] = useState(false)

    const[formData, setFormData]= React.useState({
        name: "",
        description: "",
        question: "email"
      })

    function handleFormChange(event){
        const {name, value} = event.target
        setFormData(prevFormData =>{
            return  {
            ...prevFormData,
            [name] : value
            }
        })
    }

    useEffect(() => { //run before components load
        try{
            trackPromise(
            //fetch("http://127.0.0.1:8080/valid_token", {
            fetch("http://dan565.pythonanywhere.com/valid_token", { //check user is logged on by validating thier token.
                method: 'GET',
                headers: {
                    'x-access-token': localStorage.getItem("token").slice(1,-1) //send token through x-access-token header to API
                }
            }).then(res => res.json).then(data => {
                setLoggedOn(true)
            }).catch(err => { //if error user is not logged on.
                setLoggedOn(false)
            }))
        } catch (e) { //if error user is not logged on.
            setLoggedOn(false)
        }
    },[])

    const fileToBlob = (file) => new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => {
          resolve(event.target.result) //get file.
        };
        reader.readAsDataURL(file); //convert file to URL.
        })

    const handleChange = (file) => {
        if(file.type.match(imageType)){
            setFormData(prevFormData =>{
                return  {
                ...prevFormData,
                name : file.name
            }
            })
    
            fileToBlob(file).then(blob => { //resolve promise
                setBlob(blob)
                setIsImage(true)
            })
            setIsImageErr(false)
        }
        else{
            setIsImage(false)
            setIsImageErr(true)
        }

    }

    function onUpload(event){
        event.preventDefault()
        trackPromise(
        //fetch(`http://127.0.0.1:8080/user/${JSON.parse(localStorage.getItem('token'))}/upload`, {
        fetch(`http://dan565.pythonanywhere.com/user/${JSON.parse(localStorage.getItem('token'))}/upload`, { //upload image to API using user token.
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-CSRFToken' : localStorage.getItem("csrf")
            },
            body: JSON.stringify(
            {
                name: formData.name,
                binary: blob,
                desc: formData.description,
                contact: formData.question
            })}).then(res => {
                if(!res.ok) {
                    return res.text().then(text => { throw new Error(text) })
                }
                else {
                    return res.json();
                }}).then(data => {
                    setSubmitted(true) //let user know there item has been sent successfully.
                }).catch(err => {
                    setSubmitErrMsg(true)
                }))
    }

    return (
    <div>
       {loggedOn && 
        <div>
        <Header/>
            <div className= "request-page">
            <p className="request-title">Upload an image of your antique item</p>
                <div className="request-form">
                    <div className = "request-form-container">
                        <form className="request-form">
                            <label className="custom-upload-file">
                                Click here to upload an image
                                <input type="file" onChange={(event) => handleChange(event.target.files[0] || null)} />
                            </label>
                            {isImage && 
                                    <div>
                                        <p className="file-name">Filename: {formData.name}</p>
                                        <div className="preview-container">
                                            <img className="preview-form" src={blob} />
                                        </div>
                             
                                        <div className="form-div">
                                            <textarea
                                            cols="50"
                                            rows="5"
                                            type="text"
                                            placeholder="add a desciption of the product here."
                                            name="description"
                                            onChange={handleFormChange}
                                            value={formData.description}
                                    
                                        />
                                        </div>
                                        <p className="contact">How should we contact you about this product:</p>
                                        <div className="form-div">
                                            <select 
                                                onChange={handleFormChange}
                                                name="question"
                                            >
                                                <option value="email"> Email</option>
                                                <option value="phone"> Phone</option>
                                            </select>
                                        </div>  
                                        <button className="submit-button" onClick={onUpload}>Submit Image</button>
                                    </div>
                                }
                        </form>
                        </div>                    {submitted && <p className="success"> Item has been sumbitted for review.</p>}
                    {submitErrMsg && <p> There has been a problem. Try Again?</p>}
                    {isImageErr && <p> That is not an image file. Try Again?</p>}
                </div>
            </div>
        </div>}
        {!loggedOn && <div>You must be logged on to access this page.</div>}
    </div>
    )}
export default RequestEvaluation;