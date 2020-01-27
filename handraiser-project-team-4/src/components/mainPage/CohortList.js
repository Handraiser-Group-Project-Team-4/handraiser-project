import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

export default function CohortList() {
    const [user, setUser] = useState()
    useEffect(() => {
            axios({
                method:'get',
                url: `/api/users/${localStorage.getItem(`accessToken`)}`
            })
            .then(res => {
                // console.log(res.data)
                setUser(...res.data)
            })
            .catch(err => {
                console.log(err)
            })

        return () => {  };
    }, [])

    if(!localStorage.getItem(`accessToken`))
        return <Redirect to="/" />

    return (
        <div style={{ display: `flex`, flexDirection:`column`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
            {(user)&&<>
                <img src={user.avatar} alt="profile_pic" />
                <h2>{user.firstname} {user.lastname}</h2>
                <p>{user.email}</p>
            </>}
            
            <h1>THIS IS WHERE THE COHORT LIST IS LOCATED</h1>

            <a href="#home" onClick={() => localStorage.clear()}>Log out</a>
        </div>
    )
}
