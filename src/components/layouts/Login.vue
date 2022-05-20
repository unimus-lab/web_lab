<template>
  <div class="container">
    <div class="main-wrapper">
      <div class="row">
        <div class="col-12 col-md-4 offset-md-4">
          <div class="text-center mb-5">
            <img
              src="https://i.imgur.com/D9NYwqp.png"
              class="img-fluid"
              style="max-width: 250px"
            />
          </div>
          <form @submit.prevent="LoginFunc">
            <div class="form-floating mb-3">
              <input
                type="email"
                class="form-control"
                id="floatingInput"
                placeholder="name@example.com"
                v-model="userData.email"
                required
              />
              <label for="floatingInput">Email</label>
            </div>
            <div class="form-floating mb-3">
              <input
                type="password"
                class="form-control"
                id="floatingPassword"
                placeholder="Password"
                v-model="userData.password"
                required
              />
              <label for="floatingPassword">Password</label>
            </div>
            <button class="btn btn-success form-control" type="submit">
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { onMounted, reactive, ref, computed, watch } from "vue";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  browserSessionPersistence,
} from "firebase/auth";
import { useRouter } from "vue-router";

const router = useRouter();
const auth = getAuth();
const userData = reactive({
  email: "",
  password: "",
});
const LoginFunc = async () => {
  setPersistence(auth, browserSessionPersistence).then(() => {
    signInWithEmailAndPassword(auth, userData.email, userData.password)
      .then((userCredential) => {
        return router.push({ name: "DaftarBahanAlat" });
      })
      .catch((e) => {
        // Handle Errors here.
        switch (e.code) {
          case "auth/user-not-found":
            alert(
              "User tidak di temukan di database, hubungi admin untuk mendapatkan akses masuk."
            );
            break;
          case "auth/invalid-email":
            alert(
              "Email tidak valid."
            );
            break;
          case "auth/wrong-password":
            alert("Password salah.");
            break;
          default:
            alert("Something went wrong.");
        }

        return;
      });
  });

  // try {
  //   await signInWithEmailAndPassword(auth, userData.email, userData.password).then((userCredential) => {
  //     // Signed in
  //     const user = auth.currentUser;
  //     window.sessionStorage.setItem("userAuth", JSON.stringify(user.email));
  //     router.push({ name : "DaftarBahanAlat" })

  //     // ...
  //   });
  // } catch (e) {
  //   switch (e.code) {
  //     case "auth/user-not-found":
  //       alert("User tidak di temukan di database, hubungi admin untuk mendapatkan akses masuk.");
  //       break;
  //     case "auth/wrong-password":
  //       alert("Password salah.");
  //       break;
  //     default:
  //       alert("Something went wrong.");
  //   }

  //   return;
  // }
};
</script>
