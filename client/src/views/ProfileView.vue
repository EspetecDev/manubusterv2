<script lang="ts">
import { supabase } from '@/lib/supabase';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {                                                                                                                                                              │
   Card,                                                                                                                                                               │
   CardContent,                                                                                                                                                        │
   CardDescription,                                                                                                                                                    │
   CardFooter,                                                                                                                                                         │
   CardHeader,                                                                                                                                                         │
   CardTitle,                                                                                                                                                          │
 } from '@/components/ui/card';                                                                                                                                        │
import { Button } from '@/components/ui/button';                                                                                                                      │
import { Label } from '@/components/ui/label';                                                                                                                        │
import { Input } from '@/components/ui/input';   

const router = useRouter();
const loading = ref(false);
const profile = ref<{ username: string, email: string } | null>(null);

onMounted(async () => {
    loading.value = true;
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
            const { data, error } = await supabase
                .from('profiles')
                .select('username, email')
                .eq('id', session.user.id)
                .single();

            if (error) throw error;
            profile.value = data;
        }
    } catch (e) {
        console.error('Error fetching profile: ', e);
    } finally {
        loading.value = false;
    }
});

async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
}
</script>
<template>
    <div class="container mx-auto p-6 max-w-lg">
        <Card>
            <CardHeader>
                <CardTitle>My Profile</CardTitle>
                <CardDescription>Manage your account settings and preferences.</CardDescription>
            </CardHeader>
            <CardContent class="space-y-4">
                <div v-if="loading" class="text-center py-4">
                    Loading profile...
                </div>
                <div v-else-if="profile" class="space-y-4">
                    <div class="grid w-full items-center gap-1.5">
                        <Label for="username">Username</Label>
                        <Input id="username" v-model="profile.username" readonly />
                    </div>
                    <div class="grid w-full items-center gap-1.5">
                        <Label for="email">Email</Label>
                        <Input id="email" v-model="profile.email" readonly />
                    </div>
                </div>
                <div v-else class="text-center py-4 text-red-500">
                    Failed to load profile.
                </div>
            </CardContent>
            <CardFooter class="flex justify-end">
                <Button variant="destructive" @click="handleLogout">Logout</Button>
            </CardFooter>
        </Card>
    </div>
</template>