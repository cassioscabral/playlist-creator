/* eslint-disable @typescript-eslint/no-var-requires */
const Spotify = require('spotify-web-api-js')
const instance = new Spotify()

function getAccessToken() {
  if (!window.location.hash) return
  const r = new RegExp('([^&;=]+)=?([^&;]*)', 'g')
  return window.location.hash.match(r)[0].split('#access_token=')[1]
}

instance.setAccessToken(getAccessToken())

export default instance
