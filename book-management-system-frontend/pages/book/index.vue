<template>
  <div class="w-full h-full">
    <UProgress
      v-if="status === 'pending'"
      animation="swing"
      class="flex items-center justify-center w-full h-full"
    />
    <div
      v-else
      class="grid w-full h-full grid-cols-4 gap-4 overflow-y-auto lg:grid-cols-6"
    >
      <template
        v-for="book in data"
        :key="book.id"
      >
        <div class="aspect-[1/1.5] flex flex-col shadow-sm rounded-sm overflow-hidden">
          <div class="flex-1">
            <NuxtImg
              :src="BASE_PATH + book.cover"
              class="object-cover bg-center bg-no-repeat bg-cover"
            />
          </div>
          <div class="text-sm text-center text-gray-400 shrink-0">
            {{ book.name }}
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { BASE_PATH } from '~/book-management-system-api'

definePageMeta({ layout: 'book' })

const { status, data } = useLazyFetch('/api/find-all-book', {
  transform: data => data?.map(item => ({ id: item.id, name: item.name, cover: item.cover })) ?? [],
})
</script>

<style></style>
