<template>
  <Head>
    <Title>{{ title }}</Title>
    <Meta
      name="description"
      :content="title"
    />
  </Head>

  <NuxtLoadingIndicator />
  <NuxtLayout>
    <UApp :toaster="{ position: 'top-center' }">
      <NuxtPage />
    </UApp>
  </NuxtLayout>
</template>

<script setup lang="ts">
const title = ref('book-management-system')
</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}

.layout-enter-active,
.layout-leave-active {
  transition: all 0.4s;
}

.layout-enter-from,
.layout-leave-to {
  filter: grayscale(1);
}
</style>
