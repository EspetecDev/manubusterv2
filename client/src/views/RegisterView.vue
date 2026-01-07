<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
Card,
CardHeader,
CardTitle,
CardDescription,
CardContent,
CardFooter,
} from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast';
import { supabase } from '@/lib/supabase';

const router = useRouter();
const username = ref('');
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const errorMsg = ref('');

const handleRegister = async () => {
    isLoading.value = true;
    errorMsg.value = '';

    const { error } = await supabase.auth.signInWithPassword({
        email: email.value,
        password: password.value
    });

    if (error) {
        errorMsg.value = error.message;
        isLoading.value = false;
    } else {
        router.push('/');
   }
}

const handleGoogleRegister = async () => {
    //...
}

</script>
<template>
  <div class="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-zinc-950 p-4">
    <Card class="w-full max-w-md">
      <CardHeader class="space-y-1">
        <CardTitle class="text-2xl font-bold text-center">Login</CardTitle>
        <CardDescription class="text-center">
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      
      <CardContent class="grid gap-4">
        <div v-if="errorMessage" class="text-red-500 text-sm text-center">
          {{ errorMessage }}
        </div>

        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" v-model="email" />
        </div>
        
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" v-model="password" />
        </div>

        <Button class="w-full" @click="handleLogin" :disabled="isLoading">
          <span v-if="isLoading">Signing in...</span>
          <span v-else>Sign In</span>
        </Button>
      
        <div class="relative">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t" />
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <Button variant="outline" class="w-full" @click="handleGoogleLogin">
          Google
        </Button>
      </CardContent>

      <CardFooter>
        <div class="text-sm text-center text-muted-foreground w-full">
          Don't have an account? 
          <a href="#" class="text-primary hover:underline">Sign up</a>
        </div>
      </CardFooter>
    </Card>
  </div>
</template>