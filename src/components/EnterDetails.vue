<template>
    <div>
        <h1 ref="test">Hallo</h1>
        <div>
            <input type="text" ref="AutoDepart" list="DepartStations">
            <datalist ref="DepartStationsList" id="DepartStations">
                <option>Hello</option>
            </datalist>
        </div>
        <div>
            <input type="text" ref="AutoDest" list="DestStations">
            <datalist ref="DestStationsList" id="DestStations">
                <option>Hello</option>
            </datalist>
        </div>
        <div>
            <button type="button" ref="SeachItiButton">Search Itineraries</button>
        </div>
        <div>
            <label for="AddRequestID">Additional Requests: </label>
            <input type="text" ref="AddRequest" id ="AddRequestID" name="Name">
        </div>
        <div ref="FoundItineraries">
            <div>

            </div>
        </div>
    </div>
</template>

<script>
    import * as d3 from 'd3';

    export default{
        mounted(){
            this.fillSelect();

            d3.select(this.$refs.AutoDepart).on("input",this.changeDepart)
            d3.select(this.$refs.AutoDest).on("input",this.changeDest)
        },

        methods:{
            fillSelect(){
                let stations = (this.stations)
                stations = stations.stations

                if(stations){
                    console.log("yay stations")

                    d3.select(this.$refs.DepartStationsList)
                        .selectAll('option')
                        .remove()

                    d3.select(this.$refs.DepartStationsList)
                        .selectAll('option')
                        .data(stations)
                        .enter()
                        .append('option')
                        .text(function (d) {return d.name})    
                        .attr("lat", function (d){return d.lat})
                        .attr("lon", function (d){return d.lon})
                        .attr("data-cvalue", function (d){return d.lat})
                        .data("custvalue",function (d){return d.lat})

                    d3.select(this.$refs.DestStationsList)
                        .selectAll('option')
                        .remove()

                    d3.select(this.$refs.DestStationsList)
                        .selectAll('option')
                        .data(stations)
                        .enter()
                        .append('option')
                        .text(function (d) {return d.name})
                }
            },

            changeDepart(){
                let new_from = d3.select(this.$refs.AutoDepart).property("value")
                this.$store.commit('change_from', new_from)
            },

            changeDest(){
                let new_to = d3.select(this.$refs.AutoDest).property("value")
                this.$store.commit('change_to', new_to)
            }
        },

        computed:{
            stations:{
                get(){
                    return this.$store.getters.stations;
                }
            }
        },

        watch:{
            stations:{
                handler(){
                    this.fillSelect();
                }
            }
        }
    }
</script>