import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login';
import axios from 'axios'

export default function Login() {
    const [user, setUser] = useState({
        isNew: false,
        userObj: {},
        loginSuccess: false
    })
    const responseGoogle = (response) => {
        // console.log(response)
        axios({
            method: "get",
            url: `/api/users?user_id=${response.profileObj.googleId}`,
        })
        .then(res => {
            // console.log(res.data)
            if (res.data.length === 0) {
                setUser({...user,
                    isNew: true,
                    userObj: {
                        user_id: response.profileObj.googleId,
                        avatar: response.profileObj.imageUrl,
                        email: response.profileObj.email,
                        firstname: response.profileObj.givenName,
                        lastname: response.profileObj.familyName
                    }
                })
            }
            else{
                localStorage.setItem('accessToken', response.profileObj.googleId);
                setUser({ ...user, loginSuccess: true})
            }
        })
        .catch(err => {
            console.log(err)
        })
    }

    if (user.isNew)
        return <Redirect to={{
            pathname: '/first-login',
            state: user
        }}
        />

    if(localStorage.getItem(`accessToken`) || user.loginSuccess)
        return <Redirect to="/cohort-list" />

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
