
import { createApp } from 'vue';


import { createI18n } from 'vue-i18n';

import { createPinia } from 'pinia';

import { createRouter, createWebHashHistory } from 'vue-router';


import App from './App.vue';

import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';

import Toast from 'vue-toastification';
import "./assets/css/Toastification.css";

import { en_us } from './assets/text/en-us';
import { zh_hans } from './assets/text/zh-hans';

let app = createApp(App)
    .use(
        createRouter({
            history: createWebHashHistory(),
            routes: App.routes
        })
    )
    .use(
        createPinia()
    )
    .use(
        createI18n({
            locale: navigator.language,
            fallbackLocale: 'en-us',
            messages: {
                'en-US': en_us,
                'en': en_us,
                'zh-CN': zh_hans
            }
        })
    )
    .use(
        mavonEditor
    )
    .use(
        Toast,
        {
            transition: "Vue-Toastification__fade",
            maxToasts: 1,
            newestOnTop: true,
            position: 'top-center',
            timeout: 3000,
            closeOnClick: true,
            pauseOnFocusLoss: true,
            pauseOnHover: true,
            draggable: true,
            draggablePercent: 0.3,
            showCloseButtonOnHover: false,
            hideProgressBar: false,
            closeButton: "button",
            icon: true,
            rtl: false
        }
    );

app.config.errorHandler = function (err, instance, info) {
    console.error(err);
    console.error(info);
};

app.mount('#app');