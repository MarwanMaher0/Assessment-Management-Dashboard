import { $themeConfig } from '../theme.config';
import { useAppStore } from '@/stores/index';

export default {
    init() {
        const store = useAppStore();

        // set default styles
        let val: any = localStorage.getItem('theme'); 
        val = val || $themeConfig.theme;
        store.toggleTheme(val);

  

        val = localStorage.getItem('i18n_locale'); 

        val = val || $themeConfig.locale;

        const list = store.languageList;
        const item = list.find((item: any) => item.code === val);
        if (item) {
            this.toggleLanguage(item);
        }

        val = localStorage.getItem('rtlClass');
        val = val || $themeConfig.rtlClass;
        store.toggleRTL(val);

    

      
    },

    toggleLanguage(item: any) {
        const store = useAppStore();

        let lang: any = null;
        if (item) {
            lang = item;
        } else {
            let code = store.locale || null;
            if (!code) {
                code = localStorage.getItem('i18n_locale');
            }

            item = store.languageList.find((d: any) => d.code === code);
            if (item) {
                lang = item;
            }
        }

        if (!lang) {
            lang = store.languageList.find((d: any) => d.code === 'en');
        }

        store.toggleLocale(lang.code);
        return lang;
    },

  
};
