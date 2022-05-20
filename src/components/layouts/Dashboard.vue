<template>
  <nav class="navbar sticky-top navbar-expand-lg navbar-dark bg-dark">
    <div class="container">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarTogglerDemo01"
        aria-controls="navbarTogglerDemo01"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarTogglerDemo01">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item">
            <router-link to="/" class="nav-link" exact-active-class="active">Alat</router-link>
          </li>
          <li class="nav-item">
            <router-link to="/daftar-bahan-padat" class="nav-link" exact-active-class="active">Bahan Padat</router-link>
          </li>
          <li>
            <router-link to="/daftar-bahan-cair" class="nav-link" exact-active-class="active">Bahan Cair</router-link>
          </li>
        </ul>
        <button class="btn btn-danger" @click="handleSignOut" v-if="isLogin">Log out</button>
        <a class="btn btn-danger" href="/login" v-else>Log in</a>
      </div>
    </div>
  </nav>

  <div class="container">
    <div class="main-wrapper">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import { useRouter } from "vue-router";

const router = useRouter();
const isLogin = ref(false);
let auth;

onMounted(() => {
  auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if(user) {
      isLogin.value = true;
    } else {
      isLogin.value = false;
    }
  })
});

const handleSignOut = () => {
  signOut(auth).then(() => {
    router.push({ name: '/' })
  });
}

</script>