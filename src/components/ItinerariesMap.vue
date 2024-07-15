<template>
    <div ref="mapButtonDiv" class="basis-1/5 flex justify-end">
        <button ref="expandMapButton" type="button" class="btn-primary h-8 w-8 px-1 py-0">
            <svg ref="svgExpand" class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m5 15 7-7 7 7"/>
            </svg>
            <svg ref="svgCollapse" class="w-6 h-6 text-white hidden" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 9-7 7-7-7"/>
            </svg>
        </button>
        <div ref="mapDiv" class="div-component-primary overflow-hidden flex-grow-1 flex-shrink w-1/3 h-full">
            <div id="map" ref="map" class="div-part-of-component top-0 bottom-0 h-full"></div>
        </div>
    </div>
</template>

<script >

import * as d3 from 'd3';
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import "leaflet-control-geocoder/dist/Control.Geocoder.css";
import "leaflet-control-geocoder/dist/Control.Geocoder.js";



var map;
var currentLayer = new L.LayerGroup();
var layerControl;
var osm;
var map_expanded = false;

export default {
    name: 'NewMod',
    props: {
    msg: String
    },

    

    mounted(){
        this.init_map();

        d3.select(this.$refs.expandMapButton)
            .on("click", this.map_expand)
    },

    methods:{
        new_itineraries(){
            var loaded_itineraries = this.saved_itineraries
            /*try{
                loaded_itineraries = loaded_itineraries["plan"]["itineraries"]
            } catch {
                loaded_itineraries = []
            }*/

            var data_for_map = [];

            for (const x in loaded_itineraries){

                let data = 
                    {
                    "Identifier":x,
                    "startTime":new Date(loaded_itineraries[x]["startTime"]).toLocaleTimeString(),
                    "endTime":new Date(loaded_itineraries[x]["endTime"]).toLocaleTimeString(),
                    "duration":new Date(loaded_itineraries[x]["duration"] * 1000).toISOString().slice(11, 19),
                    "number_of_changes":this.number_of_changes(loaded_itineraries[x]["legs"]),
                    "time_of_walking":this.time_of_walking(loaded_itineraries[x]["legs"]),
                    "type_of_transportation":this.type_of_transportation(loaded_itineraries[x]["legs"]),
                    "leg_coords":[this.leg_coords2(loaded_itineraries[x]["legs"])],
                    "hover":loaded_itineraries[x]["hovered"]
                    }
                data_for_map = data_for_map.concat(data)
            }
            this.update_map(data_for_map)
            
        },
        
        init_map(){
            osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 30,
                minZoom: 2,
                attribution: '© OpenStreetMap'
            })

            
            map = L.map('map',{layers:[osm]}).setView([48.21, 16.37], 13);

            layerControl = L.control.layers({
                "OpenStreetMap":osm
            }).addTo(map);

            //Add leaflet control geocoder https://github.com/perliedman/leaflet-control-geocoder
            var geocoder = L.Control.geocoder({
                defaultMarkGeocode: true,
                query: "Berlin Stephansdom",
                geocoder: new L.Control.Geocoder.nominatim({
                    geocodingQueryParams: {
                        "countrycodes": "de"
                    }
                })
            })


            geocoder.on('markgeocode', function(e) {
                var latlng = e.geocode.center;
                L.marker(latlng).addTo(map);
                
            })
            geocoder.addTo(map);
            
            geocoder.setQuery("Wien Stephansdom");
            //map.addControl( new L.Control.Search({layer: layerControl}) );
        },

        map_expand(){
            if (map_expanded){
                map_expanded = false;
                d3.select(this.$refs.mapDiv)
                    .classed("w-1/3", true)
                d3.select(this.$refs.mapButtonDiv)
                    .classed("basis-1/5", true)
                    .classed("basis-2/5 flex-col",false)
                d3.select(this.$refs.svgExpand)
                    .classed("hidden", false)
                d3.select(this.$refs.svgCollapse)
                    .classed("hidden", true)
            } else {
                map_expanded = true;
                d3.select(this.$refs.mapDiv)
                    .classed("w-1/3", false)
                d3.select(this.$refs.mapButtonDiv)
                    .classed("basis-1/5", false)
                    .classed("basis-2/5 flex-col",true)
                d3.select(this.$refs.svgExpand)
                    .classed("hidden", true)
                d3.select(this.$refs.svgCollapse)
                    .classed("hidden", false)
            }
            map.invalidateSize()
        },

        update_map(data){
            console.log(this.from_coor,this.to_coor)
            map.fitBounds([[this.from_coor[0],this.from_coor[1]],[this.to_coor[0],this.to_coor[1]]])

            var mode_dict = {
                "WALK":"blue",
                "BUS":"red",
                "TRAM":"green",
                "RAIL":"purple",
                "SUBWAY":"orange",
                "FERRY":"yellow",
                "CAR":"black",
                "BICYCLE":"grey"
            }

            currentLayer.clearLayers();
            layerControl.removeLayer(currentLayer);
            currentLayer = new L.LayerGroup();
            var any_hover = false;
            for (const y in data){
                if (data[y]["hover"]){
                    any_hover = true;
                    continue;
                }
            }
            for (const x in data){
                var legs = data[x]["leg_coords"][0];
                
                var weight = 3;
                if (any_hover){
                    weight = 0;
                }
                if (data[x]["hover"]){
                    weight = 5;
                }

                for (const y in legs){
                    var mode = legs[y][1]
                    var latlngs = legs[y][0]

                    new L.Polyline(latlngs,{color: mode_dict[mode],  weight: weight}).addTo(currentLayer);
                }
                

                /*var polyUtil = require('polyline-encoded');

                var encoded = "ecp_IattpAGxDC@?LKDGDGB?DsANoD^K@MAK@G@KB}@Jk@FIBE?E@GBgBPe@FK@K@m@F}@JcBNw@HYB?VAVGn@In@E\\ETETCNCHIZKb@Qp@?BIRADCJCJEHGPGLGNINKRMTMLMLR|BCBQROPA@QXS\\OZOXWj@Uf@Ob@Qf@IVKd@K`@ADETERCH?DGVADG`@AHALCPAHALG|@Ch@C\\A^C\\?\\AV@\\?X?`@@h@Bd@Br@Fx@@X@LBTDLs@`@m@^g@ZEBa@VED]e@iAr@[Ra@T?@iAr@Ar@"
                console.log(polyUtil.decode(encoded))*/
            }
            currentLayer.addTo(map);
            layerControl.addOverlay(currentLayer,"itineraries")
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
        },

        leg_coords(legs){
            var leg_coords = []
            
            leg_coords.push([legs[0]["from"]["lat"],legs[0]["from"]["lon"]])

            for (const y in legs){
                leg_coords.push([legs[y]["to"]["lat"],legs[y]["to"]["lon"]])
            }
            
            return [leg_coords];
        },

        leg_coords2(legs){
            var leg_coords = [];

            for (const y in legs){
                var encoded = legs[y]["legGeometry"]["points"]
                var decoded = require('polyline-encoded').decode(encoded)

                var mode = legs[y]["mode"]

                leg_coords.push([decoded,mode])
            }
            return leg_coords;
        }
        
    },

    computed:{
        itineraries:{
            get(){
                return this.$store.getters.itineraries;
            }
        },

        from_coor:{
            get(){
                return this.$store.getters.from_coor;
            }
        },

        to_coor:{
            get(){
                return this.$store.getters.to_coor;
            }
        },

        saved_itineraries:{
            get(){
                return this.$store.getters.saved_itineraries;
            }
        }
    },

    watch:{
        saved_itineraries:{
                handler(){
                    this.new_itineraries();
                },
                deep: true
            },
    }
}
</script> 