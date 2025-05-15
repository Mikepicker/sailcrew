<template>
    <UModal title="Checklist" :open="true" :close="{ onClick: () => $emit('onClose') }">
        <template #body>
            <div class="flex flex-col gap-2">
                <div v-if="checklist.length === 0" class="flex justify-center items-center text-gray-500 text-sm my-2">This place is quite empty...</div>
                <div v-for="item in checklist" class="flex justify-center items-center gap-2">
                    <UCheckbox size="xl" v-model="item.checked" />
                    <UInput
                        v-model="item.text"
                        class="w-full" 
                        color="primary"
                        variant="ghost"
                        :placeholder="randomPlaceholders[Math.floor(Math.random() * randomPlaceholders.length)]"
                    />
                    <UButton
                        @click="checklist.splice(checklist.indexOf(item), 1)"
                        icon="material-symbols:delete-outline"
                        color="error"
                        variant="subtle" />
                </div>
            </div>
            <div class="flex justify-end items-center gap-2 mt-4">
                <UButton
                    @click="checklist.push({ checked: false, text: '' })"
                    icon="material-symbols:add"
                    color="primary">Add Item</UButton>
                <UButton
                    @click="saveChecklist"
                    :disabled="checklist.length === 0"
                    icon="material-symbols:check"
                    color="success">Save</UButton>
            </div>
            
        </template>
    </UModal>
</template>
<script setup>
const props = defineProps([ 'trip' ])
const tripsStore = useTripsStore()
const toast = useToast()
const checklist = ref([])
const emit = defineEmits(['onClose'])

const randomPlaceholders = [
    'Check the sails',
    'Prepare the map',
    'Gather the crew',
    'Check the compass',
    'Stock up on supplies',
    'Prepare the ship',
    'Check the weather',
    'Set the course'
]

onMounted(() => {
    const storedChecklist = tripsStore.getChecklist(props.trip.id)
    if (storedChecklist) {
        checklist.value = [ ...storedChecklist ]
    }
    console.log('checklist', checklist.value)
})

const saveChecklist = () => {
    tripsStore.saveChecklist(props.trip.id, toRaw(checklist.value))
    toast.add({
        title: "Checklist saved",
        icon: 'material-symbols:check-rounded',
        color: 'success'
    })
    emit('onClose')
}
</script>