import React from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'

export default function FirstLogin({location}) {
    const hanldeStudent = () => {
        axios({
            method: `post`,
            url: `/api/users`,
            data: location.state.userObj
        })
        .then(res => {
            console.log(res)
        })
        .catch(err => {
            console.log(err)
        })
    }


    if(!location.state)
        return <Redirect to="/"/>

    return (
        <>
            <h1 style={{textAlign:`center`}}>What are you?</h1>
            <div style={{display:`flex`, justifyContent:`space-around`, alignItems:`center`, height:`100vh`}}>
                <button onClick={hanldeStudent}>Student</button>
                <button>Mentor</button>
            </div>
        </>
    )
}
