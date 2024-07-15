<template>
  <link rel="stylesheet" type="text/css" href="./styles/main.css">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
  <div>
    <LoadingOverlay class="fixed flex items-center content-center w-full h-full"/>
  </div>
  <div>
    <TutorialOnStart class="fixed flex items-center content-center w-full h-full bg-opacity-10 bg-black z-[1001]"/>
  </div>
  <div class="w-auto h-auto flex">
    <div class="bg-gray-50 w-1/5 div-content-box">
      <h2>Information</h2>
      <ContextInformation/>
    </div>
    <div class="w-1/2 div-content-box h-screen flex flex-col">
      <h2 class="h-10">Chatbot and Routes</h2>
      <NewMod class="h-1/5 hidden"/>
      <ItinerariesDBN class="flex-grow-0 flex-shrink basis-auto"/>
      <div class="flex-grow flex-shrink basis-auto"></div>
      <ChatInput class="flex-grow-0 flex-shrink basis-10"/>
    </div>
    <div class="bg-gray-50 w-1/3 div-content-box flex flex-col">
      <h2>Saved Routes</h2>  
      <SavedItineraries class="flex-grow flex-shrink basis-auto"/>
      <ItinerariesMap class = ""/>
    </div>
  </div>  
</template>



<script>
  //<NewMod class="h-1/5"/>

  //import gql from 'graphql-tag';
  //import gql from '@apollo/client';

  //import HelloWorld from './components/HelloWorld.vue';
  //import EnterDetails from './components/EnterDetails.vue';
  //import ItinerariesList from './components/ItinerariesList.vue';
  import NewMod from './components/NewMod.vue';
  import ItinerariesMap from './components/ItinerariesMap.vue';
  import ChatInput from './components/ChatInput.vue';
  import ContextInformation from './components/ContextInformation.vue';
  import SavedItineraries from './components/SavedItineraries.vue';
  import ItinerariesDBN from './components/ItinerariesDBN.vue';
  import LoadingOverlay from './components/LoadingOverlay.vue';
  import TutorialOnStart from './components/TutorialOnStart.vue';
  //import { useQuery} from '@vue/apollo-composable';
  //import { watchEffect } from 'vue';
  //import file from "./components/exp_answer.json";

  export default {
    name: 'App',
    
    components: {
      //EnterDetails,
      //ItinerariesList,
      NewMod,
      ChatInput,
      ContextInformation,
      SavedItineraries,
      ItinerariesMap,
      ItinerariesDBN,
      LoadingOverlay,
      TutorialOnStart,
    },

    mounted(){
      //this.$store.commit("change_itineraries", file["data"])
    },

    methods:{
      
    },

    computed: {
      stations: {
        get(){
          return this.$store.state.stations;
        },
      },

      itineraries: {
        get(){
          return this.$store.getters.itineraries;
        },
      }
    }
      
  }


  /*const ALL_TRIPS_QUERY = gql`
    query {
      allroutes {
        routes {
          shortName
          longName
        }
      }
    }
  `;

  const {result} = useQuery(ALL_TRIPS_QUERY);
  //const routes = useResult(result, [], result.allroutes);
  const routes = computed(()=> result.value?.allroutes ?? [])

  watchEffect(() => {
    console.log(routes); 
  })*/

  //provideApolloClient(ApolloClients)

  
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
