<template>
    <div ref="overlayDiv">
        <div class="w-full h-full flex items-center">
            <div ref="overlayInformationDiv" class="w-1/5 h-full flex justify-center items-center opacity-90 bg-slate-100">
                <div ref="overlayInformationText" class="w-1/2 bg-slate-200 border-gray-600 border-2 hidden">
                    <p>Here you can find information considered by the chatbots for the current shown routes.</p>
                </div>
            </div>
            <div ref="overlayItinerariesDiv" class="h-full w-1/2 flex justify-center items-center">
                <div ref="overlayItinerariesText" class="w-1/2 bg-slate-200 border-gray-600 border-2">
                    <p class="text-center">Here you can find the chatbot and the proposed routes. Simply start asking me something after this short tutorial.</p>
                </div>
            </div>
            <div ref="overlaySavedItinerariesDiv" class="h-full w-1/3 flex justify-center items-center opacity-90 bg-slate-100">
                <div ref="overlaySavedItinerariesText" class="w-1/2 bg-slate-200 border-gray-600 border-2 hidden">
                    <p>Here you can find your saved routes.</p>
                </div>
            </div>
        </div>
    </div>
  </template>
  
  <script>

  import * as d3 from 'd3';

  var tutorial_step = 0;

  export default {
    name: 'TutorialOnStart',
    props: {
      msg: String
    },

    mounted(){
        //setTimeout(() => {this.close_overlay()}, 200);

        d3.select(this.$refs.overlayDiv).on("click", () => {
            this.continue_tutorial();
        });
    },

    methods:{
        close_overlay(){
            d3.select(this.$refs.overlayDiv).style("display", "none");
        },

        continue_tutorial(){
            tutorial_step += 1;
            if (tutorial_step == 1){
                d3.select(this.$refs.overlayInformationDiv).classed("opacity-90 bg-slate-100",false);
                d3.select(this.$refs.overlayInformationText).classed("hidden",false);
                d3.select(this.$refs.overlayItinerariesDiv).classed("opacity-90 bg-slate-100",true);
                d3.select(this.$refs.overlayItinerariesText).classed("hidden",true);
            }
            else if (tutorial_step == 2){
                d3.select(this.$refs.overlaySavedItinerariesDiv).classed("opacity-90 bg-slate-100",false);
                d3.select(this.$refs.overlaySavedItinerariesText).classed("hidden",false);
                d3.select(this.$refs.overlayInformationDiv).classed("opacity-90 bg-slate-100",true);
                d3.select(this.$refs.overlayInformationText).classed("hidden",true);
            }
            else if (tutorial_step == 3){
                this.close_overlay();
                this.$store.commit('change_tutorial_finished');
            }

        }
    }
  }
  </script>
  
  <style scoped>
  </style>
  