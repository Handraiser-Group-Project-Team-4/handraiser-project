import React from 'react'
import bg from '../../images/bg.jpg'

export default function NotFound() {
    return (
        <div style={{backgroundImage: `url(${bg})`, height:`100vh`, backgroundSize:`cover`, opacity:`0.75`}}>
           <h1 style={{color:`white`, margin:`0`, display:`flex`, alignItems:`center`, justifyContent:`center`,  height:`100vh`}}>
                404 NOT FOUND
           </h1>
        </div>
    )
}
