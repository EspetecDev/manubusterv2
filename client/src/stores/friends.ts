import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { enums } from '@/lib/consts';
import { errorMessages } from "vue/compiler-sfc";

export interface Profile {
    id: string,
    email: string,
    username: string
}

export interface Friendship {
    id: string,
    user_id_1: string,
    user_id_2: string,
    status: string,
    friend_profile: Profile
}

export const useFriendsStore = defineStore('friends', () => {
    const friends = ref<Friendship[]>([]);
    const requests = ref<Friendship[]>([]);
    const searchResults = ref<Profile[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function _getUserId() {
        const { data: {session }} = await supabase.auth.getSession();
        if (!session?.user.id) throw new Error("User not logged in.");
        return session.user.id;
    }

    async function fetchFriends() {
        loading.value = true;
        error.value = null;
        try {
            const userId = await _getUserId();
            const { data: friendshipsData, error: queryError } = await supabase
            .from('friendships')
            .select('id, user_id_1, user_id_2, status')
            .or(`user_id_1.eq(${userId}, user_id_2.eq(${userId}`)
            .eq('status', enums.DB_ENUM_FRIENDSHIP_STATUS_ACCEPTED);

            if (queryError) throw queryError;
            
            if (!friendshipsData || friendshipsData.length === 0) {
                friends.value = [];
                return;
            }

            const friendIds = friendshipsData.map(f => 
                f.user_id_1 === userId ? f.user_id_2 : f.user_id_1
            )

            const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, username, email')
            .in('id', friendIds);

            if (profilesError) throw profilesError;

            const profilesMap = new Map(profilesData?.map(p => [p.id, p]));
            friends.value = friendshipsData.map(f => {
                const friendId = f.user_id_1 === userId ? f.user_id_2 : f.user_id_1;
                return {
                    ...f,
                    friend_profile: profilesMap.get(friendId) as Profile
                }
            })

        } catch(e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function fetchFriendRequests() {
        loading.value = true;
        error.value = null;
        try {
            const userId = await _getUserId();
            const { data, error: queryError } = await supabase
            .from('friendships')
            .select('id, user_id_1, user_id_2, status, friend_profile:profiles!friendships_user_id_1_fkey(id, username, email)')
            .eq('user_id_2', userId)
            .eq('status', enums.DB_ENUM_FRIENDSHIP_STATUS_PENDING);

            if (queryError) throw queryError;
            requests.value = (data || []) as unknown as Friendship[];
        } catch(e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function searchUsers(email: string) {
        loading.value = true;
        error.value = null;
        try {
            const {data, error: queryError} = await supabase
            .from('profiles')
            .select('id, email, username')
            .eq('email', email)
    
            if (queryError) throw  queryError;
            searchResults.value = data || [];
        } catch(e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function sendFriendRequest(friendId: string) {
        loading.value = true;
        error.value = null;
        try{
            const userId = await _getUserId();
            const {error: insertError} = await supabase
            .from('friendships')
            .insert({
                user_id_1: userId, 
                user_id_2: friendId, 
                status: enums.DB_ENUM_FRIENDSHIP_STATUS_PENDING
            });
            if (insertError) throw insertError;
        } catch(e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function acceptFriendRequest(friendshipId: string) {
        loading.value = true;
        error.value = null;
        try {
            const { error: updateError } = await supabase
            .from('friendships')
            .update({'status': enums.DB_ENUM_FRIENDSHIP_STATUS_ACCEPTED})
            .eq('id', friendshipId);

            if (updateError) throw updateError;
            await fetchFriends();
            await fetchFriendRequests();
        } catch(e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function removeOrRejectFriend(friendshipId: string) {
        loading.value = true;
        error.value = null;
        try {
            const { error: deleteError } = await supabase
            .from('friendships')
            .delete()
            .eq('id', friendshipId);
            if (deleteError) throw deleteError;
        } catch(e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    return {
        friends,
        requests,
        searchResults,
        loading,
        error,
        searchUsers,
        fetchFriends,
        fetchFriendRequests,
        sendFriendRequest,
        acceptFriendRequest,
        // The same function can be used to reject or delete any friendship
        rejectFriendRequest: removeOrRejectFriend,
        removeFriend: removeOrRejectFriend,
    }
})