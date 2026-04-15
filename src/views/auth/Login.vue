<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { InputPassword, InputText } from '../../common/vue-form'
import InputNumber from '../../common/vue-form/InputNumber.vue'
import { VueDivider } from '../../common/vue-layout'
import VueButton from '../../common/VueButton.vue'
import { AuthService } from '../../modules/auth/auth.service'

const router = useRouter()

const formState = reactive({
  username: '',
  password: '',
  uid: 0,
})

const loading = ref(false)

const isRootLogin = computed(() => {
  return formState.username === 'ROOT'
})

const startLogin = async () => {
  loading.value = true
  if (!isRootLogin.value) {
    const result = await AuthService.login({
      username: formState.username.trim(),
      password: formState.password.trim(),
    })
    if (result) {
      router.push({ name: 'AppHome' })
    }
  } else if (isRootLogin.value) {
    const result = await AuthService.loginRoot({
      username: formState.username.trim(),
      password: formState.password.trim(),
      uid: formState.uid,
    })
    if (result) {
      router.push({ name: 'AppHome' })
    }
  }
  loading.value = false
}
</script>

<template>
  <div class="wrapper">
    <div class="form-card p-4">
      <VueDivider class="mt-4" border-width="1px">
        <div class="mx-4 text-2xl font-medium">ĐĂNG NHẬP</div>
      </VueDivider>
      <form @submit.prevent="startLogin">
        <div class="mt-4">
          <div>Tài khoản</div>
          <div><InputText v-model:value="formState.username" name="username" required /></div>
        </div>
        <div class="mt-4">
          <div>Mật khẩu</div>
          <div>
            <InputPassword v-model:value="formState.password" name="password" required />
          </div>
        </div>

        <div v-if="isRootLogin" class="mt-4">
          <div>Uid</div>
          <div>
            <InputNumber v-model:value="formState.uid" />
          </div>
        </div>

        <div class="flex justify-center mt-6 mb-4">
          <VueButton color="blue" type="submit" :loading="loading">Đăng nhập</VueButton>
        </div>
      </form>
    </div>
    <div class="company-text">
      <p>Công ty TNHH Công nghệ và TM QUANTECH_CAPITAL</p>
      <p>
        HOTLINE:
        <a href="tel:0988456789" class="hotline">0988.456.789</a>
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  // background-image: url('@/assets/image/background-login.jpg');
  background-position: center;
  background-color: #3b6fba;
  background-repeat: no-repeat;
  background-size: cover;
  padding-top: 10%;

  .form-card {
    max-width: 600px;
    width: 90%;
    margin: 0 auto;
    border-radius: 10px;
    box-shadow:
      0px 3px 5px rgba(0, 0, 0, 0.02),
      0px 0px 2px rgba(0, 0, 0, 0.05),
      0px 1px 4px rgba(0, 0, 0, 0.08);
    background-color: #fff;
  }

  .company-text {
    position: fixed;
    bottom: 10px;
    right: 10px;
    text-transform: uppercase;
    font-weight: bold;
    color: #fff;

    .hotline {
      color: #fff;
    }
  }
}
</style>
