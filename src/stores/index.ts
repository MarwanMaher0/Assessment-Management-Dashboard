import { defineStore } from 'pinia';
import i18n from '@/i18n';
import appSetting from '@/app-setting';

export const useAppStore = defineStore('app', {
    state: () => ({
        isDarkMode: false,
        mainLayout: 'app',
        theme: 'light',
        menu: 'vertical',
        rtlClass: 'ltr',
        locale: 'en',
        sidebar: false,
        languageList: [
           
            { code: 'en', name: 'English' },
            { code: 'ae', name: 'Arabic' },
        ],
        isShowMainLoader: true,
    }),

    actions: {
        setMainLayout(payload: any = null) {
            this.mainLayout = payload; //app , auth
        },
        toggleTheme(payload: any = null) {
            payload = payload || this.theme; // light|dark
            localStorage.setItem('theme', payload);
            this.theme = payload;
            if (payload == 'light') {
                this.isDarkMode = false;
            } else if (payload == 'dark') {
                this.isDarkMode = true;
            }

            if (this.isDarkMode) {
                document.querySelector('body')?.classList.add('dark');
            } else {
                document.querySelector('body')?.classList.remove('dark');
            }
        },
        toggleMenu(payload: any = null) {
            payload = payload || this.menu; // vertical, collapsible-vertical, horizontal
            this.sidebar = false; // reset sidebar state
            localStorage.setItem('menu', payload);
            this.menu = payload;
        },
      
        toggleRTL(payload: any = null) {
            payload = payload || this.rtlClass; // rtl, ltr
            localStorage.setItem('rtlClass', payload);
            this.rtlClass = payload;
            document.querySelector('html')?.setAttribute('dir', this.rtlClass || 'ltr');
        },
     
      
        toggleLocale(payload: any = null) {
            payload = payload || this.locale;
            i18n.global.locale.value = payload;
            localStorage.setItem('i18n_locale', payload);
            this.locale = payload;
            if(this.locale?.toLowerCase() === 'ae') {
                this.toggleRTL('rtl');
            } else {
                this.toggleRTL('ltr');
            }
        },
        toggleSidebar(state: boolean = false) {
            this.sidebar = !this.sidebar;
        },
        toggleMainLoader(state: boolean = false) {
            this.isShowMainLoader = true;
            setTimeout(() => {
                this.isShowMainLoader = false;
            }, 500);

        },
        MainLoader(state: boolean = false) {
            this.isShowMainLoader = state;
        }
    },
    getters: {},
});
