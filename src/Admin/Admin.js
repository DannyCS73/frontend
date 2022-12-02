import React, {useEffect, useState} from "react"
import Header from "../Header"

function Admin(){

    const [isAdmin, setIsAdmin] = useState() //boolean holding wether user is an admin.
    const [itemTable, setItemTable] = useState() //object holding all item data.

    useEffect(() => { //run before components load.
        try{
            fetch("http://dan565.pythonanywhere.com/images", { //fetch all items from API.
                method: 'GET',
                headers: {
                        'x-access-token': localStorage.getItem("token").slice(1,-1) //get users access token from local storage.
                }
            }).then(res => {
                if(!res.ok) throw new Error(res.status); // if error user does not have permission (401) else they do.
                return res.json()}).then(data => {
                    setIsAdmin(true) 
                    setItemTable(data.items.map(item => { // iterate through all items and return them in a table.
                        return <tr><td>{item.id}</td><td>{item.user}</td><td>{item.contact}</td>
            <td>{item.name}</td><td>{item.desc}</td><td><img style={{width: "10vw"}}src={item.image}></img></td></tr> 
            }))}).catch(err => {
                setIsAdmin(false) 
            })
        } catch (e){ //if error user is not logged on.
            setIsAdmin(false)
        }
     },[])

    return(
        <div>
            <Header/>
            {isAdmin && 
            <div>
                <div className="admin-title">
                    <p>All User Items - admin page</p>
                </div>

                <div className="admin-div">
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>User</th>
                                <th>Method of contact</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th>Preview</th>
                            </tr>
                        </thead>
                        <tbody>
                            {itemTable}
                        </tbody>
                    </table>
                </div>

                </div>
            }
            {!isAdmin && <div>You do not have access to this page. Only Administrators can view this page.</div>}
        </div>
    )
}

export default Admin;