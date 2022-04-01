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
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '',
                name: 'Home',
                component: Home,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'daftar-bahan-alat',
                name: 'DaftarBahanAlat',
                component: DaftarBahanAlat,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'daftar-bahan-padat',
                name: 'DaftarBahanPadat',
                component: DaftarBahanPadat,
                meta: {
                    requiresAuth: true
                }
            },
            {
                path: 'daftar-bahan-cair',
                name: 'DaftarBahanCair',
                component: DaftarBahanCair,
                meta: {
                    requiresAuth: true
                }
            },
        ]
    },
    
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// const getCurrentUser = () => {
//     return new Promise((resolve, reject) => {
//         const removeListener = onAuthStateChanged(
//             getAuth(),
//             (user) => {
//                 removeListener();
//                 resolve(user);
//             },
//             reject
//         );
//     });
// };

router.beforeEach( async (to, from, next) => {
    if(to.matched.some((record) => record.meta.requiresAuth)){
        if(getAuth().currentUser) {
            next();
        } else {
            next({ name: "Login" })
        }
    }else{
        next();
    }
    
})


export default router;