import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import axios from 'axios'
import jwtToken from '../tools/assets/jwtToken'


export default function MainpageTemplate({children}) {
    const userObj = jwtToken();
    const [user, setUser] = useState()

    useEffect(() => {
        axios({
            method: 'get',
            url: `/api/users/${(userObj)&&userObj.user_id}`,
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
            }
        })
        .then(res => {
            // console.log(res.data)
            setUser(res.data)
        })
        .catch(err => {
            console.log(err)
        })

        return () => { };
    }, [userObj])

    const handleLogout = () => {
        axios({
            method:`patch`,
            url:`/api/logout/${userObj.user_id}`,
            headers: {
                Authorization: 'Bearer ' + sessionStorage.getItem('accessToken')
            }
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
        sessionStorage.clear()
    }

    if (!userObj)
        return <Redirect to="/" />

    return (
        <div style={{backgroundColor: `lightgrey`}}>
            <header style={{background:`grey`, color:`white`, padding:`20px`, display:`flex`, justifyContent:`space-between`}}>
                <h3>This is a header</h3>
                
                {(user) && 
                    <div style={{display:`flex`, alignItems:`center`}}>
                        {user.firstname} {user.lastname}
                        <img src={user.avatar} alt="profile_pic" width="50" style={{borderRadius:`50%`, margin:`0 20px`}}/>
                        <Link to="/" onClick={handleLogout}>Log out</Link>
                        {/* <h2>{user.firstname} {user.lastname}</h2> */}
                        {/* <p>{user.email}</p> */}
                    </div>
                }
            </header>

             {children}

            {/* <footer style={{background:`grey`, color:`white`, padding:`20px`, textAlign:`center`}}>This is a footer</footer> */}
        </div>
    )
}
