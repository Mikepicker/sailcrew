<template>
    <UModal title="SailSync Settings" :open="selected" :close="{ onClick: () => menuStore.selected = '' }">
        <template #body>
            <div class="flex flex-col gap-2 mb-2">
                <UInput v-model="sailSyncUrl" placeholder="Enter SailSync IP" />
                <UInput v-model="sailSyncPort" placeholder="Enter SailSync Port" />
                <UInput v-model="sailSyncUsername" placeholder="Enter SailSync Username" />
                <UInput v-model="sailSyncPassword" placeholder="Enter SailSync Password" />
            </div>
            
            <div class="flex justify-end items-center gap-2">
                <UButton 
                    @click="testSailSync"
                    class="mt-4"
                    icon="material-symbols:cloud-done-outline"
                    variant="subtle"
                    color="primary">SailSync Test</UButton>
                <UButton 
                    @click="saveConfig"
                    :disabled="!sailSyncUrl || !sailSyncPort"
                    class="mt-4"
                    icon="material-symbols:check"
                    color="success">Save</UButton>
            </div>
        </template>
    </UModal>
</template>
<script setup>
const menuStore = useMenuStore()
const sailSyncStore = useSailSyncStore()
const selected = computed(() => menuStore.selected === 'sailsync')
const toast = useToast()
const sailSyncUrl = ref('')
const sailSyncPort = ref('')
const sailSyncUsername = ref('')
const sailSyncPassword = ref('')

onMounted(() => {
    sailSyncUrl.value = sailSyncStore.sailSyncUrl
    sailSyncPort.value = sailSyncStore.sailSyncPort
    sailSyncUsername.value = sailSyncStore.sailSyncUsername
    sailSyncPassword.value = sailSyncStore.sailSyncPassword
})

const testSailSync = () => {
    const url = `http://${sailSyncUrl.value}:${sailSyncPort.value}`
    const auth = btoa(`${sailSyncUsername.value}:${sailSyncPassword.value}`)

    fetch(url, {
        method: 'PROPFIND',
        headers: {
            'Authorization': `Basic ${auth}`,
            'Depth': '1',
        }
    })
    .then(response => {
        if (response.ok) {
            toast.add({
                title: "SailSync connection successful",
                icon: 'material-symbols:check-rounded',
                color: 'success'
            })
        } else {
            toast.add({
                title: "SailSync connection failed",
                icon: 'material-symbols:error-outline',
                color: 'error'
            })
        }
    })
    .catch(error => {
        toast.add({
            title: "SailSync connection error",
            icon: 'material-symbols:error-outline',
            color: 'error'
        })
    })
}

const saveConfig = () => {
    sailSyncStore.saveConfig(
        sailSyncUrl.value,
        sailSyncPort.value,
        sailSyncUsername.value,
        sailSyncPassword.value
    )
    toast.add({
        title: "SailSync settings saved",
        icon: 'material-symbols:check-rounded',
        color: 'success'
    })
}
</script>