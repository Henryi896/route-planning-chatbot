<template>
    <div class="div-component-primary">
        <div ref="main_information_div" class="div-part-of-component">
            <h3>Main Information</h3>
            <p class="txt-info font-bold">From:</p><p ref="dep_text" class="txt-info"></p>
            <p class="txt-info font-bold">To:</p><p ref="dest_text" class="txt-info"></p>
            <p ref="time_text" class="txt-info"></p>
        </div>
        <div ref="Filter_information" class="div-part-of-component hidden">
            <h3>Filters</h3>
            <p ref="filters_text" class="txt-info"></p>
        </div>
        <div ref="Preferences_information" class="div-part-of-component hidden">
            <h3>Preferences</h3>
            <p ref="preferences_text" class="txt-info"></p>
        </div> 
        <div ref="Additional_Requests_information" class="div-part-of-component hidden">
            <h3>Additional Requests</h3>
            <p ref="additional_requests_text" class="txt-info"></p>
        </div>
    </div>
</template>

<script>    
    import * as d3 from 'd3';

    export default{

        mounted(){
        },
        
        methods:{
            changeTo(new_dest){
                d3.select(this.$refs.dest_text)
                    .text(new_dest)
            },

            changeFrom(new_dep){
                d3.select(this.$refs.dep_text)  
                    .text(new_dep)
            },

            changeDateTime(new_date, new_time, new_datetime){
                if (new_datetime != null && new_datetime != "") {
                    new_time = new_datetime.split("T")[1]
                    new_time = (JSON.stringify(new_time).slice(1,6)) //somehow log works but can assign to new_time
                    new_date = new_datetime.split("T")[0]
                    d3.select(this.$refs.time_text)
                        .text(new_date + " " + new_time)
                } else if (new_time != null && new_time != "") {
                    new_time = new_time.split("T")[1]
                    new_time = (JSON.stringify(new_time).slice(1,6)) //somehow log works but can assign to new_time
                    new_date = new_date.split("T")[0]
                    d3.select(this.$refs.time_text)
                        .text(new_date + " " + new_time)
                } else {
                    d3.select(this.$refs.time_text)
                        .text(new_date)
                }
            },

            changeFilters(new_filters){
                d3.select(this.$refs.filters_text)
                    .selectAll("p")
                    .remove()
                d3.select(this.$refs.filters_text)
                    .selectAll("p")
                    .data(new_filters)
                    .enter()
                    .append("p")
                    .text(function(d){
                        return d
                    })
                d3.select(this.$refs.Filter_information)
                    .classed("hidden",() => {
                        if (new_filters.length == 0){
                            return (true)
                        } else {
                            return (false)
                        }
                    })
            },

            changePreferences(new_preferences){
                console.log(new_preferences)
                d3.select(this.$refs.preferences_text)
                    .selectAll("p")
                    .remove()
                d3.select(this.$refs.preferences_text)
                    .selectAll("p")
                    .data(new_preferences)
                    .enter()
                    .append("p")
                    .text(function(d){return d})
                d3.select(this.$refs.Preferences_information)
                    .classed("hidden",() => {
                        console.log(new_preferences.length)
                        if (new_preferences.length == 0){
                            return (true)
                        } else {
                            console.log("hidden false")
                            return (false)
                        }
                    })
            },

            changeAdditionalRequests(new_additional_requests){
                console.log(new_additional_requests)
                d3.select(this.$refs.additional_requests_text)
                    .text(new_additional_requests)
                d3.select(this.$refs.Additional_Requests_information)
                    .classed("hidden",() => {
                        console.log(new_additional_requests.length)
                        if (new_additional_requests.length == 0){
                            return (true)
                        } else {
                            console.log("hidden false")
                            return (false)
                        }
                    })
            }
        },

        computed:{
            from:{
                get(){
                    return this.$store.getters.from;
                }
            },

            to:{
                get(){
                    return this.$store.getters.to;
                }
            },

            date:{
                get(){
                    return this.$store.getters.date
                }
            },

            time:{
                get(){
                    return this.$store.getters.time;
                }
            },

            filters:{
                get(){
                    return this.$store.getters.filters;
                }
            },

            preferences:{
                get(){
                    return this.$store.getters.preferences;
                }
            },

            additional_requests:{
                get(){
                    return this.$store.getters.additional_requests;
                }
            },

            datetime:{
                get(){
                    return this.$store.getters.datetime;
                }
            }
        },

        watch:{
            from:{
                handler(){
                    this.changeFrom(this.from);
                },
                deep: true
            },

            to:{
                handler(){
                    this.changeTo(this.to);
                },
                deep:true
            },

            date:{
                handler(){
                    this.changeDateTime(this.date, this.time, this.datetime);
                },
                deep:true
            },

            time:{
                handler(){
                    this.changeDateTime(this.date, this.time, this.datetime);
                },
                deep:true
            },

            datetime:{
                handler(){
                    this.changeDateTime(this.date, this.time, this.datetime);
                },
                deep:true
            },

            filters:{
                handler(){
                    this.changeFilters(this.filters);
                },
                deep:true
            },

            preferences:{
                handler(){
                    this.changePreferences(this.preferences);
                },
                deep:true
            },

            additional_requests:{
                handler(){
                    this.changeAdditionalRequests(this.additional_requests);
                },
                deep:true
            }
        }
    }
</script>