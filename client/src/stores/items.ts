import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "@/lib/supabase";
import { enums } from '@/lib/consts';

export interface Item {
    id: string;
    owner_id: string;
    name: string;
    type: string;
    status: string;
    lent_to: string | null;
    created_at?: string;
    // Joined data
    lent_to_profile?: {
        id: string;
        username: string;
        email: string;
    } | null;
}

export const useItemsStore = defineStore('items', () => {
    const items = ref<Item[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    async function _getUserId() {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user.id) throw new Error("User not logged in.");
        return session.user.id;
    }

    async function fetchItems() {
        loading.value = true;
        error.value = null;
        try {
            const userId = await _getUserId();
            const { data, error: queryError } = await supabase
                .from('items')
                .select('*, lent_to_profile:profiles!items_lent_to_fkey(id, username, email)')
                .eq('owner_id', userId)
                .order('created_at', { ascending: false });

            if (queryError) throw queryError;
            items.value = data || [];
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function addItem(name: string, type: string) {
        loading.value = true;
        error.value = null;
        try {
            const userId = await _getUserId();
            const { data, error: insertError } = await supabase
                .from('items')
                .insert({
                    owner_id: userId,
                    name,
                    type,
                    status: enums.DB_ENUM_STATUS_AVAILABLE
                })
                .select()
                .single();

            if (insertError) throw insertError;
            if (data) items.value.unshift(data);
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function updateItem(id: string, updates: Partial<Item>) {
        loading.value = true;
        error.value = null;
        try {
            const { error: updateError } = await supabase
                .from('items')
                .update(updates)
                .eq('id', id);

            if (updateError) throw updateError;
            await fetchItems();
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function deleteItem(id: string) {
        loading.value = true;
        error.value = null;
        try {
            const { error: deleteError } = await supabase
                .from('items')
                .delete()
                .eq('id', id);

            if (deleteError) throw deleteError;
            items.value = items.value.filter(i => i.id !== id);
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function lendItem(itemId: string, friendId: string) {
        loading.value = true;
        error.value = null;
        try {
            const { error: updateError } = await supabase
                .from('items')
                .update({
                    status: enums.DB_ENUM_STATUS_LENT,
                    lent_to: friendId
                })
                .eq('id', itemId);

            if (updateError) throw updateError;
            await fetchItems();
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    async function returnItem(itemId: string) {
        loading.value = true;
        error.value = null;
        try {
            const { error: updateError } = await supabase
                .from('items')
                .update({
                    status: enums.DB_ENUM_STATUS_AVAILABLE,
                    lent_to: null
                })
                .eq('id', itemId);

            if (updateError) throw updateError;
            await fetchItems();
        } catch (e: any) {
            error.value = e.message;
        } finally {
            loading.value = false;
        }
    }

    return {
        items,
        loading,
        error,
        fetchItems,
        addItem,
        updateItem,
        deleteItem,
        lendItem,
        returnItem
    };
});
