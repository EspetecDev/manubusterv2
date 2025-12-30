<script setup>
import { Rocket } from 'lucide-vue-next';
import { Button } from '@/components/ui/button'
import ThemeToggle from './components/ThemeToggle.vue';
</script>

<template>
  <div class="min-h-screen bg-gray-50 text-gray-900 font-sans">
    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Project Started</h1>
      <p class="text-gray-600">Edit App.vue to begin.</p>
      <Rocket class="w-6 h-6 text-blue-500" />


      <div class="p-10 flex gap-4">
        <Button>Default Button</Button>
        <Button variant="destructive">Delete</Button>
        <Button variant="outline">Cancel</Button>
      </div>

      <ThemeToggle/>
    </main>
  </div>
</template>