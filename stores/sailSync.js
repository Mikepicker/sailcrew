export const useSailSyncStore = defineStore('sailSyncStore', {
    state: () => ({
        sailSyncUrl: '',
        sailSyncPort: '',
        sailSyncUsername: '',
        sailSyncPassword: '',
    }),
    actions: {
        saveConfig(sailSyncUrl, sailSyncPort, sailSyncUsername, sailSyncPassword) {
            this.sailSyncUrl = sailSyncUrl
            this.sailSyncPort = sailSyncPort
            this.sailSyncUsername = sailSyncUsername
            this.sailSyncPassword = sailSyncPassword
            localStorage.setItem('sailSync', JSON.stringify(this.$state))

            const tripsStore = useTripsStore()
            const crewsStore = useCrewsStore()
            const routesStore = useRoutesStore()
            this.storeOnSailSync('trips', tripsStore.trips)
            this.storeOnSailSync('crews', crewsStore.crews)
            this.storeOnSailSync('routes', routesStore.routes)
        },
        load() {
            const config = JSON.parse(localStorage.getItem('sailSync'))
            if (config) {
                this.sailSyncUrl = config.sailSyncUrl
                this.sailSyncPort = config.sailSyncPort
                this.sailSyncUsername = config.sailSyncUsername
                this.sailSyncPassword = config.sailSyncPassword
            }
        },
        async storeOnSailSync(path, data) {
            if (!this.sailSyncUrl || !this.sailSyncPort) return

            const response = await fetch(`http://${this.sailSyncUrl}:${this.sailSyncPort}/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + btoa(this.sailSyncUsername + ':' + this.sailSyncPassword),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data, null, 2)
            })
            
            if (response.ok) {
                console.log("✅ Data successfully saved to SailSync.");
            } else {
                console.error(`❌ Failed to save on SailSync. Status: ${response.status}`)
            }
        },
        async startSync() {
            const tripsStore = useTripsStore()
            const crewsStore = useCrewsStore()
            const routesStore = useRoutesStore()

            watch(() => tripsStore.trips,
                (newVal, oldVal) => {
                    console.log('Trips changed:', newVal, oldVal)
                    this.storeOnSailSync('trips', newVal)
                },
                { deep: true }
            )

            watch(() => crewsStore.crews,
                (newVal, oldVal) => {
                    console.log('Crews changed:', newVal, oldVal)
                    this.storeOnSailSync('crews', newVal)
                },
                { deep: true }
            )

            watch(() => routesStore.routes,
                (newVal, oldVal) => {
                    console.log('Routes changed:', newVal, oldVal)
                    this.storeOnSailSync('routes', newVal)
                },
                { deep: true }
            )
        }
    }
  })