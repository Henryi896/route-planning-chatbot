<template>
    <tr ref="singleTableRow">
        <td ref="identifiertd"></td>
        <td ref="startTimetd"></td>
        <td ref="endTimetd"></td>
        <td ref="durationtd"></td>
        <td ref="changestd"></td>
        <td ref="time_of_walkingtd"></td>
        <td ref="type_of_transportationtd"></td>
    </tr>
    <tr ref="mainDiv" class="hidden">
        <td colSpan=7 class="w-full left-0 bg-gray-100 p-2 -bottom-10">
            <div class="div-itinerary-box">
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
            </div>
        </td>
    </tr>
</template>

<script>

//import file from "./exp_answer.json";
import * as d3 from 'd3';

export default {
    mounted() {
        this.init();
        d3.select(this.$refs.singleTableRow)
            .on("mouseover",this.hover)
            .on("mouseout",this.hover_end)
    },

    props: ["Identifier", "changes", "startTime", "endTime", "duration", "time_of_walking", "type_of_transportation","type_name_of_transportation","min_duration","max_duration","min_number_of_changes","max_number_of_changes","min_time_of_walking","max_time_of_walking"],

    methods: {
        init() {

            const duration_color = d3.scaleThreshold()
                .domain([(this.max_duration - this.min_duration) / 3 + this.min_duration + 1,(this.max_duration - this.min_duration) / 3 * 2 + this.min_duration + 1])
                .range(["bg-green-300", "bg-yellow-300", "bg-red-300"])

            console.log(duration_color(2200))

            const number_of_changes_color = d3.scaleThreshold()
                .domain([(this.max_number_of_changes - this.min_number_of_changes) / 3 + this.min_number_of_changes + 0.1,(this.max_number_of_changes - this.min_number_of_changes) / 3 * 2 + this.min_number_of_changes + 0.1])
                .range(["bg-green-300", "bg-yellow-300", "bg-red-300"])

            const time_of_walking_color = d3.scaleThreshold()
                .domain([(this.max_time_of_walking - this.min_time_of_walking) / 3 + this.min_time_of_walking + 1,(this.max_time_of_walking - this.min_time_of_walking) / 3 * 2 + this.min_time_of_walking + 1])
                .range(["bg-green-300", "bg-yellow-300", "bg-red-300"])
                
            d3.select(this.$refs.identifier)
                .append("p")
                .text(this.Identifier)
                .classed("text-center m-auto font-bold", true)

            d3.select(this.$refs.startTime)
                .text(this.startTime)

            d3.select(this.$refs.endTime)
                .text(this.endTime)

            d3.select(this.$refs.duration)
                .append("p")
                .text(this.duration[0])

            d3.select(this.$refs.changes)
                .append("p")
                .text(this.changes)

            d3.select(this.$refs.time_of_walking)
                .append("p")
                .text(this.time_of_walking[0])

            d3.select(this.$refs.type_of_transportation)
                .selectAll("div")
                .data(this.type_name_of_transportation)
                .enter()
                .append("div")
                .classed("div-type-of-transportation flex-auto items-center content-center p-0 text-xs", true)
                .attr("class", function (d){
                    return d3.select(this).attr("class") + " color-" + d[0];
                })
                .append("p")
                .text(function(d){return d[1]})
            
            d3.select(this.$refs.identifiertd)
                .on("click",this.delete)
                .append("p")
                .text(this.Identifier)
                .classed("text-center m-auto font-bold", true)
                

            d3.select(this.$refs.startTimetd)
                .text(this.startTime)

            d3.select(this.$refs.endTimetd)
                .text(this.endTime)

            d3.select(this.$refs.durationtd)
                .classed(duration_color(this.duration[1]),true)
                .text(this.duration[0])

            d3.select(this.$refs.changestd)
                .classed(number_of_changes_color(this.changes),true)
                .text(this.changes)

            d3.select(this.$refs.time_of_walkingtd)
                .classed(time_of_walking_color(this.time_of_walking[1]),true)
                .text(this.time_of_walking[0])

            d3.select(this.$refs.type_of_transportationtd)
                .append("p")
                .text(this.type_of_transportation)
        },

        hover(){
            d3.select(this.$refs.mainDiv)
                .classed("hidden",false)

            d3.select(this.$refs.identifiertd)
                .classed("bg-red-400 rounded-full",true)
                .text("Delete")

            this.$store.commit("change_hovered_saved_iti_true",this.Identifier);
        },

        hover_end(){
            d3.select(this.$refs.mainDiv)
                .classed("hidden",true)

            d3.select(this.$refs.identifiertd)
                .classed("bg-red-400 rounded-full",false)
                .text(this.Identifier)
            
            this.$store.commit("change_hovered_saved_iti_false",this.Identifier);
        },

        delete(){
            console.log(this.Identifier)
            this.$store.commit("delete_saved_itineraries",this.Identifier);
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
                this.init();
            },
            deep: true
        },
    }
}
</script>