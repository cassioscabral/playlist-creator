function msToTime (ms) {
  // 242000
  let totalSeconds = Math.floor(ms / 1000)
  // 242
  let seconds = totalSeconds % 60
  let totalMinutes = (totalSeconds - seconds) / 60

  let minutes = totalMinutes % 60
  // 4.03333
  let hours = (totalMinutes - minutes) / 60

  return `${hours > 0 ? hours + ':' : ''}${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}
export { msToTime }
