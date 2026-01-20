<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-vue-next';

// useDark handles the .dark class on the html automatically
const isDark = useDark();
const toggleDark = useToggle(isDark);
</script>

<template>
    <Button variant="ghost" size="icon" @click="toggleDark()">
        <Sun class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-90 dark:scale-0"/>
        <Moon class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-100 transition-all dark:rotate-0 dark:scale-100"/>
        <span class="sr-only">Toogle theme</span>
    </Button>
</template>