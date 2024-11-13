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
              color="white"
              variant="solid"
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
              <div
                class="aspect-[1/1.8] flex shadow-sm rounded-sm overflow-hidden flex-col-reverse cursor-pointer hover:shadow-lg"
                @contextmenu.prevent="onContextMenu(book)"
              >
                <div class="text-xs text-left ml-1 text-gray-400 shrink-0">
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
            </template>
          </div>
        </div>
      </div>
    </NuxtLayout>
    <UContextMenu
      v-model="isOpen"
      :virtual-element="virtualElement"
    >
      <div class="p-3 grid grid-rows-3 gap-y-3 min-w-32">
        <UButton
          color="gray"
          variant="solid"
          label="详情"
          block
        >
          <template #trailing>
            <UIcon
              name="i-f7:exclamationmark-square"
              class="w-5 h-5"
            />
          </template>
        </UButton>
        <UButton
          color="primary"
          variant="solid"
          label="更新"
          block
          @click="handleUpdate"
        >
          <template #trailing>
            <UIcon
              name="i-f7:square-pencil"
              class="w-5 h-5"
            />
          </template>
        </UButton>
        <UButton
          color="red"
          variant="solid"
          label="删除"
          block
        >
          <template #trailing>
            <UIcon
              name="i-f7:delete-right"
              class="w-5 h-5"
            />
          </template>
        </UButton>
      </div>
    </UContextMenu>
    <BookForm
      v-model="formIsOpen"
      :data="formData"
      :refresh="refresh"
    />
  </div>
</template>

<script lang="ts" setup>
import { useMouse, useWindowScroll } from '@vueuse/core'
import { BASE_PATH, type BookItem } from '~/book-management-system-api'
import { initBook } from '~/schemas'

// ===========按图书名称搜索=============
const bookName = ref('')
const submitBookName = ref('')
const handleSearch = () => {
  submitBookName.value = bookName.value
}

const { status, data, refresh } = useLazyFetch('/api/book/find-all', {
  // transform: data => data?.map(item => ({ id: item.id, name: item.name, cover: item.cover, author: item.author })) ?? [],
  transform: data => data ?? [],
  query: { name: submitBookName },
})
// ===================右击菜单===================
const { x, y } = useMouse()
const { y: windowY } = useWindowScroll()

const isOpen = ref(false)
const virtualElement = ref({ getBoundingClientRect: () => ({}) })

const onContextMenu = (book: BookItem) => {
  formData.value = book
  // unref 获取 ref 的值
  const top = unref(y) - unref(windowY)
  const left = unref(x)
  virtualElement.value.getBoundingClientRect = () => ({
    width: 0,
    height: 0,
    top,
    left,
  })
  isOpen.value = true
}
// ===================表单===================
const formIsOpen = ref(false)
const formData = ref(initBook())

const handleCreate = () => {
  formData.value = initBook()
  formIsOpen.value = true
}
const handleUpdate = () => {
  formIsOpen.value = true
}
</script>

<style></style>
