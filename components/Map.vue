<template>
    <div class="relative h-full w-full">
        <div class="absolute top-2 left-2 z-20">
            <UButtonGroup size="xl">
                <UTooltip text="Show Depth">
                    <UButton 
                        @click="showDepth = !showDepth"
                        icon="iconoir:depth"
                        :color="showDepth ? 'primary' : 'neutral'"
                        :variant="showDepth ? 'solid' : 'subtle'" />
                </UTooltip>

                <UTooltip text="Routes">
                    <UButton 
                        @click="showRoutes = !showRoutes" 
                        icon="material-symbols:location-on-outline" 
                        :color="showRoutes ? 'primary' : 'neutral'"
                        :variant="showRoutes ? 'solid' : 'subtle'"  />
                </UTooltip>

                <UTooltip text="GPS">
                    <UButton
                        @click="toggleGPS"
                        icon="simple-icons:osgeo" 
                        :color="GPSEnabled ? 'primary' : 'neutral'"
                        :variant="GPSEnabled ? 'solid' : 'subtle'"  />
                </UTooltip>
            </UButtonGroup>
        </div>

        <UCard v-if="editMode" class="absolute bottom-2 left-2 z-20 w-80 max-h-80 overflow-y-auto">
            <div class="flex justify-between items-center gap-2 mb-2">
                <UInput v-model="currentRouteName" placeholder="Insert a route name" />
                <UButton 
                    @click="confirmEdit"
                    color="success"
                    variant="subtle"
                    icon="material-symbols:check-rounded"
                    :disabled="!currentRouteName"></UButton>
                <UButton
                    v-if="currentRouteId"
                    @click="deleteCurrentRoute()" 
                    color="error"
                    variant="subtle"
                    icon="material-symbols:delete-outline"></UButton>
                <UButton
                    @click="toggleEditMode"
                    color="neutral"
                    variant="subtle"
                    icon="material-symbols:close"></UButton>
            </div>

            <UPopover class="mb-2">
                <UButton label="Choose color" color="neutral" variant="outline">
                <template #leading>
                    <span :style="chip" class="size-3 rounded-full" />
                </template>
                </UButton>

                <template #content>
                    <UColorPicker v-model="currentRouteColor" class="p-2" />
                </template>
            </UPopover>
            
            <p class="text-sm mb-2"><strong>Total Distance:</strong> {{ distanceInfo.totalNM.toFixed(2) }} NM</p>
            <div v-for="(segment, index) in distanceInfo.segments" :key="index">
                <p class="text-sm"><strong>#{{ index + 1 }}</strong>: {{ segment.toFixed(2) }} NM - {{ distanceInfo.bearings[index] }}°</p>
            </div>
        </UCard>
        <UCard v-else-if="showRoutes" class="absolute bottom-2 left-2 z-20 w-80 max-h-80 overflow-y-auto">
            <template #header>
                <div class="flex justify-between items-center gap-2">
                    <h3 class="text-lg font-bold">Routes</h3>
                        <UTooltip text="Add Route">
                            <UButton 
                                @click="toggleEditMode"
                                color="primary"
                                variant="subtle"
                                size="sm"
                                icon="material-symbols:add-location-alt-outline">
                            </UButton>
                    </UTooltip>
                </div>
            </template>

            <div v-if="!routes.length" class="text-center text-gray-500">
                <p class="text-sm">No routes yet!</p>
            </div>

            <div v-for="(route, index) in routes" :key="index" class="flex justify-between items-center gap-2 mb-2">
                <div class="flex items-baseline gap-2">
                    <span class="size-2 rounded-full" :style="{ backgroundColor: route.color }" />
                    <div class="text-sm">{{ route.name }}</div>
                    <div class="text-xs text-gray-500">{{ route.length }} NM</div>
                </div>
                <UTooltip text="Edit Route">
                    <UButton
                        @click="selectRoute(route)"
                        color="neutral"
                        variant="subtle"
                        size="sm"
                        icon="material-symbols:edit-outline"></UButton>
                </UTooltip>
            </div>
        </UCard>

        <LMap
            ref="map"
            class="z-10"
            :zoom="zoom"
            :center="[42, 12]"
            :use-global-leaflet="false"
            :options="{ zoomControl: false }"
            @click="e => addWaypoint(e)"
        >
            <LTileLayer
                url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                layer-type="base"
                name="OpenStreetMap"
            />
            <LTileLayer
                url="https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png"
                attribution='Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            />
            <LWmsTileLayer
                v-if="showDepth"
                url="https://ows.emodnet-bathymetry.eu/wms"
                format="image/png"
                layers="emodnet:contours"
                version="1.3.0"
                transparent
                attribution='&copy; EMODnet Bathymetry'
            />

            <template v-if="!editMode" v-for="route in routes">
                <LMarker
                    v-for="(point, index) in route.waypoints" 
                    :key="index" 
                    :lat-lng="point"
                    :draggable="false">
                    <LTooltip>{{ useNavUtils().formatLatLon(point[0], point[1]) }}</LTooltip>
                </LMarker>
                <LPolyline :lat-lngs="route.waypoints" :color="route.color">
                    <LTooltip>{{ route.name }}</LTooltip>
                </LPolyline>
            </template>

            <LMarker 
                v-for="(point, index) in waypoints" 
                :key="index" 
                :lat-lng="point"
                :draggable="true"
                @moveend="(e) => onMarkerMoved(e, index)">
                <LPopup>
                    <div style="min-width: 120px">
                        <p>
                            <strong>Waypoint {{ index + 1 }}</strong>
                        </p>
                        <div><strong>Lat:</strong> {{ point[0].toFixed(2) }}</div>
                        <div><strong>Lng:</strong> {{ point[1].toFixed(2) }}</div>
                        <p class="cursor-pointer text-red-500"><strong @click="deleteWaypoint(index)">Delete</strong></p>
                    </div>
                </LPopup>
            </LMarker>

            <LPolyline :lat-lngs="waypoints" :color="currentRouteColor" />

            <LMarker
                v-if="GPSPosition"
                :lat-lng="[GPSPosition.latitude, GPSPosition.longitude]"
                :draggable="false">
                <LIcon icon-url="/boat-marker.png" :icon-size="[48, 48]" />
            </LMarker>

        </LMap>
    </div>
</template>
<script setup>
    const routesStore = useRoutesStore()
    const toast = useToast()
    const routes = computed(() => routesStore.routes)
    const zoom = ref(6)
    const showDepth = ref(false)
    const editMode = ref(false)
    const showRoutes = ref(false)

    const currentRouteId = ref(null)
    const currentRouteName = ref('')
    const currentRouteColor = ref('#00C16A')
    const chip = computed(() => ({ backgroundColor: currentRouteColor.value }))

    const waypoints = ref([])
    const courseData = computed(() => {
        return waypoints.value.map(w => ({
            '#': waypoints.value.indexOf(w) + 1,
            lat: w[0].toFixed(2),
            lng: w[1].toFixed(2)
        }))
    })

    const GPSPosition = ref(null)
    const GPSEnabled = ref(false)
    
    const toggleEditMode = () => {
        if (editMode.value) {
            currentRouteId.value = null
            waypoints.value = []
            currentRouteName.value = ''
            editMode.value = false
        } else {
            editMode.value = true
        }
    }

    const addWaypoint = event => {
        if (!editMode.value) return
        const latlng = event.latlng
        waypoints.value = [...waypoints.value, [latlng.lat, latlng.lng]]
    }

    const computeBearing = ([lat1, lon1], [lat2, lon2]) => {
        const toRadians = deg => deg * Math.PI / 180
        const toDegrees = rad => rad * 180 / Math.PI

        const φ1 = toRadians(lat1)
        const φ2 = toRadians(lat2)
        const Δλ = toRadians(lon2 - lon1)

        const y = Math.sin(Δλ) * Math.cos(φ2)
        const x = Math.cos(φ1) * Math.sin(φ2) -
                    Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ)

        let θ = Math.atan2(y, x)
        θ = toDegrees(θ)
        return parseInt((θ + 360) % 360) // Normalize to 0-360°
    }

    const haversineDistanceNM = ([lat1, lon1], [lat2, lon2]) => {
        const toRad = deg => (deg * Math.PI) / 180
        const R = 3440.065 // Nautical miles

        const dLat = toRad(lat2 - lat1)
        const dLon = toRad(lon2 - lon1)
        const a =
            Math.sin(dLat / 2) ** 2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) ** 2

        return 2 * R * Math.asin(Math.sqrt(a))
    }

    const calculateTripDistancesNM = (waypoints) => {
        const segments = []
        const bearings = []
        let total = 0

        for (let i = 1; i < waypoints.length; i++) {
            const dist = haversineDistanceNM(waypoints[i - 1], waypoints[i])
            segments.push(dist)
            const bearing = computeBearing(waypoints[i - 1], waypoints[i])
            bearings.push(bearing)
            total += dist
        }

        return {
            segments,     // Array of distances between each pair
            bearings,     // Array of bearings between each pair
            totalNM: total // Total distance in nautical miles
        }
    }

    const distanceInfo = computed(() => calculateTripDistancesNM(waypoints.value))

    const onMarkerMoved = (event, index) => {
        const newLatLng = event.target.getLatLng()
        waypoints.value = [
            ...waypoints.value.slice(0, index),
            [newLatLng.lat, newLatLng.lng],
            ...waypoints.value.slice(index + 1)
        ]
    }

    const deleteWaypoint = (index) => {
        waypoints.value = [
            ...waypoints.value.slice(0, index),
            ...waypoints.value.slice(index + 1)
        ]
    }

    const selectRoute = (route) => {
        currentRouteId.value = route.id
        currentRouteName.value = route.name
        currentRouteColor.value = route.color
        waypoints.value = route.waypoints
        editMode.value = true
    }

    const confirmEdit = () => {
        const route = {
            id: currentRouteId.value,
            name: currentRouteName.value,
            waypoints: waypoints.value,
            color: currentRouteColor.value,
            length: distanceInfo.value.totalNM.toFixed(2)
        }
        routesStore.addOrUpdate(route)
        toast.add({
            title: "Route saved",
            icon: 'material-symbols:check-rounded',
            color: 'success'
        })
        toggleEditMode()
    }

    const deleteCurrentRoute = () => {
        routesStore.delete(currentRouteId.value)
        toast.add({
            title: "Route deleted",
            icon: 'material-symbols:delete-outline',
            color: 'error'
        })
        toggleEditMode()
    }

    const toggleGPS = () => {
        if (GPSEnabled.value) {
            useGPS().unwatch(GPSPosition.value.watchId)
            GPSPosition.value = null
            GPSEnabled.value = false
            return
        }

        useGPS().init(position => { GPSPosition.value = position })
        GPSEnabled.value = true
    }
</script>