import spotifyApi from '../loaders/spotifyApi'
import { get } from 'lodash'

function getAccessToken() {
  if (!window.location.hash) return
  const splittedURL = window.location.href.split('access_token=')
  if (splittedURL.length <= 1) return // should have at least two parts, URL + token so that the token exists
  const accessToken = splittedURL[splittedURL.length - 1] // last item
  return accessToken
}

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
function generateRandomString(length) {
  let text = ''
  const possible =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const getUserPlaylists = async userId =>
  await spotifyApi.getUserPlaylists(userId, { limit: 50 })

const getAlbumTracks = async albumId => await spotifyApi.getAlbumTracks(albumId)

const getArtistTopTracks = async (artistId, region = 'US') =>
  await spotifyApi.getArtistTopTracks(artistId, region)

const searchArtists = async (search, opts = { limit: 20 }) =>
  await spotifyApi.searchArtists(search, opts)

const getArtistAlbums = async (artistId, opts = { limit: 50, country: 'DE' }) =>
  await spotifyApi.getArtistAlbums(artistId, opts)

const changePlaylistName = async (userId, playlistId, name) =>
  await spotifyApi.changePlaylistDetails(userId, playlistId, { name })

// spotifyApi.getArtistAlbums(this.selectedArtist.id, {limit: 50})
// .then(data => {
//   this.currentSelectedArtistAlbums = uniqBy(data.items.filter(a => a.album_type === 'album'), 'name')
// })

const unwrap = get

export {
  spotifyApi,
  getAccessToken,
  generateRandomString,
  getAlbumTracks,
  getArtistTopTracks,
  searchArtists,
  getArtistAlbums,
  getUserPlaylists,
  changePlaylistName,
  unwrap
}
