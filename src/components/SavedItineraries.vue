<template>
    <div class="div-component-primary">
        <div class="div-part-of-component">
            <table ref="SavedItinerariesTable" class="tbl-primary">
                <thead ref="SavedItinerariesTableHead">
                </thead>
                <tbody>
                    <SingleSavedItinerary v-for="x in saved_itineraries_for_list" 
                        v-bind:key="x" 
                        :Identifier="x.Identifier"
                        :changes="x.number_of_changes" 
                        :startTime="x.startTime"
                        :endTime="x.endTime"
                        :duration="x.duration"
                        :time_of_walking="x.time_of_walking"
                        :type_of_transportation="x.type_of_transportation"
                        :type_name_of_transportation="x.type_name_of_transportation"
                        :min_duration="this.min_duration"
                        :max_duration="this.max_duration"
                        :min_number_of_changes="this.min_number_of_changes"
                        :max_number_of_changes="this.max_number_of_changes"
                        :min_time_of_walking="this.min_time_of_walking"
                        :max_time_of_walking="this.max_time_of_walking"
                        />
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>    
    import * as d3 from 'd3';
    import SingleSavedItinerary from "./SingleSavedItinerary.vue";

    var current_scope = this;

    export default{
        components: {
            "SingleSavedItinerary": SingleSavedItinerary
        },

        mounted(){
            this.create_table([],["Identifier","startTime","endTime","duration","number_of_changes","time_of_walking","type_of_transportation"],{"Identifier":"Index","duration":"Duration","startTime":"Start time","endTime":"End time","number_of_changes":"# of changes","time_of_walking":"Time of walking","type_of_transportation":"Vehicle"})  
        },

        data(){
            return{
                saved_itineraries_for_list : []
            }
        },
        
        methods:{
            update_saved_itineraries(){

                var loaded_itineraries = this.saved_itineraries;

                var data_for_table = [];

                for (const x in loaded_itineraries){

                    if(loaded_itineraries[x]){
                        let data = 
                            {
                            "Identifier":(parseInt(x)+10).toString(36).toUpperCase(),
                            "startTime":new Date(loaded_itineraries[x]["startTime"]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                            "endTime":new Date(loaded_itineraries[x]["endTime"]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                            "duration":[this.duration(loaded_itineraries[x]["duration"]),loaded_itineraries[x]["duration"]],  
                            "number_of_changes":this.number_of_changes(loaded_itineraries[x]["legs"]),
                            "time_of_walking":this.time_of_walking(loaded_itineraries[x]["legs"]),
                            "type_of_transportation":this.type_of_transportation(loaded_itineraries[x]["legs"]),
                            "type_name_of_transportation":this.type_name_of_transportation(loaded_itineraries[x]["legs"])
                            }
                        data_for_table = data_for_table.concat(data)
                    }
                }
                console.log(data_for_table)

                this.saved_itineraries_for_list = data_for_table;

                //this.update_table(data_for_table,["Identifier","startTime","endTime","duration","number_of_changes","time_of_walking","type_of_transportation"])
            },

            data_for_table(loaded_itineraries){
                var data_for_table = [];

                for (const x in loaded_itineraries){
                    let data = 
                        {
                        "Identifier":(parseInt(x)+10).toString(36).toUpperCase(),
                        "startTime":new Date(loaded_itineraries[x]["startTime"]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                        "endTime":new Date(loaded_itineraries[x]["endTime"]).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit', hour12: false}),
                        "duration":[this.duration(loaded_itineraries[x]["duration"]),loaded_itineraries[x]["duration"]],  
                        "number_of_changes":this.number_of_changes(loaded_itineraries[x]["legs"]),
                        "time_of_walking":this.time_of_walking(loaded_itineraries[x]["legs"]),
                        "type_of_transportation":this.type_of_transportation(loaded_itineraries[x]["legs"])
                        }
                    data_for_table = data_for_table.concat(data)
                }

                return data_for_table;
            },

            create_table(data, columns, columnnames){ 
                //var table = d3.select(this.$refs.SavedItinerariesTable)

                var thead = d3.select(this.$refs.SavedItinerariesTableHead)
                //var tbody = table.append("tbody")
                //    .attr("ref","tbody_itineraries")


                thead.append("tr")
                    .selectAll("th")
                    .data(columns)
                    .enter()
                    .append("th")
                    .text(function(d) {return(columnnames[d])})

                /*var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr")

                rows.selectAll("td")
                    .data(function(row){
                        return columns.map(function(column){
                            return {column: column, value:row[column]};
                        })
                    })
                    .enter()
                    .append("td")
                    .html(function(d){return d.value})
                    .classed("txt-table", true)*/
            },

            update_table(data, columns){
                current_scope = this;
                d3.selectAll("tbody").remove()

                var table = d3.select(this.$refs.SavedItinerariesTable)
                var tbody = table.append("tbody")
                    .attr("ref","tbody_saved_itineraries")

                var rows = tbody.selectAll("tr")
                    .data(data)
                    .enter()
                    .append("tr")
                    .attr("id", function(d){return "row"+d["Identifier"]} )
                    .on("mouseover", hover_row)
                    .on("mouseout", hover_row_end)

                console.log(rows)

                
                //rows.on("mouseover", console.log("hover"))

                const duration_color = d3.scaleThreshold()
                    .domain([(this.max_duration - this.min_duration) / 3 + this.min_duration + 1,(this.max_duration - this.min_duration) / 3 * 2 + this.min_duration + 1])
                    .range(["bg-green-300", "bg-yellow-300", "bg-red-300"])

                const number_of_changes_color = d3.scaleThreshold()
                    .domain([(this.max_number_of_changes - this.min_number_of_changes) / 3 + this.min_number_of_changes + 0.1,(this.max_number_of_changes - this.min_number_of_changes) / 3 * 2 + this.min_number_of_changes + 0.1])
                    .range(["bg-green-300", "bg-yellow-300", "bg-red-300"])

                const time_of_walking_color = d3.scaleThreshold()
                    .domain([(this.max_time_of_walking - this.min_time_of_walking) / 3 + this.min_time_of_walking + 1,(this.max_time_of_walking - this.min_time_of_walking) / 3 * 2 + this.min_time_of_walking + 1])
                    .range(["bg-green-300", "bg-yellow-300", "bg-red-300"])

                function hover_row(){
                    const scope = this.id;
                    
                    d3.select(this.parentNode)
                        .insert("tr", "#"+scope+" + *")
                        .attr("id", "temptr")
                        .classed("temp-tr", true)

                    d3.select("#"+scope+"-Identifier")
                        .attr("class", "bg-red-400 rounded-full")
                        .text("Delete")

                    current_scope.$store.commit("change_hovered_saved_iti_true", this.id[3])
                }

                function hover_row_end(){
                    d3.select("#temptr")
                        .remove()
                        
                    current_scope.$store.commit("change_hovered_saved_iti_false",this.id[3])
                }

                rows.selectAll("td")
                    .data(function(row){
                        return columns.map(function(column){
                            return {column: column, value:row[column]};
                        })
                    })
                    .enter()
                    .append("td")
                    .html(function(d){
                        if (d.column == "duration" || d.column == "time_of_walking"){
                            return d.value[0]
                        }
                        else{
                            return d.value
                        }
                    })
                    .attr("id", function(d) {
                        return this.parentNode.id + "-" + d.column;
                    })
                    .attr("class", function(d){
                        if (d.column == "duration"){
                            return duration_color(d.value[1])
                        }
                        else if (d.column == "number_of_changes"){
                            return number_of_changes_color(d.value)
                        }
                        else if (d.column == "time_of_walking"){
                            return time_of_walking_color(d.value[1])
                        }
                        else if (d.column == "Identifier"){
                            return "bg-yellow-500 rounded-full"
                        }
                    })
                    .on("click", function(d,x){
                        if (x.column == "Identifier"){
                            current_scope.$store.commit("delete_saved_itineraries", x.value)
                        }
                    })
            },
            
            number_of_changes(legs){
                let number_of_changes = -1;

                for (const y in legs){
                    if (legs[y]["mode"] != "WALK"){
                        number_of_changes += 1;
                    }
                }

                if (number_of_changes == -1){
                    number_of_changes = 0;
                }

                return number_of_changes;
            },

            time_of_walking(legs){
                let duration = 0

                for (const y in legs){
                    if (legs[y]["mode"] == "WALK"){
                        duration += legs[y]["duration"]
                    }
                }

                let date = new Date(duration * 1000)

                return [(date.getUTCHours() + "h " + date.getUTCMinutes() + "m "),duration];
            },

            duration(duration) {
                let date = new Date(duration * 1000)

                return (date.getUTCHours() + "h " + date.getUTCMinutes() + "m ")
            },

            type_of_transportation(legs){
                var type_of_transportation = []

                for (const y in legs){
                    let leg = legs[y]["mode"]
                    leg = " " + leg[0].toUpperCase() + leg.slice(1).toLowerCase()
                    if (!(type_of_transportation.includes(leg))){
                        type_of_transportation.push(leg);
                    }
                }

                return type_of_transportation;
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
        },

        computed:{
            saved_itineraries:{
                get(){
                    return this.$store.getters.saved_itineraries;}
            },

            max_duration(){
                let max = 0;
                for (let x  = 0; x < this.saved_itineraries.length; x++){
                    if (this.saved_itineraries[x]["duration"] > max){
                        max = this.saved_itineraries[x]["duration"];
                    }
                }
                return max;
            },

            min_duration(){
                let min = 1000000000000;
                for (let x  = 0;x < this.saved_itineraries.length; x++){
                    if (this.saved_itineraries[x]["duration"] < min){
                        min = this.saved_itineraries[x]["duration"]
                    }
                }
                return min;
            },

            min_number_of_changes(){
                let min = 1000000000000;
                for (let x  = 0;x < this.saved_itineraries.length; x++){
                    if (this.number_of_changes(this.saved_itineraries[x]["legs"]) < min){
                        min = this.number_of_changes(this.saved_itineraries[x]["legs"])
                    }
                }
                return min;
            },

            max_number_of_changes(){
                let max = 0;
                for(let x  = 0;x < this.saved_itineraries.length; x++){
                    if (this.number_of_changes(this.saved_itineraries[x]["legs"]) > max){
                        max = this.number_of_changes(this.saved_itineraries[x]["legs"])
                    }
                }
                return max;
            },

            min_time_of_walking(){
                let min = 1000000000000;
                for (let x  = 0;x <this.saved_itineraries.length; x++){
                    if (this.time_of_walking(this.saved_itineraries[x]["legs"])[1] < min){
                        min = this.time_of_walking(this.saved_itineraries[x]["legs"])[1]
                    }
                }
                return min;
            },

            max_time_of_walking(){
                let max = 0;
                for (let x  = 0;x <this.saved_itineraries.length; x++){
                    if (this.time_of_walking(this.saved_itineraries[x]["legs"])[1] > max){
                        max = this.time_of_walking(this.saved_itineraries[x]["legs"])[1]
                    }
                }
                return max;
            }

        },

        watch:{
            saved_itineraries:{
                handler: function(){
                    this.update_saved_itineraries();
                },
                deep: true
            }
        }
    }
</script>