<template>
  <main>
    <div :class="$style.container">
      <form @submit.prevent="login">
        <label for="token">
          <h2>Token:</h2>
          <input v-model="token" class="u-full-width" type="text" placeholder="Fibery token" id="token">
        </label>
        <input class="button-primary" type="submit" value="Submit">
      </form>
    </div>
  </main>
</template>

<script lang="ts">
import Component from 'nuxt-class-component'
import Vue from 'vue'
// import { namespace } from 'vuex-class'

// const entries = namespace('entries')

@Component({})
export default class Login extends Vue {
  token: string = '';

  login(): Promise<void> {
    return this.$store.dispatch('entries/login', { token: this.token })
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
