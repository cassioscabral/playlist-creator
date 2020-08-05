function msToTime(ms) {
  // 242000
  const totalSeconds = Math.floor(ms / 1000)
  // 242
  const seconds = totalSeconds % 60
  const totalMinutes = (totalSeconds - seconds) / 60

  const minutes = totalMinutes % 60
  // 4.03333
  const hours = (totalMinutes - minutes) / 60

  return `${hours > 0 ? hours + ':' : ''}${
    minutes < 10 ? '0' + minutes : minutes
  }:${seconds < 10 ? '0' + seconds : seconds}`
}
export { msToTime }
