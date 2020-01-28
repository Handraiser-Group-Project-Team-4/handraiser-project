import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import axios from 'axios'

export default function Login() {
    const [user, setUser] = useState({
        isNew: false,
        loginSuccess: false,
        role: null
    })
    const responseGoogle = (response) => {
        console.log(response)
        axios({
            method: "get",
            url: `/api/users?user_id=${response.profileObj.googleId}`,
        })
        .then(res => {
            // console.log(res.data)
            if (res.data.length === 0) {
                axios({
                    method: `post`,
                    url: `/api/users`,
                    data: {
                        user_id: response.profileObj.googleId,
                        avatar: response.profileObj.imageUrl,
                        email: response.profileObj.email,
                        firstname: response.profileObj.givenName,
                        lastname: response.profileObj.familyName
                    }
                })
                .then(res => {
                    // console.log(res)
                    localStorage.setItem('id', response.profileObj.googleId);
                    localStorage.setItem('accessToken', response.accessToken);
                    setUser({ ...user, loginSuccess: true, isNew: true})
                })
                .catch(err => console.log(err))
            }
            else {
                localStorage.setItem('id', response.profileObj.googleId);
                localStorage.setItem('accessToken', response.accessToken);
                setUser({ ...user, loginSuccess: true, role: res.data[0].user_role_id})
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    if ((localStorage.getItem(`id`) || user.loginSuccess) && user.role === 1)
        return <Redirect to='/admin-page' />
            
    else if ((localStorage.getItem(`id`) || user.loginSuccess) && user.role === 2)
        return <Redirect to='/mentor-page' />

    else if ((localStorage.getItem(`id`) || user.loginSuccess))
        return <Redirect to={{
            pathname: '/student-page',
            state: user
        }} />

    return (
        <div style={{ display: `flex`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
            <GoogleLogin
                clientId="583886288270-pclb0onu831kl9a3n1onuqbnhs5sk8k1.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={(response) => console.log(response)}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}
