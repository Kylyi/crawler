import { createVaporApp, vaporInteropPlugin } from 'vue'
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'
import { createUtilities } from '@gentl/utilities/vue'

import App from './App.vue'
import router from './router'

// oxlint-disable-next-line typescript/no-explicit-any
const app = createVaporApp(App as unknown as any)

// RouterLink/RouterView are still VDOM; interop is required under createVaporApp.
app.use(vaporInteropPlugin)
app.use(createPinia())
app.use(PiniaColada)
app.use(router)
app.use(
  createUtilities({
    public: {
      useUtc: false,
      transliterate: true,
    },
    translate: (key) => key,
  }) as any,
)

app.mount('#app')
