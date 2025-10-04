<script setup lang="ts">
import { ref } from 'vue';


defineProps<{ msg: string }>()

const count = ref(0)
</script>

<template>
  <div class="hero bg-base-200 rounded-box p-10">
    <div class="hero-content text-center">
      <div class="max-w-md">
        <h1 class="text-5xl font-bold">{{ msg }}</h1>
        <p class="py-6">
          You’ve successfully created a project with
          <a href="https://vitejs.dev/" class="link link-info" target="_blank">Vite</a> +
          <a href="https://vuejs.org/" class="link link-info" target="_blank">Vue 3</a> +
          <a href="https://daisyui.com/" class="link link-info" target="_blank">daisyUI</a>.
        </p>
        <div class="card bg-base-100/60 p-6 shadow-xl">
          <button class="btn btn-primary" type="button" @click="count++">count is {{ count }}</button>
          <div class="mt-4 text-sm">
            <p>
              Edit
              <code>components/HelloWorld.vue</code> to test HMR
            </p>
          </div>
        </div>

        <div class="mt-8 text-sm text-base-content/60">
          <p>Click on the Vite and Vue logos to learn more</p>
          <p class="mt-2">
            Check out the
            <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank" class="link">Vue Docs</a>
            for IDE support.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
