<template>
  <main>
    <div :class="$style.container">
      <div :class="$style['form-container']">
        <h1>Log in</h1>
        <el-form :class="form" :model="form" status-icon :rules="rules" ref="ruleForm">
          <el-form-item label="Fibery Token" prop="token">
          <el-input autocomplete="off" v-model="form.token"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :class="$style.submit" type="primary" @click="login">Continue with token</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </main>
</template>

<script lang="ts">
import Component from 'nuxt-class-component'
import Vue from 'vue'
import { Form, FormItem, Input, Button } from 'element-ui'

const validator = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('Please provide a token'))
  } else {
    callback()
  }
}

@Component({
  components: {
    Form,
    FormItem,
    Input,
    Button,
  },
  middleware: ['authorized']
})
export default class Login extends Vue {
  form = {
    token: '',
  }

  rules = {
    token: [{ validator, trigger: 'blur' }]
  }

  login(): Promise<void> {
    return this.$store.dispatch('entries/login', { token: this.form.token })
  }
}
</script>

<style lang="scss" module >
.container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 12vh;
}

.form-container {
  width: 100%;
  max-width: 320px;
}

.submit {
  width: 100%
}
</style>
