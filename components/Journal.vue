<template>
    <UModal title="Journal" :open="true" :close="{ onClick: () => $emit('onClose') }">
        <template #body>
            <UButtonGroup class="mb-4">
                <UButton
                    @click="editor.chain().focus().toggleBold().run()"
                    :disabled="!editor.can().chain().focus().toggleBold().run()"
                    icon="material-symbols:format-bold"
                    :color="editor.isActive('bold') ? 'primary' : 'neutral'"
                    :variant="editor.isActive('bold') ? 'solid' : 'subtle'"
                >
                </UButton>
                <UButton
                    @click="editor.chain().focus().toggleItalic().run()"
                    :disabled="!editor.can().chain().focus().toggleItalic().run()"
                    icon="material-symbols:format-italic"
                    :color="editor.isActive('italic') ? 'primary' : 'neutral'"
                    :variant="editor.isActive('italic') ? 'solid' : 'subtle'"
                >
                </UButton>
                <UButton
                    @click="editor.chain().focus().toggleBulletList().run()"
                    :disabled="!editor.can().chain().focus().toggleBulletList().run()"
                    icon="material-symbols:format-list-bulleted"
                    :color="editor.isActive('bulletList') ? 'primary' : 'neutral'"
                    :variant="editor.isActive('bulletList') ? 'solid' : 'subtle'"
                >
                </UButton>
                <UButton
                    @click="editor.chain().focus().toggleOrderedList().run()"
                    :disabled="!editor.can().chain().focus().toggleOrderedList().run()"
                    icon="mingcute:list-ordered-line"
                    :color="editor.isActive('orderedList') ? 'primary' : 'neutral'"
                    :variant="editor.isActive('orderedList') ? 'solid' : 'subtle'"
                >
                </UButton>
            </UButtonGroup>
            <TiptapEditorContent :editor="editor" class="border border-gray-400 rounded" />

            <div class="flex justify-end items-center">
                <UButton
                @click="saveJournal"
                :disabled="editor.isEmpty"
                class="mt-4"
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
const editor = useEditor({
    extensions: [TiptapStarterKit],
})
const emit = defineEmits(['onClose'])

onMounted(() => {
  if (props.trip.journal) {
    editor.value.commands.setContent(props.trip.journal)
  }
})

onBeforeUnmount(() => {
  unref(editor).destroy();
})

const saveJournal = () => {
    tripsStore.saveJournal(props.trip.id, editor.value.getHTML())
    toast.add({
        title: "Journal saved",
        icon: 'material-symbols:check-rounded',
        color: 'success'
    })
    emit('onClose')
}
</script>
<style>
ul {
  list-style-type: disc;
  padding-left: 1.5rem;
}
ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
}
.tiptap {
    min-height: 150px;
}
</style>