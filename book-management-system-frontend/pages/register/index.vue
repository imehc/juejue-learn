<template>
  <div>
    <UForm
      :schema="authSchema"
      :state="state"
      class="space-y-4"
      @submit="onSubmit"
    >
      <UFormGroup
        label="用户名"
        name="username"
      >
        <UInput v-model="state.username" />
      </UFormGroup>
      <UFormGroup
        label="密码"
        name="password"
      >
        <UInput
          v-model="state.password"
          type="password"
        />
      </UFormGroup>
      <UButton
        type="submit"
        block
        :loading="isPending"
      >
        注册
      </UButton>
    </UForm>
    <UDivider
      label="OR"
      class="my-3"
    />
    <div class="text-right">
      <UButton
        to="login"
        target="_self"
        variant="link"
        :disabled="isPending"
      >
        已有账号？去登录
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
  await $fetch('/api/register', {
    method: 'POST',
    body: event.data,
    onResponseError: (error) => {
      toast.add({ title: error.response._data.message ?? '注册失败', color: 'red' })
      console.log('error')
    },
  })
    .then(() => {
      toast.add({ title: '注册成功' })
      cookie.value = event.data.username
      router.replace('book')
    })
    .finally(() => isPending.value = false)
}
</script>

<style></style>
