<template>
  <UModal
    v-model:open="isOpen"
    :title="`${formType === 'create' ? '添加' : formType === 'update' ? '修改' : '查看'}图书`"
    description=""
    @close="handleClose"
  >
    <template #body>
      <UForm
        :id="form"
        ref="formRef"
        :schema="bookSchema"
        :state="state"
        class="space-y-4"
        :validate-on="['change', 'input', 'submit']"
        @submit="onSubmit"
      >
        <UAlert
          icon="i-line-md:folder-multiple"
          color="primary"
          variant="solid"
          :title="formType === 'info' ? '图书详情' : formType === 'update' ? '编辑图书' : '新增图书'"
          :description="formType === 'info' ? '' : '请完善图书信息'"
        />
        <UFormField
          label="图书"
          name="name"
        >
          <UInput
            v-model="state.name"
            class="w-full"
            autocomplete="on"
            :disabled="formType === 'info'"
          />
        </UFormField>
        <UFormField
          label="作者"
          name="author"
        >
          <UInput
            v-model="state.author"
            class="w-full"
            autocomplete="on"
            :disabled="formType === 'info'"
          />
        </UFormField>
        <UFormField
          label="描述"
          name="description"
        >
          <UTextarea
            v-model="state.description"
            class="w-full"
            autocomplete="on"
            :disabled="formType === 'info'"
          />
        </UFormField>
        <UFormField
          label="封面"
          name="cover"
        >
          <label
            class="min-w-24 min-h-24 border border-solid border-gray-300 rounded-md flex justify-center items-center"
            :class="formType === 'info' ? 'cursor-not-allowed' : 'cursor-pointer'"
          >
            <input
              type="file"
              className="hidden w-full h-full z-10"
              accept=".png, .jpg, .jpeg, .gif"
              :disabled="formType === 'info'"
              @change="onFileChange"
            >
            <UIcon
              v-if="!state.cover"
              name="i-f7:plus"
              class="w-10 h-10"
            />
            <NuxtImg
              v-else
              :src="BASE_PATH + state.cover"
              class="object-cover bg-center bg-no-repeat bg-cover"
            />
          </label>
        </UFormField>
      </UForm>
    </template>
    <template #footer>
      <UButton
        type="submit"
        block
        :loading="isPending"
        :disabled="isPending"
        :form="form"
      >
        {{ isPending ? '提交中...' : formType === 'info' ? '关闭' : '提交' }}
      </UButton>
    </template>
  </UModal>
</template>

<script setup lang="ts">
import { bookSchema, initBook, type BookSchemaValue, type IFormType } from '~/schemas'
import type { FormSubmitEvent } from '#ui/types'
import { BASE_PATH, type BookItem } from '~~/book-management-system-api'

defineOptions({
  name: 'BookForm',
})

type IBookItem = BookSchemaValue & Partial<Pick<BookItem, 'id'>>
interface Props {
  refresh?(): void
}

const isOpen = defineModel<boolean>({ type: Boolean, default: false })
const state = defineModel<IBookItem>('data', { type: Object, default: initBook() })
const formType = defineModel<IFormType>('type', { default: 'create' })
const { refresh } = defineProps<Props>()

const toast = useToast()
const form = useId()

const isPending = ref(false)
const uploadImagePending = ref(false)

const onSubmit = async (event: FormSubmitEvent<BookSchemaValue>) => {
  if (!formType.value || formType.value === 'info') {
    isOpen.value = false
    return
  }
  isPending.value = true
  const path = formType.value === 'create' ? '/api/book/create' : `/api/book/${state.value?.id}/update`
  $fetch(path, {
    method: 'PUT',
    body: event.data,
    onResponseError: (error) => {
      const text = (formType.value === 'create') ? '创建失败' : '更新失败'
      toast.add({ title: error.response._data.message ?? text, color: 'error' })
    },
  })
    .then(() => {
      const text = (formType.value === 'create') ? '创建成功' : '更新成功'
      toast.add({ title: text })
      refresh?.()
      isOpen.value = false
    })
    .catch(() => { })
    .finally(() => isPending.value = false)
}

const onFileChange = async (event: Event) => {
  const file = (event.target as HTMLInputElement).files?.[0]
  const allowedTypes = ['png', 'jpg', 'jpeg', 'gif'].map(item => 'image/' + item)
  // 只允许上传指定类型的图片
  if (!file || !allowedTypes.includes(file.type.toLowerCase())) return
  uploadImagePending.value = true

  const formData = new FormData()
  formData.append('file', file)
  await $fetch('/api/update-image', {
    method: 'POST',
    body: formData,
  })
    .then((data) => {
      state.value.cover = data?.path as string
      toast.add({ title: '上传成功' })
    })
    .catch(() => {
      toast.add({ title: '上传失败', color: 'error' })
    })
    .finally(() => {
      uploadImagePending.value = false
    })
}

const formRef = ref()

const handleClose = () => {
  formRef.value?.clear()
}
</script>
