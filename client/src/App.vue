<script setup lang="ts">
import 'vue-sonner/style.css'
import { Toaster } from '@/components/ui/sonner'
import { useRoute, RouterView } from 'vue-router'
import { computed } from 'vue';
import DashboardLayout from './layouts/DashboardLayout.vue';

const route = useRoute();

// If the route has meta.layout = 'auth', we don't use the dashboard layout
// Otherwise, we default to DashboardLayout
const isAuthLayout = computed(() => {
  return route.meta.layout === 'auth';
})

</script>

<template>
  <div v-if="isAuthLayout" class="min-h-screen bg-background text-foreground font-sans">
    <RouterView />
  </div>

  <DashboardLayout v-else>
    <RouterView />
  </DashboardLayout>
  <Toaster/>
</template>