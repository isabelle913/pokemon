// import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance } from 'axios'

declare module '@vue/runtime-core' {
   interface ComponentCustomProperties {
      $axios: AxiosInstance
   }
}

// https://pokeapi.co/docs/v2
const api = axios.create({ baseURL: 'https://pokeapi.co/api/v2/' })

export { api }
