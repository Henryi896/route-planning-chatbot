<template>
    <div class="div-itinerary-box" ref="mainDiv">
        <div ref="identifier" class="items-center content-center rounded-full bg-yellow-500 w-10 h-10"></div>
        <div ref="itinerariesList" class="w-full">
            <div class="flex w-full relative mb-3">
                <div ref="startTime" class="w-1/6"></div>
                <div ref="type_of_transportation" class="w-4/6 flex items-center content-center flex-wrap"></div>
                <div ref="endTime" class="w-1/6 object-right"></div>
            </div>
            <div class="flex w-full">
                <div ref="duration" class="w-1/3 flex">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                </div>
                <div ref="changes" class="w-1/3 flex">
                    <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="m16 10 3-3m0 0-3-3m3 3H5v3m3 4-3 3m0 0 3 3m-3-3h14v-3" />
                    </svg>
                </div>
                <div ref="time_of_walking" class="w-1/ flex">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                        id="walk-directions">
                        <path fill="none" d="M0 0h24v24H0V0z"></path>
                        <path
                            d="M13.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM9.8 8.9L7.24 21.81c-.13.61.35 1.19.98 1.19h.08c.47 0 .87-.32.98-.78L10.9 15l2.1 2v5c0 .55.45 1 1 1s1-.45 1-1v-5.64c0-.55-.22-1.07-.62-1.45L12.9 13.5l.6-3c1.07 1.24 2.62 2.13 4.36 2.41.6.09 1.14-.39 1.14-1 0-.49-.36-.9-.85-.98-1.52-.25-2.78-1.15-3.45-2.33l-1-1.6c-.56-.89-1.68-1.25-2.65-.84L7.22 7.78C6.48 8.1 6 8.82 6 9.63V12c0 .55.45 1 1 1s1-.45 1-1V9.6l1.8-.7">
                        </path>
                    </svg>
                </div>
            </div>
        </div>
        <button ref="saveButton" class="btn-primary">
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m17 21-5-4-5 4V3.889a.92.92 0 0 1 .244-.629.808.808 0 0 1 .59-.26h8.333a.81.81 0 0 1 .589.26.92.92 0 0 1 .244.63V21Z"/>
</svg>

        </button>
    </div>
</template>

<script>

//import file from "./exp_answer.json";
import * as d3 from 'd3';

export default {
    mounted() {
        this.init();
        d3.select(this.$refs.mainDiv)
            .on("mouseover",this.hover)
            .on("mouseout",this.hover_end)

        d3.select(this.$refs.saveButton)
            .on("click",this.save)
    },

    props: ["identifier", "changes", "startTime", "endTime", "duration", "time_of_walking", "type_of_transportation"],

    methods: {
        init() {
            d3.select(this.$refs.identifier)
                .append("p")
                .text(this.identifier)
                .classed("text-center m-auto font-bold", true)

            d3.select(this.$refs.startTime)
                .text(this.startTime)

            d3.select(this.$refs.endTime)
                .text(this.endTime)

            d3.select(this.$refs.duration)
                .append("p")
                .text(this.duration)

            d3.select(this.$refs.changes)
                .append("p")
                .text(this.changes)

            d3.select(this.$refs.time_of_walking)
                .append("p")
                .text(this.time_of_walking)

            d3.select(this.$refs.type_of_transportation)
                .selectAll("div")
                .data(this.type_of_transportation)
                .enter()
                .append("div")
                .classed("div-type-of-transportation flex-auto items-center content-center p-0", true)
                .attr("class", function (d){
                    return d3.select(this).attr("class") + " color-" + d[0];
                })
                .append("p")
                .text(function(d){return d[1]})

            /*d3.select(this.$refs.type_of_transportation)
                .selectAll("div")
                .data(this.name_of_transportation)
                .append("p")
                .text(function(d){return d})*/
            
        },

        hover(){
            //this.$store.commit("change_hovered_iti_true",this.identifier)
        },

        hover_end(){
            //this.$store.commit("change_hovered_iti_false",this.identifier)
        },

        save(){
            this.$store.commit("change_saved_itineraries",this.identifier);
        }
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
                console.log("Single iti sees itineraries changingin")
                this.init();
            },
            deep: true
        },
    }
}
</script>