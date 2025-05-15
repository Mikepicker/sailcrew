export const useNavUtils = () => {
    const formatLatLon = (lat, lon) => {
        const toDMS = (deg) => {
            const absolute = Math.abs(deg)
            const degrees = Math.floor(absolute)
            const minutesFloat = (absolute - degrees) * 60
            const minutes = Math.floor(minutesFloat)
            const secondsFloat = ((minutesFloat - minutes) * 60)
            const seconds = Math.round(secondsFloat)
    
            return `${degrees}°${minutes}'${seconds}"`
        }

        const latDirection = lat >= 0 ? 'N' : 'S'
        const lonDirection = lon >= 0 ? 'E' : 'W'

        const latDMS = toDMS(lat)
        const lonDMS = toDMS(lon)

        return `${latDMS} ${latDirection}, ${lonDMS} ${lonDirection}`
    }

    return { formatLatLon }
}
