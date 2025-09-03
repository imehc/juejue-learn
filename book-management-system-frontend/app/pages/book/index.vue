<template>
  <div>
    <NuxtLayout name="book">
      <template #header>
        <UCard class="mb-6 rounded-2xl box-border shadow">
          <div class="flex justify-start gap-x-3">
            <UInput
              v-model="bookName"
              icon="i-heroicons-magnifying-glass-20-solid"
              placeholder="书籍名称"
            />
            <UButton
              color="neutral"
              variant="outline"
              @click="handleSearch"
            >
              搜索图书
            </UButton>
            <UButton @click="handleCreate">
              新增图书
            </UButton>
          </div>
        </UCard>
      </template>

      <div class="w-full h-full">
        <UProgress
          v-if="status === 'pending'"
          animation="swing"
          class="flex items-center justify-center w-full h-full"
        />
        <div
          v-else
          class="w-full h-full overflow-y-auto overflow-hidden"
        >
          <div class="grid grid-cols-4 gap-4 lg:grid-cols-6 w-full">
            <template
              v-for="book in data"
              :key="book.id"
            >
              <UContextMenu :items="renderItems(book)">
                <div
                  class="aspect-[1/1.8] flex shadow-sm rounded-sm overflow-hidden flex-col-reverse cursor-pointer hover:shadow-lg"
                >
                  <div class="text-xs text-left ml-1 text-neutral-400 shrink-0">
                    {{ book.author }}
                  </div>
                  <div class="text-sm text-center font-bold">
                    {{ book.name }}
                  </div>
                  <div class="flex-1">
                    <NuxtImg
                      :src="BASE_PATH + book.cover"
                      class="object-cover bg-center bg-no-repeat bg-cover"
                    />
                  </div>
                </div>
              </UContextMenu>
            </template>
          </div>
        </div>
      </div>
    </NuxtLayout>
    <BookForm
      v-model="formIsOpen"
      :data="formData"
      :refresh="refresh"
      :type="formType"
    />
  </div>
</template>

<script lang="ts" setup>
import { BASE_PATH, type BookItem } from '~~/book-management-system-api'
import { initBook, type IFormType } from '~/schemas'
import type { ContextMenuItem } from '@nuxt/ui'

const toast = useToast()

// ===========按图书名称搜索=============
const bookName = ref('')
const submitBookName = ref('')
const handleSearch = () => {
  submitBookName.value = bookName.value
}

const { status, data, refresh } = useLazyFetch('/api/book/find-all', {
  transform: data => data ?? [],
  query: { name: submitBookName },
})

// ===================右击菜单===================
const renderItems = (book: BookItem): ContextMenuItem[][] => {
  return [
    [
      { label: '详情', icon: 'i-f7:exclamationmark-square', onSelect: () => handleInfo(book) },
      {
        label: '更新', icon: 'i-f7:square-pencil', onSelect: () => handleUpdate(book) },
    ],
    [
      { label: '删除', icon: 'i-f7:delete-right', color: 'error', onSelect: () => handleDelete(book) },
    ],
  ]
}

// ===================表单===================
const formType = ref<IFormType>('create')
const formIsOpen = ref(false)
const formData = ref(initBook())

const handleCreate = () => {
  formType.value = 'create'
  formData.value = initBook()
  formIsOpen.value = true
}

const handleUpdate = (book: BookItem) => {
  formType.value = 'update'
  formData.value = { ...book }
  formIsOpen.value = true
}

const handleInfo = (book: BookItem) => {
  formType.value = 'info'
  formData.value = { ...book }
  formIsOpen.value = true
}

const handleDelete = (book: BookItem) => {
  toast.add({
    title: `确定删除图书 ${book.name}吗？`,
    actions: [
      {
        label: '取消',
        variant: 'outline',
      },
      {
        label: '确定',
        onClick: async () => {
          $fetch(`/api/book/${book.id}/delete`, {
            method: 'DELETE',
            onResponseError: (error) => {
              toast.add({ title: error.response._data.message ?? '删除失败', color: 'error' })
            },
          })
            .then(() => {
              toast.add({ title: '删除成功' })
              refresh()
            })
            .catch(() => { })
        },
        color: 'error',
      },
    ],
  })
}
</script>
