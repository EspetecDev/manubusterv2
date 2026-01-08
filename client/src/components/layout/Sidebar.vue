<script lang="ts">
import { RouterLink } from 'vue-router';
import { Home, Settings, User, LogOut } from 'lucide-vue-next';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'vue-router';

const router = useRouter();

const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
}
</script>

<template>
  <aside class="w-64 border-r bg-card h-screen flex flex-col fixed left-0 top-0">
    <div class="h-16 flex items-center px-6 border-b">
      <span class="font-bold text-xl tracking-tight">ManuBuster</span>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <RouterLink 
        to="/" 
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        active-class="bg-accent text-accent-foreground"
      >
        <Home class="w-4 h-4" />
        Dashboard
      </RouterLink>
      
      <RouterLink 
        to="/profile" 
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        active-class="bg-accent text-accent-foreground"
      >
        <User class="w-4 h-4" />
        Profile
      </RouterLink>

      <RouterLink 
        to="/settings" 
        class="flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
        active-class="bg-accent text-accent-foreground"
      >
        <Settings class="w-4 h-4" />
        Settings
      </RouterLink>
    </nav>

    <div class="p-4 border-t">
      <button 
        @click="handleLogout"
        class="flex items-center gap-3 px-3 py-2 w-full rounded-md text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
      >
        <LogOut class="w-4 h-4" />
        Log out
      </button>
    </div>
  </aside>
</template>