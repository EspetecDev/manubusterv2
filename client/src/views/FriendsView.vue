<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useFriendsStore } from '@/stores/friends';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { Search, UserPlus, UserCheck, UserX, Loader2, Clock } from 'lucide-vue-next';
import { toast } from 'vue-sonner';

const friendsStore = useFriendsStore();
const searchQuery = ref('');

onMounted(async () => {
  await Promise.all([
    friendsStore.fetchFriends(),
    friendsStore.fetchFriendRequests()
  ]);
});

async function handleSearch() {
  if (!searchQuery.value.trim()) return;
  await friendsStore.searchUsers(searchQuery.value.trim());
}

async function sendRequest(userId: string) {
  await friendsStore.sendFriendRequest(userId);
  if (!friendsStore.error) {
    toast.success('Friend request sent!');
  } else {
    toast.error(friendsStore.error);
  }

  await handleSearch();
}

async function acceptRequest(id: string) {
  await friendsStore.acceptFriendRequest(id);
  if (!friendsStore.error) {
    toast.success('Friend request accepted!');
  }
}

async function rejectRequest(id: string) {
  await friendsStore.rejectFriendRequest(id);
  if (!friendsStore.error) {
    toast.success('Friend request rejected.');
  }
}

async function removeFriend(id: string) {
  if (confirm('Are you sure you want to remove this friend?')) {
    await friendsStore.removeFriend(id);
    if (!friendsStore.error) {
      toast.success('Friend removed.');
      await friendsStore.fetchFriends();
    }
  }
}
</script>

<template>
  <div class="container mx-auto p-6 space-y-8">
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold tracking-tight">Friends</h1>
    </div>

    <Tabs default-value="friends" class="w-full">
      <TabsList class="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="friends">
          Friends
          <Badge v-if="friendsStore.friends.length" variant="secondary" class="ml-2">
            {{ friendsStore.friends.length }}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="requests">
          Requests
          <Badge v-if="friendsStore.requests.length" variant="destructive" class="ml-2">
            {{ friendsStore.requests.length }}
          </Badge>
        </TabsTrigger>
        <TabsTrigger value="search">Search</TabsTrigger>
      </TabsList>

      <TabsContent value="friends" class="mt-6">
        <div v-if="friendsStore.loading && !friendsStore.friends.length" class="flex justify-center py-10">
          <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else-if="friendsStore.friends.length === 0" class="text-center py-10 border rounded-lg bg-muted/20">
          <p class="text-muted-foreground">You don't have any friends yet.</p>
        </div>
        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="friendship in friendsStore.friends" :key="friendship.id">
            <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-2">
              <div class="space-y-1">
                <CardTitle class="text-lg">{{ friendship.friend_profile.username }}</CardTitle>
                <CardDescription>{{ friendship.friend_profile.email }}</CardDescription>
              </div>
              <Button variant="ghost" size="icon" @click="removeFriend(friendship.id)" class="text-destructive hover:text-destructive hover:bg-destructive/10">
                <UserX class="h-4 h-4" />
              </Button>
            </CardHeader>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="requests" class="mt-6">
        <div v-if="friendsStore.loading && !friendsStore.requests.length" class="flex justify-center py-10">
          <Loader2 class="w-8 h-8 animate-spin text-muted-foreground" />
        </div>
        <div v-else-if="friendsStore.requests.length === 0" class="text-center py-10 border rounded-lg bg-muted/20">
          <p class="text-muted-foreground">No pending friend requests.</p>
        </div>
        <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="request in friendsStore.requests" :key="request.id">
            <CardHeader>
              <CardTitle class="text-lg">{{ request.friend_profile.username }}</CardTitle>
              <CardDescription>{{ request.friend_profile.email }}</CardDescription>
            </CardHeader>
            <CardContent class="flex gap-2">
              <Button class="flex-1" @click="acceptRequest(request.id)">
                <UserCheck class="w-4 h-4 mr-2" />
                Accept
              </Button>
              <Button variant="outline" class="flex-1" @click="rejectRequest(request.id)">
                <UserX class="w-4 h-4 mr-2" />
                Reject
              </Button>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      <TabsContent value="search" class="mt-6 space-y-6">
        <div class="flex gap-2 max-w-md">
          <Input 
            v-model="searchQuery" 
            placeholder="Search by email..." 
            @keyup.enter="handleSearch"
          />
          <Button @click="handleSearch" :disabled="friendsStore.loading">
            <Search v-if="!friendsStore.loading" class="w-4 h-4 mr-2" />
            <Loader2 v-else class="w-4 h-4 mr-2 animate-spin" />
            Search
          </Button>
        </div>

        <div v-if="friendsStore.searchResults.length > 0" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card v-for="user in friendsStore.searchResults" :key="user.id">
            <CardHeader>
              <CardTitle class="text-lg">{{ user.username }}</CardTitle>
              <CardDescription>{{ user.email }}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button v-if="user.inviteStatus === 'NONE'" variant="secondary" class="w-full" @click="sendRequest(user.id)">
                <UserPlus class="w-4 h-4 mr-2" />
                Add Friend
              </Button>
              <div v-else-if="user.inviteStatus === 'ACCEPTED'" class="w-full flex items-center">
                <UserCheck class="w-4 h-4 mr-2"/>
                Already a friend
              </div>
              <div v-else class="w-full flex items-center">
                <Clock class="w-4 h-4 mr-2"/>
                Pending invite
              </div>
            </CardContent>
          </Card>
        </div>
        <div v-else-if="!friendsStore.loading && searchQuery" class="text-center py-10">
           <p class="text-muted-foreground">No users found for "{{ searchQuery }}"</p>
        </div>
      </TabsContent>
    </Tabs>
  </div>
</template>
