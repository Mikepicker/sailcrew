<template>
    <UModal title="Crews" :open="selected" :close="{ onClick: () => menuStore.selected = '' }">
        <template #body>
            <UModal
                :title="currentCrew.id ? 'Edit Crew' : 'Create Crew'"
                :open="showCreateModal"
                :close="{ onClick: () => showCreateModal = false }">
                <template #body>
                    <div class="font-bold mb-2">Crew Name</div>
                    <UInput class="mb-4" v-model="currentCrew.name" placeholder="Enter crew name" />

                    <div class="flex justify-between items-center gap-2 mb-2">
                        <div class="font-bold">Members</div>
                        <div class="flex gap-2">
                            <UButton 
                                @click="currentCrew.members.push({ name: '', role: '' })"
                                icon="material-symbols:person-add-outline-rounded"
                                color="primary"></UButton>
                            <UButton 
                                @click="currentCrew.members.pop()"
                                :disabled="currentCrew.members.length === 0"
                                icon="material-symbols:person-remove-outline-rounded"
                                color="error"></UButton>
                        </div>
                    </div>
                    <div v-for="member in currentCrew.members" class="flex gap-2 mb-2">
                        <UInput label="Name" placeholder="Enter member name" v-model="member.name" />
                        <USelect 
                            label="Role" 
                            placeholder="Enter member role" 
                            v-model="member.role"
                            :items="roles" />
                    </div>

                    <div class="flex justify-end items-center">
                        <UButton 
                            @click="addOrUpdateCrew"
                            :disabled="!currentCrew.name || currentCrew.members.length === 0 || currentCrew.members.some(member => !member.name || !member.role)"
                            class="mt-4"
                            icon="material-symbols:check"
                            color="success">Save</UButton>
                    </div>
                </template>
            </UModal>

            <div v-if="!crews.length" class="text-center text-gray-500">
                <p class="text-sm">No crews yet!</p>
            </div>

            <div>
                <UAccordion :items="crews.map(c => ({ ...c, label: c.name, icon: 'mdi-pirate' }))">
                    <template #body="{ item }">
                        <div v-for="(member, index) in item.members">
                            <div class="font-bold my-2">{{ member.name }} <span class="font-normal">- {{ member.role }}</span></div>
                            <USeparator v-if="index < item.members.length - 1"/>
                        </div>

                        <div class="flex justify-end gap-2 mt-4">
                            <UButton
                                @click="selectCrew(item)"
                                icon="material-symbols:edit-outline"
                                color="primary"></UButton>
                            <UButton 
                                @click="crewsStore.delete(item.id)"
                                icon="material-symbols:delete-outline"
                                color="error"></UButton>
                        </div>
                    </template>
                </UAccordion>
            </div>

            <div class="flex justify-end items-center mt-4">
                <UButton 
                    @click="showCreateModal = true"
                    icon="material-symbols:add"
                    color="primary"
                    size="lg">New Crew</UButton>
            </div>
        </template>
    </UModal>
</template>
<script setup>
const menuStore = useMenuStore()
const crewsStore = useCrewsStore()
const selected = computed(() => menuStore.selected === 'crews')
const crews = computed(() => crewsStore.crews)
const showCreateModal = ref(false)
const currentCrew = ref({
    name: '',
    members: []
})
const roles = ref(['Captain', 'First Mate', 'Navigator', 'Cook', 'Deckhand', 'Surgeon'])

const selectCrew = (crew) => {
    currentCrew.value = JSON.parse(JSON.stringify(crew))
    showCreateModal.value = true
}

const addOrUpdateCrew = () => {
    crewsStore.addOrUpdate(currentCrew.value)
    currentCrew.value = {
        name: '',
        members: []
    }
    showCreateModal.value = false
}
</script>