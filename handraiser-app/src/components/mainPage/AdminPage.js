import React from 'react'
import { Redirect } from 'react-router-dom'
import jwtToken from '../tools/jwtToken'

import MainpageTemplate from '../tools/MainpageTemplate'

export default function AdminPage() {
    const userObj = jwtToken();

    if(userObj.user_role_id === 2)
        return <Redirect to="/mentor-page" />

    else if(userObj.user_role_id === 3)
        return <Redirect to="/student-page" />

    return (
        <MainpageTemplate>
            
        </MainpageTemplate>
    )
}
