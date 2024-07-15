import {createStore} from 'vuex';
//import { stringSimilarity } from "string-similarity-js";


//Store setup

const store = createStore({
  state(){
      return{
          stations:[],
          input_from: "",
          from: "",
          from_coor: [48.2080838,16.3715166],
          input_to: "",
          to: "",
          to_coor: [48.2016089,16.369139],
          date: "",
          time: "",
          preferences: [],
          additional_requests: [],
          itineraries: [],
          saved_itineraries: [],
          current_query: "",
          loading: false,
          tutorial_finished: false,
      }
  },

  mutations: {
      add_stations (state, stations){
        state.stations = stations;
      },

      change_departure_location (state, from){
        console.log(from)
        state.input_from = from[0];
        state.from = from[1];
        state.from_coor = from[2];
        

        /*let stations = state.stations['stations'];
        let sim_score = 0;
        let cur_sim_score = 0;
        let best_index = 0;

        for (var i in stations){
          cur_sim_score = stringSimilarity(stations[i].name,input_from);
          if (cur_sim_score > sim_score){
            best_index = i;
            sim_score = cur_sim_score;
          } 
        }
        
        let from = stations[best_index];
        console.log(input_from, sim_score ,from)*/

        //Connection to nominatim API
        /*fetch('https://nominatim.openstreetmap.org/search?q=' + input_from + '&format=json&limit=1')
          .then(response => response.json())
          .then(data => {
            console.log(data)
            let from = data[0];
            console.log(from.display_name)
            state.from = from.display_name;
            let lat_from = from.lat;
            let lon_from = from.lon;
            state.from_coor = [lat_from, lon_from];
            
            console.log(state.from_coor)
          })*/
        
        //state.from = from;
        
        //let lat_from = stations[best_index].lat
        //let lon_from = stations[best_index].lon
        
        //state.from_coor = [lat_from, lon_from];
      },

      change_destination_location (state, to){
        state.input_to = to[0];
        state.to = to[1];
        state.to_coor = to[2];

        //Connection to nominatim API
        /*fetch('https://nominatim.openstreetmap.org/search?q=' + input_to + '&format=json&limit=1')
          .then(response => response.json())
          .then(data => {
            console.log(data)
            let to = data[0];
            state.to = to.display_name;
            let lat_to = to.lat;
            let lon_to = to.lon;
            state.to_coor = [lat_to, lon_to];
          })*/
      },

      change_departure_date (state, date){
        state.date = date;
      },

      change_departure_time (state, time){
        state.time = time;
      },

      change_datetime (state, datetime){
        state.date = datetime;
      },

      change_preferences(state, preferences){ //at the moment prefrence given as single string, maybe as array later on
        /*let possible_preferences = ["walking", "transfers"];
        //for (var i in preferences){
          let current_sim_score = 0;
          let best_sim_score = 0;
          let best_index = 0;
          for (var j in possible_preferences){
            current_sim_score = stringSimilarity(preferences,possible_preferences[j])
            if (current_sim_score > best_sim_score){
              best_sim_score = current_sim_score;
              best_index = j;
            }
          }
          state.preferences.concat([possible_preferences[best_index]])*/
        //}
        state.preferences = preferences;
      },

      delete_preferences(state){
        state.preferences = [];
      },

      add_additional_request (state, additional_requests){
        state.additional_requests = additional_requests;
      },

      change_additional_requests (state, additional_requests){ 
        state.additional_requests = additional_requests;
      },

      change_filters (state, filter){
        state.filter = filter;
      },

      delete_additional_requests (state){
        state.additional_requests = [];
      },

      change_itineraries(state, itineraries){
        if (itineraries["plan"]["itineraries"].length > 0){
          const temp_itineraries = structuredClone(itineraries); //making the object extensible
          /*for (var x = 0; x < temp_itineraries["plan"]["itineraries"].length; x++){
            temp_itineraries["plan"]["itineraries"][x]["hovered"] = false;
          }*/
          state.itineraries = temp_itineraries;
          
        } else {
          state.itineraries = [];
        }
        console.log(state.itineraries)
      },

      change_saved_itineraries(state, itinerary_to_save){
        console.log(itinerary_to_save + " saved")
        itinerary_to_save = itinerary_to_save.charCodeAt("A")-65
        const temp_saved_itinerary = structuredClone(state.itineraries["plan"]["itineraries"][itinerary_to_save]);
        state.saved_itineraries.push(temp_saved_itinerary);
      },

      delete_saved_itineraries(state, itinerary_to_delete){
        console.log(itinerary_to_delete + " deleted")
        itinerary_to_delete = itinerary_to_delete.charCodeAt("A")-65
        state.saved_itineraries.splice(itinerary_to_delete, 1);
      },

      change_hovered_iti_true(state, hov_iti){
        hov_iti = hov_iti.charCodeAt("A")-65
        if (state.itineraries.length != 0){
          state.itineraries["plan"]["itineraries"][hov_iti]["hovered"] = true;
        }
      },

      change_hovered_iti_false(state, hov_iti){
        hov_iti = hov_iti.charCodeAt("A")-65
        state.itineraries["plan"]["itineraries"][hov_iti]["hovered"] = false;
      },

      change_hovered_saved_iti_true(state, hov_iti){
        hov_iti = hov_iti.charCodeAt("A")-65
        state.saved_itineraries[hov_iti]["hovered"] = true;
      },

      change_hovered_saved_iti_false(state, hov_iti){
        hov_iti = hov_iti.charCodeAt("A")-65
        state.saved_itineraries[hov_iti]["hovered"] = false;
      },

      change_original_whole_query(state, query){
        state.current_query = query;
      },

      change_loading(state, loading){
        console.log(".----------------------" + loading + "----------------------.")
        state.loading = loading;
      },

      change_tutorial_finished(state){
        state.tutorial_finished = true;
      }
  },

  getters: {
    stations: (state) => state.stations ,
    input_from: (state) => state.input_from,
    from: (state) => state.from,
    input_to: (state) => state.input_to,
    to: (state) => state.to,
    from_coor: (state) => state.from_coor,
    to_coor: (state) => state.to_coor,
    date: (state) => state.date,
    time: (state) => state.time,
    filters: (state) => state.filter,
    preferences: (state) => state.preferences,
    additional_requests: (state) => state.additional_requests,
    itineraries: (state) => state.itineraries,
    saved_itineraries: (state) => state.saved_itineraries,
    original_whole_query: (state) => state.current_query,
    loading: (state) => state.loading,
    tutorial_finished: (state) => state.tutorial_finished,
    datetime: (state) => state.datetime,
    everything: (state) => {[state.stations, state.from, state.to, state.datetime, state.additional_requests]}

  }
})

export default store;