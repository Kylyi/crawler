import { createVaporApp, vaporInteropPlugin } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

import App from './App.vue'
import router from './router'

// oxlint-disable-next-line typescript/no-explicit-any
const app = createVaporApp(App as unknown as any)

// RouterLink/RouterView are still VDOM; interop is required under createVaporApp.
app.use(vaporInteropPlugin)
app.use(createPinia())
app.use(PiniaColada)
app.use(router)

app.mount('#app')
