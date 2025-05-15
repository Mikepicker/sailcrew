export const useGPS = () => {
    const init = async (callback) => {
        if (!navigator.geolocation) {
            alert("Geolocation is not supported by your browser.")
            return
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude } = position.coords
                callback({ watchId, latitude, longitude })
            },
            (error) => {
                console.error("Geolocation error:", error)
            },
            {
                enableHighAccuracy: true,
                maximumAge: 0,
                timeout: 10000
            }
        )
    }

    const unwatch = (watchId) => {
        if (watchId) {
            navigator.geolocation.clearWatch(watchId)
        }
    }

    return { init, unwatch }
}
