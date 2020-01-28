import React from 'react'
import MainpageTemplate from '../tools/MainpageTemplate'
// import {Link} from 'react-router-dom'

export default function CohortPage() {
    return (
        <MainpageTemplate>
            {/* <Link to="/">Go Back</Link> */}

            <div style={{display:`flex`,justifyContent:`space-around`, height:`80vh`}}>
                <fieldset style={{width:`100vh`, margin:`20px`}}>
                    <legend>Queue</legend>
                </fieldset>

                <fieldset style={{width:`100vh`, margin:`20px`}}>
                    <legend>Being Help</legend>
                </fieldset>
            </div>

            <fieldset style={{height:`300px`, margin:`20px auto`, width:`60%`}}>
                <legend>Chat</legend>
            </fieldset>
        </MainpageTemplate>
    )
}
