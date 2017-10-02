const SpotifyApi = require('spotify-web-api-js')
const instance = new SpotifyApi()

function getAccessToken () {
  if (!window.location.hash) return
  let r = new RegExp('([^&;=]+)=?([^&;]*)', 'g')
  return window.location.hash.match(r)[0].split('#access_token=')[1]
}

instance.setAccessToken(getAccessToken())

export default instance
