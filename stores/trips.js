export const useTripsStore = defineStore('tripsStore', {
    state: () => ({
        trips: []
    }),
    actions: {
        async add(crew) {
            this.trips.push({ ...crew, id: crypto.randomUUID() })
        },
        async update(crew) {
            const index = this.trips.findIndex(c => c.id === crew.id)
            if (index !== -1) {
                this.trips[index] = { ...this.trips[index], ...crew }
            }
        },
        async addOrUpdate(crew) {
            const index = this.trips.findIndex(c => c.id === crew.id)
            if (index !== -1) {
                this.update(crew)
            } else {
                this.add(crew)
            }
            localStorage.setItem('trips', JSON.stringify(this.trips))
        },
        async delete(id) {
            this.trips = this.trips.filter(c => c.id !== id)
            localStorage.setItem('trips', JSON.stringify(this.trips))
        },
        async load() {
            const trips = JSON.parse(localStorage.getItem('trips'))
            if (trips) {
                this.trips = trips
            }
        },
        saveJournal(id, journal) {
            const trip = this.trips.find(t => t.id === id)
            if (trip) {
                trip.journal = journal
                localStorage.setItem('trips', JSON.stringify(this.trips))
            }
        },
        getJournal(id) {
            const trip = this.trips.find(t => t.id === id)
            return trip ? trip.journal : null
        },
        getChecklist(id) {
            const trip = this.trips.find(t => t.id === id)
            return trip ? trip.checklist : null
        },
        saveChecklist(id, checklist) {
            const trip = this.trips.find(t => t.id === id)
            if (trip) {
                trip.checklist = checklist
                console.log('Saving checklist:', trip.checklist)
                localStorage.setItem('trips', JSON.stringify(this.trips))
                this.storeOnSailSync(trip)
            }
        },
        async getFromSailSync(trip, path) {
            if (!trip.sailSyncUrl || !trip.sailSyncPort) return

            const { sailSyncUrl, sailSyncPort, sailSyncUsername, sailSyncPassword } = trip

            const response = await fetch(`http://${sailSyncUrl}:${sailSyncPort}/${path}`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Basic ' + btoa(sailSyncUsername + ':' + sailSyncPassword),
                    'Content-Type': 'application/json'
                }
            })

            if (response.ok) {
                const data = await response.json()
                console.log("✅ Data successfully retrieved from SailSync.");
                return data
            } else {
                console.error(`❌ Failed to retrieve on SailSync. Status: ${response.status}`)
                return null
            }
        },
        async storeOnSailSync(trip) {
            if (!trip.sailSyncUrl || !trip.sailSyncPort) return

            const { sailSyncUrl, sailSyncPort, sailSyncUsername, sailSyncPassword } = trip

            const response = await fetch(`http://${sailSyncUrl}:${sailSyncPort}/${trip.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': 'Basic ' + btoa(sailSyncUsername + ':' + sailSyncPassword),
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(trip, null, 2)
            })
            
            if (response.ok) {
                console.log("✅ Data successfully saved to SailSync.");
            } else {
                console.error(`❌ Failed to save on SailSync. Status: ${response.status}`)
            }
        }
    }
  })