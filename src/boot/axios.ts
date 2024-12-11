import { boot } from 'quasar/wrappers'
import axios, { AxiosInstance, AxiosError } from 'axios'
import { useLoginApi } from 'src/composables/login';
import { useQuasar } from 'quasar';
import { App } from '../App';

var project = App().project;
const { logout, getAccessToken, isNotAuth } = useLoginApi();


declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// Be careful when using SSR for cross-request state pollution
// due to creating a Singleton instance here;
// If any client changes this (global) instance, it might be a
// good idea to move this instance creation inside of the
// "export default () => {}" function below (which runs individually
// for each client)

const api = axios.create({
  baseURL: project.value.apiUrl
})

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers['FuPiCo-Security'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Add a response interceptor
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {


    // console.log("Hata ->", error);

    if (error.response) {


      /* switch (error.response.status) {
        case 401:
        case 403:
          isNotAuth();
          break;
        case 404:
        case 405:
          logout();
          break;
        default:
      } */
      return Promise.reject(error);

    }
    // If it's not a 401 error, just reject the promise with the error
    return Promise.reject(error);
  }
);



export default boot(({ app }) => {
  // for use inside Vue files (Options API) through this.$axios and this.$api

  app.config.globalProperties.$axios = axios
  // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
  //       so you won't necessarily have to import axios in each vue file

  app.config.globalProperties.$api = api
  // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
  //       so you can easily perform requests against your app's API
})

export { api }








// import { defineBoot } from '#q-app/wrappers';
// import axios, { type AxiosInstance } from 'axios';

// declare module 'vue' {
//   interface ComponentCustomProperties {
//     $axios: AxiosInstance;
//     $api: AxiosInstance;
//   }
// }

// // Be careful when using SSR for cross-request state pollution
// // due to creating a Singleton instance here;
// // If any client changes this (global) instance, it might be a
// // good idea to move this instance creation inside of the
// // "export default () => {}" function below (which runs individually
// // for each client)
// const api = axios.create({ baseURL: 'https://api.example.com' });

// export default defineBoot(({ app }) => {
//   // for use inside Vue files (Options API) through this.$axios and this.$api

//   app.config.globalProperties.$axios = axios;
//   // ^ ^ ^ this will allow you to use this.$axios (for Vue Options API form)
//   //       so you won't necessarily have to import axios in each vue file

//   app.config.globalProperties.$api = api;
//   // ^ ^ ^ this will allow you to use this.$api (for Vue Options API form)
//   //       so you can easily perform requests against your app's API
// });

// export { api };
