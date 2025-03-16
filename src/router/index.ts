import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAppStore } from '@/stores/index';
import appSetting from '@/app-setting';
import { authService } from '@/services/authService';

import HomeView from '@/views/index.vue';
import UserDetail from '@/views/UserDetail.vue';

const routes: RouteRecordRaw[] = [
    // dashboard
    { path: '/', name: 'home', component: HomeView, meta: { requiresAuth: true } },
    // auth
    { path: '/UserDetail', name: 'UserDetail', component: UserDetail, meta: { requiresAuth: true } },
    {
        path: '/login',
        name: 'login',
        component: () => import( '../views/Login.vue'),
        meta: { layout: 'auth' },
    },
];

const router = createRouter({
    history: createWebHistory(),
    linkExactActiveClass: 'active',
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { left: 0, top: 0 };
        }
    },
});

router.beforeEach((to, from, next) => {
    const store = useAppStore();

    if (to?.meta?.layout == 'auth') {
        store.setMainLayout('auth');
    } else {
        store.setMainLayout('app');
    }

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!authService.isAuthenticated()) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        next();
    }
});



export default router;
