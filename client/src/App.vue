<script setup>
import { RouterLink, RouterView } from 'vue-router'
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <div class="min-h-screen bg-background text-foreground font-sans">
    <header class="border-b">
      <div class="container mx-auto flex h-16 items-center justify-between px-4">
        
        <nav class="flex gap-6 items-center">
          <span class="font-bold text-lg mr-4">MyApp</span>
          <RouterLink 
            to="/" 
            class="text-sm font-medium transition-colors hover:text-primary"
            active-class="text-primary font-bold"
          >
            Home
          </RouterLink>
          <RouterLink 
            to="/about" 
            class="text-sm font-medium transition-colors hover:text-primary"
            active-class="text-primary font-bold"
          >
            About
          </RouterLink>
        </nav>

        <ThemeToggle />
      </div>
    </header>

    <main class="container mx-auto py-8 px-4">
      <RouterView />
    </main>
  </div>
</template>