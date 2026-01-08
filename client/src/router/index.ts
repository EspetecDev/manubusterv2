import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import AboutView from '@/views/AboutView.vue';
import LoginView from '@/views/LoginView.vue';
import { supabase } from '@/lib/supabase';
import RegisterView from '@/views/RegisterView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/', name: 'home', component: HomeView
        },
        {
            path: '/about', name: 'about', component: AboutView
        },
        {
            path: '/login', name: 'login', component: LoginView, meta: { hideNavbar: true}
        },
        {
            path: '/register', name: 'register', component: RegisterView, meta: { hideNavbar: true}
        },
    ]
});

router.beforeEach(async (to, from, next) => { 
    
    const {data} = await supabase.auth.getSession();
    const isLoggedOn = !!data.session;

    console.log(`Navigating to: ${next.name} | Logged in: ${isLoggedOn}`);
    console.log('session: ', data.session?.user);
    if (isLoggedOn && to.name === 'login') {
        return next({path: '/'});
    }

    if (!isLoggedOn && to.name != 'login' && to.name != 'register') {
        return next({path:'/login'});
    }

    next();
})

export default router;