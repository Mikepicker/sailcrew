<template>
  <UApp>
    <NuxtPage />
  </UApp>
</template>
<script setup>
const routesStore = useRoutesStore()
routesStore.load()

const crewsStore = useCrewsStore()
crewsStore.load()

const tripsStore = useTripsStore()
tripsStore.load()

const sailSyncStore = useSailSyncStore()
sailSyncStore.load()
</script>
