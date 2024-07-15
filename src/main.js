import { createApp, h, provide } from 'vue'
import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';
import { DefaultApolloClient, provideApolloClient } from '@vue/apollo-composable';

import store from './store/store';

import App from './App.vue';
import './styles/main.css';
import 'leaflet/dist/leaflet.css';


//Apollo setup

// HTTP connection to the API
const httpLink = createHttpLink({
  uri: 'http://localhost:8080/otp/routers/default/index/graphql',
})

// Cache implementation
const cache = new InMemoryCache()

// Create the apollo client
const apolloClient = new ApolloClient({
  link: httpLink,
  cache,
})

//App setup
const app = createApp({
  setup() {
    provide(DefaultApolloClient, apolloClient)
    provideApolloClient(apolloClient);
  },

  render: () => h(App)
})

app.use(store);
app.mount('#app');