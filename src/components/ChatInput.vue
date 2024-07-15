<template>
    <div class="div-component-primary">
        <div class="div-part-of-component">
            <div ref="InputTextBubble" class="speech-bubble-right hidden">
                <p ref="InputText" class="txt-primary text-left"></p>
            </div>
            <div class="speech-bubble-left">
                <p ref="ChatAnswer" class="txt-primary text-left">Please enter your routing request</p>
            </div>
        </div>
        <div class="div-part-of-component flex">
            <input type="text" ref="Chatinput" class="input-primary flex-grow my-0" placeholder="Type here">
            <button type="button" ref="SendChatButton" class="btn-primary mx-1 my-auto py-1 h-10">
                <svg class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7.556 8.5h8m-8 3.5H12m7.111-7H4.89a.896.896 0 0 0-.629.256.868.868 0 0 0-.26.619v9.25c0 .232.094.455.26.619A.896.896 0 0 0 4.89 16H9l3 4 3-4h4.111a.896.896 0 0 0 .629-.256.868.868 0 0 0 .26-.619v-9.25a.868.868 0 0 0-.26-.619.896.896 0 0 0-.63-.256Z"/>
                </svg>
            </button>
            <button type="button" ref="SpeechToTextButton" class = "btn-primary mx-1 my-auto py-1 h-10">
                <svg ref="SpeechToTextButtonSvg" class="w-6 h-6 text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9v3a5.006 5.006 0 0 1-5 5h-4a5.006 5.006 0 0 1-5-5V9m7 9v3m-3 0h6M11 3h2a3 3 0 0 1 3 3v5a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3V6a3 3 0 0 1 3-3Z"/>
                </svg>
            </button>
            <button type="button" ref="ClearChatButton" class="btn-primary mx-1 my-auto py-1 h-10">
                <p>clear history</p>
            </button>
        </div>
    </div>
</template>

<script>

import * as d3 from 'd3'; 

const ANTHROPIC_API_KEY = process.env.VUE_APP_ANTHROPIC_API_KEY
console.log(ANTHROPIC_API_KEY)

import { query_doc, return_format } from './query_doc.js';
console.log(query_doc, return_format)

import {getCoordinatesSchema, createGraphQLQuerySchema, executeGraphQLQuerySchema, toolHandler, changeInformationSchema} from './tools.js';

import Anthropic from '@anthropic-ai/sdk';


let messages = [];

export function getMessages(){
    console.log(messages)
    //messages.pop();
    return structuredClone(messages);
}

let currentScope = this;

export default {
    mounted() {
        d3.select(this.$refs.SendChatButton).on("mousedown", this.SendChat);
        //Also send chat on Enter
        var self = this;
        var tempfunc = function () { self.SendChat(); };
        d3.select(this.$refs.Chatinput).on("keydown", function (e) {
            if (e.code === "Enter") {
                tempfunc.call();
            }
        })

        d3.select(this.$refs.ClearChatButton).on("mousedown", this.ClearChat);
        d3.select(this.$refs.SpeechToTextButton).on("mousedown", this.SpeechToText);
        d3.select(this.$refs.Download).on("mousedown", function(){
            var text = JSON.stringify(messages);
            var textFile = self.makeTextFile(text);
            var downloadLink = document.createElement('a');
            downloadLink.setAttribute('download', 'messages.json');
            downloadLink.href = textFile;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    },

    methods: { 
        selectInputField(){
            d3.select(this.$refs.Chatinput).node().focus();
        },

        SendChat() {
            let chatInput = d3.select(this.$refs.Chatinput).property("value")
            d3.select(this.$refs.Chatinput).property("value", "")
            if (chatInput.length != 0) {
                d3.select(this.$refs.InputText).text(chatInput)
                d3.select(this.$refs.InputTextBubble).classed("hidden", false)
                this.$store.commit("change_loading","Understanding your input") 
                this.chatinputdetect(chatInput);
            }
        },

        ClearChat() {
            messages = [];
            d3.select(this.$refs.ChatAnswer).text("Please enter your routing request")
            d3.select(this.$refs.InputTextBubble).classed("hidden",true)
        },

        SpeechToText() {
            currentScope = this;
            const SpeechRecognition =
                window.SpeechRecognition || window.webkitSpeechRecognition;
            /*const SpeechGrammarList =
                window.SpeechGrammarList || window.webkitSpeechGrammarList;
            const SpeechRecognitionEvent =
                window.SpeechRecognitionEvent || window.webkitSpeechRecognitionEvent;*/
            
            const recognition = new SpeechRecognition();
            recognition.lang = 'en-US';
            recognition.interimResults = false;
            d3.select(this.$refs.SpeechToTextButtonSvg).classed("animate-pulse",true)
            recognition.onstart = function () {
                console.log('Voice recognition started. Try speaking into the microphone.')
            };

            recognition.onresult = function (event) {
                let speechInput = event.results[0][0].transcript;
                console.log(speechInput)
                console.log(typeof(speechInput))
                if (speechInput.length != 0) {
                    d3.select(currentScope.$refs.InputText).text(speechInput)
                    d3.select(currentScope.$refs.InputTextBubble).classed("hidden", false)
                    //this.$store.commit("change_loading","Understanding your input") 
                    currentScope.chatinputdetect(speechInput);
                }
            };

            recognition.onend = function () {
                d3.select(currentScope.$refs.SpeechToTextButtonSvg).classed("animate-pulse",false)
                console.log('Voice recognition ended.');
            };

            recognition.start();
        },

        async chatinputdetect(input){ //inspired by https://github.com/leonvanzyl/claude-3-node-tool-use/blob/master/index.js

                const anthropic = new Anthropic({apiKey: ""})

            const date = new Date().toLocaleDateString();
            const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });

            console.log(date,time)
            
            const createAPIMessage = async (messages) => {
                console.log(messages)
                const response = await anthropic.messages.create({
                    temperature: 0.0,
                    model: "claude-3-haiku-20240307",
                    max_tokens: 1024,
                    messages,
                    system: `The user will provide a request to find a route between two locations. Your task is to: 
                    1. Fully interpret the user's request, including any specified preferences for mode of transportation, date/time, number of itineraries, etc. Make sure to capture all user requirements and preferences before proceeding. 
                    2. Use the available tools to look up the necessary information, such as coordinates for the locations. The current date and time are ${date} and ${time}, respectively. Please use these values unless another value is provided by the user for the respective value. Also if the user does not specify a year. Use the year given to you in the last sentence.
                    3. It is critical that you carefully compare the location names returned by the getCoordinates tool to the names provided in the user's request. If there is any mismatch, you must immediately ask the user for clarification if the tools returns are correct before generating the GraphQL query.
                    4. Generate a GraphQL query with the given tool to find the best route options based on the user's request. 
                    5. Always execute the GraphQL query and return the results. Improve it in case of any errors. Never haluciate function results, rather ask the user for more information.
                    6. If the return of a GraphQL query contained filters, was successfull and did not return any results, try the query again without the filters. If you get a return afterwards, clearly tell the user you have gotten rid of the filters.
                    6. Keep the user up to date on what you have interpreted from their input and what preferences and filters have been applied to the query by utilizing the changeInformationSchema tool as soon as the query was successful. Try to include all of the input you were able to understand into either preferences or filters. 
                    7. Importantly, if you are unable to fulfill any part of the user's request (e.g. no flight options available, unable to find location coordinates, etc.), clearly communicate this to the user. Do not make assumptions, but rather inform the user about what you were able to accomplish and what you could not. The goal is to provide the user with the most complete response possible, while also being transparent about the limitations of what you were able to do. The user should never be left wondering if their full request was addressed.
                    Always answer in the language of the input.
                    Do not include the date and/or time field in the query if the user did not provide it. 
                    It is critical that you follow the above instructions. 
                    Always ask the user for more information when needed and never make assumptions. 
                    The user is also shown the last results of the GraphQL query on a separate view, so you do not have to explain any of the routes, still give a short answer as content if the request was fulfilled or not.
                    Do not include any tool use information in your text response. Your text output is directly displayed to the user.`,
                    //The documentation of the GraphQL API is the following: ` + JSON.stringify(query_doc) + "Here is the return format I would like to get: " + JSON.stringify(return_format),
                    tools: [getCoordinatesSchema, createGraphQLQuerySchema, executeGraphQLQuerySchema, changeInformationSchema],
                })

                return response
            }

            const processConversation = async (message) => {
                messages.push({ role: "user", content: message});
                console.log(messages)
                let response = await createAPIMessage(messages);
                messages.push({ role: "assistant", content: response.content });

                while(response.stop_reason === "tool_use") {
                    console.log("Tool use")
                    const toolMessages = {
                        role: "user",
                        content: [],
                    };

                    for (let i = 0; i < response.content.length; i++) {
                        const contentType = response.content[i].type;
                        const toolName = response.content[i].name || "";
                        const toolInput = response.content[i].input || null;
                        const toolId = response.content[i].id || "";

                        if (contentType === "text") {
                            continue;
                        }

                        if (contentType === "tool_use") {
                            const toolResult = await toolHandler(toolName, toolInput);
                            console.log(toolResult)
                            toolMessages.content.push({
                                type: "tool_result",
                                tool_use_id: toolId,
                                content: JSON.stringify(toolResult),
                            });
                        }
                    }

                    messages.push(toolMessages);
                    response = await createAPIMessage(messages);
                    messages.push({ role: "assistant", content: response.content });
                }   
                this.$store.commit("change_loading",false)
                if(response.content[0].text){
                    return response.content[0].text
                } else {
                    return "No response";
                }
            };

            const response = await processConversation(input);
            console.log(response)
            if (response == "No response"){
                console.log(history.length)
                console.log(history[history.lenght-2])
                console.log(history[history.length-2]["content"][0]["text"])
                d3.select(this.$refs.ChatAnswer).text(history[history.length-2]["content"][0]["text"])
            } else {
                d3.select(this.$refs.ChatAnswer).text(response)
            }
        },

        saveItinerary(itinerary) {
            if (itinerary.length > 1) {
                console.log(itinerary)// maybe return an error
            } else {
                this.$store.commit("change_saved_itineraries", itinerary);
            }

        },

        makeTextFile(text){
            var textFile = null;
            var data = new Blob([text], {type: 'text/plain'});
            if (textFile !== null) {
                window.URL.revokeObjectURL(textFile);
            }
            textFile = window.URL.createObjectURL(data);
            return textFile;
        }
    },

    computed: {
        from: {
            get() {
                return this.$store.getters.from;
            }
        },

        input_to: {
            get() {
                return this.$store.getters.input_from;
            }
        },

        input_from: {
            get() {
                return this.$store.getters.input_from;
            }
        },

        to: {
            get() {
                return this.$store.getters.to;
            }
        },

        date: {
            get() {
                return this.$store.getters.date;
            }
        },

        time: {
            get() {
                return this.$store.getters.time;
            }
        },

        from_coor: {
            get() {
                return this.$store.getters.from_coor;
            }
        },

        to_coor: {
            get() {
                return this.$store.getters.to_coor;
            }
        },

        filters: {
            get() {
                return this.$store.getters.filters;
            }
        },

        preferences: {
            get() {
                return this.$store.getters.preferences;
            }
        },

        additional_requests: {
            get() {
                return this.$store.getters.additional_requests;
            }
        },

        original_whole_query: {
            get() {
                return this.$store.getters.original_whole_query;
            }
        },

        tutorial_finished: {
            get() {
                return this.$store.getters.tutorial_finished;
            }
        },
    },

    watch:{
        tutorial_finished:{
            handler(){
                this.selectInputField();
            },
            deep:true
        }
    }
}
</script>