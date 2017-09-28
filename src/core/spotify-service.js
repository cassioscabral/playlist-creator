import spotifyApi from '../loaders/spotifyApi'

function getAccessToken () {
  if (!window.location.hash) return
  let r = new RegExp('([^&;=]+)=?([^&;]*)', 'g')
  return window.location.hash.match(r)[0].split('#access_token=')[1]
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString (length) {
  let text = ''
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

// id :: data
const getAlbumTracks = async (albumId) => unwrap(await spotifyApi.getAlbumTracks(albumId))

const getAlbumTracksRaw = async (albumId) => await spotifyApi.getAlbumTracks(albumId)

const unwrap = (data, property = 'items') => data[property]

module.exports = {
  getAccessToken,
  generateRandomString,
  getAlbumTracks,
  getAlbumTracksRaw
}
