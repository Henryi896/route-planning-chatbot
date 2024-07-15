<template>
    <div class="div-component-primary">
        <div class="div-part-of-component">
            <table ref="ItinerariesTable" class="tbl-primary">        
            </table>
        </div>
    </div>
</template>

<script>

//import file from "./exp_answer.json";

import * as d3 from 'd3';

export default {
    name: 'NewMod',
    props: {
    msg: String
    },

    mounted(){
        const loaded_itineraries = []//file["data"]["plan"]["itineraries"]
        console.log(loaded_itineraries)

        var data_for_table = [];

        for (const x in loaded_itineraries){

            let data = 
                {
                "Identifier":x,
                "startTime":new Date(loaded_itineraries[x]["startTime"]).toLocaleTimeString(),
                "endTime":new Date(loaded_itineraries[x]["endTime"]).toLocaleTimeString(),
                "duration":new Date(loaded_itineraries[x]["duration"] * 1000).toISOString().slice(11, 19),
                "number_of_changes":this.number_of_changes(loaded_itineraries[x]["legs"]),
                "time_of_walking":this.time_of_walking(loaded_itineraries[x]["legs"]),
                "type_of_transportation":this.type_of_transportation(loaded_itineraries[x]["legs"])
                }
            data_for_table = data_for_table.concat(data)
        }

        //this.create_table(data_for_table,["Identifier","duration","startTime","endTime","number_of_changes","time_of_walking","type_of_transportation"])
        this.create_table(data_for_table,["Identifier","duration","startTime","endTime","number_of_changes","time_of_walking","type_of_transportation"],{"Identifier":"Identifier","duration":"Duration","startTime":"Start time","endTime":"End time","number_of_changes":"# of changes","time_of_walking":"Time of walking","type_of_transportation":"Transportation type"})

    },

    methods:{
        new_itineraries(){
            var loaded_itineraries = this.itineraries
            try{
                loaded_itineraries = loaded_itineraries["plan"]["itineraries"]
            } catch {
                loaded_itineraries = []
            }

            var data_for_table = [];

            for (const x in loaded_itineraries){

                let data = 
                    {
                    "Identifier":x,
                    "startTime":new Date(loaded_itineraries[x]["startTime"]).toLocaleTimeString(),
                    "endTime":new Date(loaded_itineraries[x]["endTime"]).toLocaleTimeString(),
                    "duration":new Date(loaded_itineraries[x]["duration"] * 1000).toISOString().slice(11, 19),
                    "number_of_changes":this.number_of_changes(loaded_itineraries[x]["legs"]),
                    "time_of_walking":this.time_of_walking(loaded_itineraries[x]["legs"]),
                    "type_of_transportation":this.type_of_transportation(loaded_itineraries[x]["legs"])
                    }
                data_for_table = data_for_table.concat(data)
            }

            this.update_table(data_for_table,["Identifier","duration","startTime","endTime","number_of_changes","time_of_walking","type_of_transportation"])
        },
        // inspired by http://www.d3noob.org/2013/02/add-html-table-to-your-d3js-graph.html
        create_table(data, columns, columnnames){ 
            var table = d3.select(this.$refs.ItinerariesTable)

            var thead = table.append("thead")
            var tbody = table.append("tbody")
                .attr("ref","tbody_itineraries")


            thead.append("tr")
                .selectAll("th")
                .data(columns)
                .enter()
                .append("th")
                .text(function(d) {return(columnnames[d])})

            var rows = tbody.selectAll("tr")
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
                .classed("txt-table", true)
        },

        update_table(data, columns){
            d3.select(this.$refs.tbody_itineraries).remove()

            var table = d3.select(this.$refs.ItinerariesTable)
            var tbody = table.append("tbody")
                .attr("ref","tbody_itineraries")

            var rows = tbody.selectAll("tr")
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
        },

        number_of_changes(legs){
            let number_of_changes = -1;

            for (const y in legs){
                if (legs[y]["mode"] != "WALK"){
                    number_of_changes += 1;
                }
            }

            if (number_of_changes == -1){
                number_of_changes = "Walking";
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

            return new Date(duration * 1000).toISOString().slice(11, 19);
        },

        type_of_transportation(legs){
            var type_of_transportation = []

            for (const y in legs){
                if (!(type_of_transportation.includes(legs[y]["mode"]))){
                    type_of_transportation.push(legs[y]["mode"]);
                }
            }

            return type_of_transportation;
        }
    },

    computed:{
        itineraries:{
            get(){
                return this.$store.getters.itineraries;
            }
        }
    },

    watch:{
        itineraries:{
                handler(){
                    this.new_itineraries();
                },
                deep: true
            },
    }
}
</script>
  
 