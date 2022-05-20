import { createApp } from 'vue'
import Router from './routes'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { createPinia } from 'pinia'

/*Bootstrap*/
import "bootstrap/dist/css/bootstrap.min.css" 
import "bootstrap/dist/js/bootstrap.min.js"
import "bootstrap/dist/js/bootstrap.bundle.min.js"

/*Sweet Alert 2*/
import 'sweetalert2/dist/sweetalert2.min.css'

/*Global style*/
import "../src/assets/css/global.css"

const app = createApp(App);
app.use(Router)
app.use(VueAxios, axios)
app.use(createPinia())
app.mount("#app");


