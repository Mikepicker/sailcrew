<template>
    <div class="absolute top-2 right-2 z-20">
        <UButtonGroup size="xl">
            <UTooltip text="Crews">
                <UButton
                    @click="menuStore.select('crews')"
                    icon="mdi-pirate" 
                    :color="section === 'crews' ? 'primary' : 'neutral'" 
                    :variant="section === 'crews' ? 'solid' : 'subtle'" />
            </UTooltip>

            <UTooltip text="Trips">
                <UButton 
                    @click="menuStore.select('trips')"
                    icon="gis:pirate-map" 
                    :color="section === 'routes' ? 'primary' : 'neutral'" 
                    :variant="section === 'routes' ? 'solid' : 'subtle'" />
            </UTooltip>

            <UTooltip text="SailSync">
                <UButton 
                    @click="menuStore.select('sailsync')"
                    icon="material-symbols:bigtop-updates-rounded" 
                    :color="section === 'sailsync' ? 'primary' : 'neutral'" 
                    :variant="section === 'sailsync' ? 'solid' : 'subtle'" />
            </UTooltip>
        </UButtonGroup>
    </div>
</template>
<script setup>
const menuStore = useMenuStore()
const section = computed({
    get: () => menuStore.section
})
</script>
