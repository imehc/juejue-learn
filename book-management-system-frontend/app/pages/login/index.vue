<template>
  <div>
    <UForm
      :schema="authSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormField
        label="用户名"
        name="username"
      >
        <UInput
          v-model="state.username"
          class="w-full"
          autocomplete="on"
        />
      </UFormField>
      <UFormField
        label="密码"
        name="password"
      >
        <UInput
          v-model="state.password"
          class="w-full"
          autocomplete="on"
          type="password"
        />
      </UFormField>
      <UButton
        type="submit"
        block
        :loading="isPending"
      >
        登录
      </UButton>
    </UForm>
    <USeparator
      label="OR"
      class="my-3"
    />
    <div class="text-right">
      <UButton
        to="register"
        target="_self"
        variant="link"
        :disabled="isPending"
      >
        没有账号？去注册
      </UButton>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormSubmitEvent } from '#ui/types'
import { authSchema, type AuthSchemaValue } from '~/schemas'

definePageMeta({ layout: 'auth' })

const toast = useToast()

const cookie = useCookie(USERNAME)
const router = useRouter()

onMounted(() => {
  cookie.value = null
})

const state = reactive<AuthSchemaValue>({
  username: '',
  password: '',
})
const isPending = ref(false)

const onSubmit = async (event: FormSubmitEvent<AuthSchemaValue>) => {
  isPending.value = true
  await $fetch('/api/auth/login', {
    method: 'POST',
    body: event.data,
    onResponseError: (error) => {
      toast.add({ title: error.response._data.message ?? '登录失败', color: 'error' })
    },
  })
    .then(() => {
      toast.add({ title: '登录成功' })
      cookie.value = event.data.username
      router.replace('book')
    })
    .catch(() => {})
    .finally(() => isPending.value = false)
}
</script>

<style></style>
