export const useRoutesStore = defineStore('routesStore', {
    state: () => ({
      routes: []
    }),
    actions: {
        get(id) {
            return this.routes.find(r => r.id === id)
        },
        async add(route) {
            const copy = { ...route, id: crypto.randomUUID() }
            this.routes.push(copy)
            localStorage.setItem('routes', JSON.stringify(this.routes))
        },
        async update(route) {
            const index = this.routes.findIndex(r => r.id === route.id)
            if (index !== -1) {
                this.routes[index] = { ...this.routes[index], ...route }
            }
            localStorage.setItem('routes', JSON.stringify(this.routes))
        },
        async addOrUpdate(route) {
            const index = this.routes.findIndex(r => r.id === route.id)
            if (index !== -1) {
                this.update(route)
            } else {
                this.add(route)
            }
        },
        async delete(id) {
            this.routes = this.routes.filter(r => r.id !== id)
            localStorage.setItem('routes', JSON.stringify(this.routes))
        },
        async load() {
            const routes = JSON.parse(localStorage.getItem('routes'))
            if (routes) {
                this.routes = routes
            }
        },
    }
  })