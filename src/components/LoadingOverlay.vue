<template>
    <div ref="overlayDiv" class="w-full h-full flex items-center content-center bg-slate-100 opacity-90 justify-center z-[9999]">
        <div ref="whiteBoxDiv" class="flex items-center justify-center bg-gray-200 opacity-100 px-10 py-5 z-[10000]">
            <p ref="loadingText" class ="flex-grow flex-shrink"></p>
        </div>
    </div>
  </template>
  
  <script>

  import * as d3 from 'd3';

  export default {
    name: 'TutorialOnStart',
    props: {
      msg: String
    },

    mounted(){
        this.change_overlay();
    },

    methods:{
        change_overlay(){
            console.log(this.loading)
            if (this.loading == false){
                d3.select(this.$refs.overlayDiv)
                    .style("visibility", "hidden")
                d3.select(this.$refs.loadingText)
                    .text(this.loading)
            } else {
                d3.select(this.$refs.overlayDiv)
                    .style("visibility", "visible")
                d3.select(this.$refs.loadingText)
                    .text(this.loading)
            }
        }
    },

    computed:{
        loading:{
            get(){
                return this.$store.getters.loading;
            }
        }
    },

    watch:{
        loading:{
            handler(){
                this.change_overlay();
            }
        }
    }
  }
  </script>
  
  <style scoped>
  </style>
  