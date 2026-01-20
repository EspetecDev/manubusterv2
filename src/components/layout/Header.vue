<script setup lang="ts">
import ThemeToggle from '@/components/ThemeToggle.vue'
</script>

<template>
  <header class="h-16 border-b bg-background flex items-center justify-between px-6 sticky top-0 z-10">
    <div class="font-medium text-sm text-muted-foreground">
      Overview
    </div>

    <div class="flex items-center gap-4">
      <ThemeToggle />
    </div>
  </header>
</template>