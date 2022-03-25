import { createApp } from 'vue'

import BalmUI from 'balm-ui';
import BalmUIPlus from 'balm-ui-plus';

import './styles/index.scss';

import App from './App'
import store from './store'
import router from './router'

// svg图标
import 'virtual:svg-icons-register'
import SvgIcon from '@/components/SvgIcon'

const app = createApp(App)

app.use(router)
app.use(store)
app.use(SvgIcon)
app.use(BalmUI)
app.use(BalmUIPlus)

app.mount('#app')
