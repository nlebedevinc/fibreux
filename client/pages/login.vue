<template>
  <main>
    <div :class="$style.container">
      <el-form :model="form" status-icon :rules="rules" ref="ruleForm">
        <el-form-item label="Fibery Token" prop="token">
          <el-input autocomplete="off" v-model="form.token"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="login">Submit</el-button>
        </el-form-item>
      </el-form>
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

  // token: string = '';

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
}

.row {
  padding-left: 96px;
  padding-right: 96px;
}
</style>
