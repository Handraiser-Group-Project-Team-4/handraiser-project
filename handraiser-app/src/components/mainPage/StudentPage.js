import React from 'react'

import MainpageTemplate from '../tools/MainpageTemplate'
import CohortList from '../tools/CohortList'

export default function StudentPage({ location }) {
    return (
        <MainpageTemplate>
            <div style={{ display: `flex`, flexDirection: `column`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
                <h1>THIS IS WHERE THE COHORT LIST IS LOCATED</h1>
                <CohortList />
                {(location.state)&&(location.state.isNew) && <button>I'am a Mentor</button>}
            </div>
        </MainpageTemplate>
    )
}