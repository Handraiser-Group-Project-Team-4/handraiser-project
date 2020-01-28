// import React, {useState} from 'react'
// import axios from 'axios'
// import { Redirect } from 'react-router-dom'

// export default function FirstLogin({location}) {
//     const[mentorKey, setMentorKey] = useState(false)
//     const[isSuccess, setIsSuccess] = useState(false)

//     const hanldeStudent = () => {
//         axios({
//             method: `post`,
//             url: `/api/users`,
//             data: location.state.userObj
//         })
//         .then(res => {
//             // console.log(res)
//             localStorage.setItem('accessToken', location.state.userObj.user_id);
//             setIsSuccess(true)
//         })
//         .catch(err => {
//             console.log(err)
//         })
//     }

//     const hanldeMentor = () => {
//         // Endpoint here for generated key......
//     }


//     if(!location.state)
//         return <Redirect to="/"/>

//     if(localStorage.getItem(`accessToken`) || isSuccess)
//         return <Redirect to="/cohort-list" />

//     return (
//         <>
//             <h1 style={{textAlign:`center`}}>What are you?</h1>
//             <div style={{display:`flex`, justifyContent:`space-around`, alignItems:`center`, height:`100vh`}}>
//                 <button onClick={hanldeStudent}>Student</button>
//                 {(mentorKey)&&
//                     <div>
//                         <input type="text" placeholder="Enter your key here..." />
//                         <button onClick={hanldeMentor}>Submit</button>
//                         <button onClick={() => setMentorKey(false)}>Cancel</button>
//                     </div>
//                 }
//                 <button onClick={() => setMentorKey(true)}>Mentor</button>
//             </div>
//         </>
//     )
// }
