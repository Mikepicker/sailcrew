export const useCrewsStore = defineStore('crewsStore', {
    state: () => ({
        crews: []
    }),
    actions: {
        get(id) {
            return this.crews.find(c => c.id === id)
        },
        async add(crew) {
            this.crews.push({ ...crew, id: crypto.randomUUID() })
        },
        async update(crew) {
            const index = this.crews.findIndex(c => c.id === crew.id)
            if (index !== -1) {
                this.crews[index] = { ...this.crews[index], ...crew }
            }
        },
        async addOrUpdate(crew) {
            const index = this.crews.findIndex(c => c.id === crew.id)
            if (index !== -1) {
                this.update(crew)
            } else {
                this.add(crew)
            }
            localStorage.setItem('crews', JSON.stringify(this.crews))
        },
        async delete(id) {
            this.crews = this.crews.filter(c => c.id !== id)
            localStorage.setItem('crews', JSON.stringify(this.crews))
        },
        async load() {
            const crews = JSON.parse(localStorage.getItem('crews'))
            if (crews) {
                this.crews = crews
            }
        }
    }
  })