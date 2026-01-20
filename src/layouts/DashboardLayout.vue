<script setup lang="ts">
import Sidebar from '@/components/layout/Sidebar.vue'
import Header from '@/components/layout/Header.vue'
</script>

<template>
  <div class="min-h-screen bg-background font-sans">
    <Sidebar />

    <div class="pl-64 flex flex-col min-h-screen">
      <Header />
      
      <main class="flex-1 p-8">
        <slot />
      </main>
    </div>
  </div>
</template>