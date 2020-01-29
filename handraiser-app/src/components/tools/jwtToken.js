import jwtDecode from 'jwt-decode'

export default function jwtToken() {
    if(sessionStorage.getItem('accessToken'))
        return jwtDecode(sessionStorage.getItem('accessToken'))
    else  
        return null
}
