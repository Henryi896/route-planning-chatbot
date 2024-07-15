<template>
    <div class="div-component-primary">
        <p ref="startText">Your proposed routes will show up here after you have initiated a route serach</p>
        <SingleItinerary v-for="x in loaded_itineraries" 
            v-bind:key="x" 
            :identifier="x.identifier"
            :changes="x.number_of_changes" 
            :startTime="x.startTime"
            :endTime="x.endTime"
            :duration="x.duration"
            :time_of_walking="x.time_of_walking"
            :type_of_transportation="x.type_of_transportation"
            :hover="x.hover"
            />
    </div>
</template>

<script>

//import file from "./exp_answer.json";
import SingleItinerary from "./SingleItinerary.vue";
import * as d3 from 'd3';
var loaded_itineraries = [];

//import * as d3 from 'd3';

export default {

    mounted() {
    },

    data() {
        return {
            loaded_itineraries : this.data_for_List([])//file["data"]["plan"]["itineraries"])
        }
    },

    components: {
        "SingleItinerary": SingleItinerary
    },

    methods: {
        new_itineraries() {
            try{
                this.loaded_itineraries = this.data_for_List(this.itineraries["plan"]["itineraries"]);
            } catch {
                this.loaded_itineraries = this.data_for_List([]);
            }
            console.log(loaded_itineraries.length)
        },

        data_for_List(loaded_itineraries) {
            var data_for_List = [];
            console.log(loaded_itineraries.length)
            if (loaded_itineraries.length == 0){
                d3.select(this.$refs.startText)
                    .classed("hidden",false)
                    .text("No itineraries found")
                    .classed("text-red-600 text-xl",true)
            } else {
                d3.select(this.$refs.startText).classed("hidden",true)
            }

            for (let x in loaded_itineraries) {

                let data =
                {
                    "identifier": (parseInt(x)+10).toString(36).toUpperCase(),
                    "startTime": new Date(loaded_itineraries[x]["startTime"]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                    "endTime": new Date(loaded_itineraries[x]["endTime"]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                    "duration": this.duration(loaded_itineraries[x]["duration"]),
                    "number_of_changes": this.number_of_changes(loaded_itineraries[x]["legs"]),
                    "time_of_walking": this.time_of_walking(loaded_itineraries[x]["legs"]),
                    "type_of_transportation": this.type_name_of_transportation(loaded_itineraries[x]["legs"]),
                    "name_of_transportation": this.name_of_transportation(loaded_itineraries[x]["legs"]),
                }
                data_for_List = data_for_List.concat(data)
            }

            return data_for_List;
        },

        number_of_changes(legs) {
            let number_of_changes = -1;

            for (const y in legs) {
                if (legs[y]["mode"] != "WALK") {
                    number_of_changes += 1;
                }
            }

            if (number_of_changes == -1) {
                number_of_changes = "Walking";
            }

            return number_of_changes;
        },

        time_of_walking(legs) {
            let duration = 0

            for (const y in legs) {
                if (legs[y]["mode"] == "WALK") {
                    duration += legs[y]["duration"]
                }
            }

            let date = new Date(duration * 1000)

            return (date.getUTCHours() + "h " + date.getUTCMinutes() + "m ")
        },

        duration(duration) {
            let date = new Date(duration * 1000)

            return (date.getUTCHours() + "h " + date.getUTCMinutes() + "m ")
        },

        type_name_of_transportation(legs) {
            var type_of_transportation = []

            for (const y in legs) {
                let leg = legs[y]["mode"]
                let route = legs[y]["route"]
                let name_of_transportation = []
                if (route != undefined) {
                    name_of_transportation= route["shortName"];
                } else {
                    name_of_transportation=leg[0].toUpperCase() + leg.slice(1).toLowerCase();
                }
                leg = leg[0].toUpperCase() + leg.slice(1).toLowerCase()
                type_of_transportation.push([leg, name_of_transportation]);
            }
            return type_of_transportation;
        },

        name_of_transportation(legs) { 
            var name_of_transportation = []

            for (const y in legs) {
                let leg = legs[y]["route"]
                if (leg != undefined) {
                    name_of_transportation.push(leg["shortName"]);
                } else {
                    name_of_transportation.push(legs[y]["mode"]);
                }
            }
            return name_of_transportation;
        },

    },

    computed: {
        itineraries: {
            get() {
                return this.$store.getters.itineraries;
            }
        }
    },

    watch: {
        itineraries: {
            handler() {
                this.new_itineraries();
            },
            deep: true
        },
    }
}
</script>