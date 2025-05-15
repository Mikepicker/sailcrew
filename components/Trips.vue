<template>
    <UModal title="Trips" :open="selected" :close="{ onClick: () => menuStore.selected = '' }">
        <template #body>
            <Journal v-if="journalOpen" :trip="currentTrip" @onClose="journalOpen = false" />
            <Checklist v-if="checklistOpen" :trip="currentTrip" @onClose="checklistOpen = false" />
            <UModal
                :title="currentTrip.id ? 'Edit Trip' : 'Create Trip'"
                :open="showCreateModal"
                :close="{ onClick: closeCreateModal }">
                <template #body>
                    <div class="font-bold mb-2">Trip Name</div>
                    <UInput class="mb-4" v-model="currentTrip.name" placeholder="Enter trip name" />

                    <div class="font-bold mb-2">Crew</div>
                    <div class="flex justify-between items-center gap-2 mb-2">
                        <div class="flex gap-2">
                            <USelect placeholder="Select Crew" v-model="currentTrip.crewId" :items="crews" class="w-48" />
                        </div>
                    </div>

                    <div class="font-bold mb-2">Route</div>
                    <div class="flex justify-between items-center gap-2 mb-2">
                        <div class="flex gap-2">
                            <USelect placeholder="Select Route" v-model="currentTrip.routeId" :items="routes" class="w-48" />
                        </div>
                    </div>

                    <div class="flex justify-end items-center">
                        <UButton 
                            @click="addOrUpdateTrip"
                            :disabled="!currentTrip.name || !currentTrip.crewId || !currentTrip.routeId"
                            class="mt-4"
                            icon="material-symbols:check"
                            color="success">Save</UButton>
                    </div>
                </template>
            </UModal>

            <div v-if="!trips.length" class="text-center text-gray-500">
                <p class="text-sm">No trips yet!</p>
            </div>

            <UAccordion :items="trips.map(c => ({ ...c, label: c.name, icon: 'material-symbols:globe-location-pin' }))">
                <template #body="{ item }">
                    <div class="flex justify-between items-center">

                        <div class="flex flex-col gap-2">
                            <div class="flex gap-2">
                                <UIcon name="mdi-pirate" class="size-5" />
                                <div>{{ crewsStore.get(item.crewId).name }}</div>
                            </div>
                            <div class="flex gap-2">
                                <UIcon name="gis-pirate-map" class="size-5" />
                                <div>{{ routesStore.get(item.routeId).name }}</div>
                            </div>
                        </div>

                        <div class="flex justify-end gap-2">
                            <UTooltip text="Journal">
                                <UButton
                                    @click="openJournal(item)"
                                    icon="bi:journal-richtext"
                                    variant="subtle"
                                    color="primary"></UButton>
                            </UTooltip>
                            <UTooltip text="Checklist">
                                <UButton
                                    @click="openChecklist(item)"
                                    icon="solar:checklist-minimalistic-outline"
                                    variant="subtle"
                                    color="primary"></UButton>
                            </UTooltip>
                            <UTooltip text="Edit Trip">
                                <UButton
                                    @click="selectTrip(item)"
                                    icon="material-symbols:edit-outline"
                                    variant="subtle"
                                    color="primary"></UButton>
                            </UTooltip>
                            <UTooltip text="Delete Trip">
                                <UButton 
                                    @click="deleteTrip(item.id)"
                                    icon="material-symbols:delete-outline"
                                    color="error"></UButton>
                            </UTooltip>
                        </div>
                    </div>
                </template>
            </UAccordion>

            <div class="flex justify-end items-center mt-4">
                <UButton 
                    @click="showCreateModal = true"
                    icon="material-symbols:add"
                    color="primary"
                    size="lg">New Trip</UButton>
            </div>
        </template>
    </UModal>
</template>
<script setup>
const menuStore = useMenuStore()
const tripsStore = useTripsStore()
const crewsStore = useCrewsStore()
const routesStore = useRoutesStore()
const selected = computed(() => menuStore.selected === 'trips')
const trips = computed(() => tripsStore.trips)
const crews = computed(() => crewsStore.crews.map(c => ({ ...c, label: c.name, value: c.id })))
const routes = computed(() => routesStore.routes.map(r => ({ ...r, label: r.name, value: r.id })))
const toast = useToast()
const showCreateModal = ref(false)
const currentTrip = ref({
    name: '',
    crewId: null
})
const journalOpen = ref(false)
const checklistOpen = ref(false)

const selectTrip = (trip) => {
    currentTrip.value = trip
    showCreateModal.value = true
}

const addOrUpdateTrip = () => {
    tripsStore.addOrUpdate(currentTrip.value)
    currentTrip.value = {
        name: '',
        crewId: null,
        routeId: null
    }
    showCreateModal.value = false
}

const closeCreateModal = () => {
    showCreateModal.value = false
    currentTrip.value = {
        name: '',
        crewId: null,
        routeId: null
    }
}

const deleteTrip = (id) => {
    tripsStore.delete(id)
    toast.add({
        title: "Trip deleted",
        icon: 'material-symbols:delete-outline',
        color: 'error'
    })
}

const openJournal = (trip) => {
    journalOpen.value = true
    currentTrip.value = trip
}

const openChecklist = (trip) => {
    checklistOpen.value = true
    currentTrip.value = trip
}
</script>