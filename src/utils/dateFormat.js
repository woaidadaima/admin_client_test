const timeFormat = (time) => {
    const date = time ? new Date(time) : new Date()
    const formatTime = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return formatTime
}
export default timeFormat