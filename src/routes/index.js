import { createWebHistory, createRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth"
import Login from '../components/layouts/Login.vue'
import Dashboard from '../components/layouts/Dashboard.vue'

import Home from '../components/pages/Home.vue'
import DaftarBahanAlat from '../components/pages/DaftarAlat.vue'
import DaftarBahanPadat from '../components/pages/DaftarBahanPadat.vue'
import DaftarBahanCair from '../components/pages/DaftarBahanCair.vue'

const routes = [
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/',
        name: 'Dashboard',
        component: Dashboard,
        children: [
            {
                path: '',
                name: 'DaftarBahanAlat',
                component: DaftarBahanAlat,
            },
            {
                path: 'daftar-bahan-padat',
                name: 'DaftarBahanPadat',
                component: DaftarBahanPadat,
            },
            {
                path: 'daftar-bahan-cair',
                name: 'DaftarBahanCair',
                component: DaftarBahanCair,
            },
        ]
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

const getCurrentUser = () => {
    return new Promise((resolve, reject) => {
        const removeListener = onAuthStateChanged(
            getAuth(),
            (user) => {
                removeListener();
                resolve(user);
            },
            reject
        );
    })
}

router.beforeEach( async (to, from, next) => {
    if(to.matched.some((record) => record.meta.requiresAuth)){
        if(await getCurrentUser) {
            next();
        } else {
            next({ name: "Login" })
        }
    }else{
        next();
    }
    
})


export default router;