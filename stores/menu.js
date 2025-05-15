export const useMenuStore = defineStore('menuStore', {
    state: () => ({
      selected: ''
    }),
    actions: {
      async select(section) {
        this.selected = section
      }
    }
  })