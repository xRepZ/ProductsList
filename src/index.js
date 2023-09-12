// import Vue from 'vue'
// import App from './components/app/app.vue';

// new Vue({
//     el: '#root',
//     render: h => h(App)
// });
import { createApp } from 'vue'
import './assets/css/style.css'
import App from './components/app/App.vue'



const app = createApp(App)


app.mount('#app')