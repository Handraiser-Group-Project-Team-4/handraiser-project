import React from 'react'
import { Redirect } from 'react-router-dom'
import jwtToken from '../tools/jwtToken'

import MainpageTemplate from '../tools/MainpageTemplate'
import CohortList from '../cohort/CohortList'
import CreateCohort from '../cohort/CreateCohort'


export default function MentorPage() {
    const userObj = jwtToken();
    
    if(userObj.user_role_id === 1)
        return <Redirect to="/admin-page" />

    else if(userObj.user_role_id === 3)
        return <Redirect to="/student-page" />

    return (
        <MainpageTemplate>
            <div style={{ display: `flex`, flexDirection: `column`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
                <h1>THIS IS WHERE THE COHORT LIST IS LOCATED <i>[Mentor Page]</i></h1>
                <CreateCohort />
                <CohortList mentor={true} />
            </div>
        </MainpageTemplate>
    )
}