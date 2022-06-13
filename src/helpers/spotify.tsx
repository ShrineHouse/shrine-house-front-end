import axios from "axios"
const qs = require('qs')

export async function spotifyFetch(url: string) {
    const token = await getTokenApi()

    const requestOptions = {
        headers: {
            'Authorization':
                'Bearer ' + token,
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    const res = await axios.get(url, requestOptions)
    
    return res;
    
}

export async function getTokenApi() {

    const requestOptions = {
        method: "POST",

        headers: {
            'Authorization':
                'Basic MTI4ZmM4NDM1YWJkNDNlYjg2MjBiMmVkY2YzMTVhMmM6MDQwOGYyYTc5ZGNkNDI4MTk5NTlkNzMzYzRjMzA1NDc=',
                Accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
        },
    }
    const data = { 'grant_type': 'client_credentials' };
    const tokenResponse = await axios.post('https://accounts.spotify.com/api/token', qs.stringify(data), requestOptions )

    return tokenResponse.data.access_token;


}