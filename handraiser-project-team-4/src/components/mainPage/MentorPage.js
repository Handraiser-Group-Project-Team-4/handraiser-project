import React from 'react'
import MainpageTemplate from '../tools/MainpageTemplate'
import CohortList from '../tools/CohortList'

export default function MentorPage() {
    return (
        <MainpageTemplate>
            <div style={{ display: `flex`, flexDirection: `column`, justifyContent: `center`, alignItems: `center`, height: `100vh` }}>
                <h1>THIS IS WHERE THE COHORT LIST IS LOCATED <i>[Mentor Page]</i></h1>
                <CohortList mentor={true} />
                <a href="#home" onClick={() => localStorage.clear()}>Log out</a>
            </div>
        </MainpageTemplate>
    )
}