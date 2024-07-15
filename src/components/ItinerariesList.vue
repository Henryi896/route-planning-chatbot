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
        
        <p ref="textest">No</p>
        <p ref="texttest">Nooo</p>
    </div>
</template>

<script>
    import gql from 'graphql-tag';
    /*import {
        provideApolloClient,
        useQuery,
    } from '@vue/apollo-composable';
    
    import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client/core';*/

    import { provideApolloClient } from '@vue/apollo-composable';
    import { useQuery} from '@vue/apollo-composable';
    //import {useSuspenseQuery} from '@apollo/client';
    import { watchEffect, ref } from 'vue';

    //import OpenAI from 'openai';
    //following this langchain tutorial: https://js.langchain.com/docs/get_started/quickstart
    import {ChatOpenAI, OpenAIEmbeddings} from "@langchain/openai";
    import {ChatPromptTemplate} from "@langchain/core/prompts";
    import {StringOutputParser} from "@langchain/core/output_parsers";
    //import { CheerioWebBaseLoader } from "langchain/document_loaders/web/cheerio";
    import {RecursiveCharacterTextSplitter} from "langchain/text_splitter"
    import {MemoryVectorStore} from "langchain/vectorstores/memory";
    import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
    //import {Document} from "@langchain/core/documents";
    import {createRetrievalChain} from "langchain/chains/retrieval";
    //import {TextLoader} from 'langchain/document_loaders/fs/text';
    import {Document} from 'langchain/document';

    import {createHistoryAwareRetriever } from "langchain/chains/history_aware_retriever";
    import { MessagesPlaceholder } from "@langchain/core/prompts";

    import { result_query } from './query_result3.txt';


    import * as d3 from 'd3';

    /*const httpLink = createHttpLink({
    // You should use an absolute URL here
    uri: 'http://localhost:8080/otp/routers/default/index/graphql',
    })

    // Cache implementation
    const cache = new InMemoryCache()

    // Create the apollo client
    const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
    })

    provideApolloClient(apolloClient);*/
    provideApolloClient();

    export default {
        mounted(){
            
            
            //this.getIti();
            this.init_select();

            d3.select(this.$refs.SeachItiButton).on("mousedown", this.searchIti)
            //d3.select(this.$refs.AutoDepart).on("input", this.get_Auto_List_Depart)
            //d3.select(this.$refs.AutoDest).on("input", this.get_Auto_List_Dest)
        },
        methods:{
            exe_query(query){
                const result = ref('');
                const loading = ref('');
                let error = ref('');
                let stations = [{name:"Hamburg"},{name:"Berlin"}]
                watchEffect(() => {
                    result, loading, error = useQuery(query)
                })
                
                return(result, loading,error,stations)
            },

            init_select(){
                //this.get_Auto_List_Depart();

                const query = gql(`
                    query getroutes{
                    stations{
                        name
                        lat
                        lon
                    }
                    }
                `)
                const {result, loading, error} = useQuery(query)
                watchEffect(() => {
                    if (result.value){

                        let stations=result.value;
                        console.log(stations)
                        this.$store.commit('add_stations', stations);
                    }
                    if (error.value){
                        console.log("Error"+error.value)
                    }
                    d3.select(this.$refs.textest)
                        .text(loading.value)
                })
                let stations = [{name:"Halle"},{name:"Hannover"}]

                d3.select(this.$refs.DepartStationsList)
                    .selectAll('option')
                    .data(stations)
                    .enter()
                    .append('option')
                    .text(function (d) {return d.name})
            },

            get_Auto_List_Depart(){
                //let Auto_Depart_Input = d3.select(this.$refs.AutoDepart).property("value");
                let stations = this.stations;

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
            },

            get_Auto_List_Dest(){
                let Auto_Dest_Input = d3.select(this.$refs.AutoDest).property("value");
                let stations = this.stations;
                let filtered = (stations.filter(x => 
                    x.name.includes(Auto_Dest_Input)))

                d3.select(this.$refs.DestStationsList)
                    .selectAll('option')
                    .remove()
                d3.select(this.$refs.DestStationsList)
                    .selectAll('option')
                    .data(filtered)
                    .enter()
                    .append('option')
                    .text(function (d) {return d.name})
                    .attr("lat", function (d){return d.lat})
                    .attr("lon", function (d){return d.lon})
            },

            get_lat_lon(){

            },

            searchIti(){

                /*let DepartStationsList = d3.select(this.$refs.DepartStationsList)
                let DepartStationsListGroups = DepartStationsList._groups[0][0]
                let DestStationsList = d3.select(this.$refs.DestStationsList)
                let DestStationsListGroups = DestStationsList._groups[0][0]


                let AutoDest = d3.select(this.$refs.AutoDest).property("value")
                //let destButtongroups = destButton._groups[0][0].
                console.log(AutoDest)

                //let deplat, deplon = depButton.options[depButton.selectedIndex].getAttribute("lat")
                const deplat = DepartStationsListGroups.options[0].getAttribute('lat')
                const deplon = DepartStationsListGroups.options[0].getAttribute('lon')
                const destlat = DestStationsListGroups.options[0].getAttribute('lat')
                const destlon = DestStationsListGroups.options[0].getAttribute('lon')

                //const addrequests = d3.select(this.$refs.AddRequest).property("value")

                console.log("lat:",deplat," lon:",deplon)
                console.log("lat:",destlat," lon:", destlon)
                //console.log(depButtongroups.selectedIndex)
                /*const dest = d3.select(this.$refs.DestButton).property("value")
                console.log(dest)*/

                const addrequests = d3.select(this.$refs.AddRequest).property("value")

                //this.getIti(deplat, deplon, destlat, destlon);
                this.query_chat(addrequests);

                //console.log(this.from_coor, this.to_coor)
            },

            //getIti(deplat, deplon, destlat, destlon){
                /*console.log(destlat,destlon)
                const query = gql(`
                {
                plan(        
                    from:{lat: `+deplat+ ` lon: `+deplon+`}
                    to:{lat: `+destlat+ ` lon: `+destlon+`}
                    date: "2024-02-02",
                    time: "11:37",
                    transportModes: [
                    {
                        mode: WALK
                    },
                    {
                        mode: TRANSIT
                    },
                    ]) {
                    itineraries {
                    startTime
                    endTime
                    legs {
                        mode
                        startTime
                        endTime
                        from {
                        name
                        lat
                        lon
                        departureTime
                        arrivalTime
                        }
                        to {
                        name
                        lat
                        lon
                        departureTime
                        arrivalTime
                        }
                        route {
                        gtfsId
                        longName
                        shortName
                        }
                    }
                    }
                }
                }
                `);

                /*const{result, loading, error} = useQuery(query)
                //let stations = [{name:"Hamburg"},{name:"Berlin"}]
                console.log("getiti")
                let stations = ["Hannover"]
                if(error.value ){
                    console.log("Error: "+error)
                }else if(!(loading.value)){
                    watchEffect(() =>{
                    stations = (result.value)
                    })
                } else {
                    console.log("still loading")
                }

                console.log(stations)*/
                //console.log(this.exe_query(query));*/
            //},

            async query_chat(addrequests) {
                console.log("Lets tell a joke")
                const chatModel = new ChatOpenAI({
                    openAIApiKey: "openapiKey",
                });

                /*const prompt = ChatPromptTemplate.fromMessages([
                    ["system", "Give a summary of the provided topic."],
                    ["user", "{input}"]   
                ]);*/

                const outputParser = new StringOutputParser();

                console.log(outputParser)

                //const llmChain = prompt.pipe(chatModel).pipe(outputParser);

                /*let result = await llmChain.invoke({
                    input: "Unicorn",
                });*/
                
                //console.log(llmChain)

                /*const loader = new CheerioWebBaseLoader(
                    "http://localhost:8080/graphiql?query=query%20IntrospectionQuery%20%7B%0A%20%20__schema%20%7B%0A%20%20%20%20queryType%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20mutationType%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20subscriptionType%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20types%20%7B%0A%20%20%20%20%20%20...FullType%0A%20%20%20%20%7D%0A%20%20%20%20directives%20%7B%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20description%0A%20%20%20%20%20%20locations%0A%20%20%20%20%20%20args%20%7B%0A%20%20%20%20%20%20%20%20...InputValue%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D%0A%0Afragment%20FullType%20on%20__Type%20%7B%0A%20%20kind%0A%20%20name%0A%20%20description%0A%20%20fields(includeDeprecated%3A%20true)%20%7B%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20args%20%7B%0A%20%20%20%20%20%20...InputValue%0A%20%20%20%20%7D%0A%20%20%20%20type%20%7B%0A%20%20%20%20%20%20...TypeRef%0A%20%20%20%20%7D%0A%20%20%20%20isDeprecated%0A%20%20%20%20deprecationReason%0A%20%20%7D%0A%20%20inputFields%20%7B%0A%20%20%20%20...InputValue%0A%20%20%7D%0A%20%20interfaces%20%7B%0A%20%20%20%20...TypeRef%0A%20%20%7D%0A%20%20enumValues(includeDeprecated%3A%20true)%20%7B%0A%20%20%20%20name%0A%20%20%20%20description%0A%20%20%20%20isDeprecated%0A%20%20%20%20deprecationReason%0A%20%20%7D%0A%20%20possibleTypes%20%7B%0A%20%20%20%20...TypeRef%0A%20%20%7D%0A%7D%0A%0Afragment%20InputValue%20on%20__InputValue%20%7B%0A%20%20name%0A%20%20description%0A%20%20type%20%7B%0A%20%20%20%20...TypeRef%0A%20%20%7D%0A%20%20defaultValue%0A%7D%0A%0Afragment%20TypeRef%20on%20__Type%20%7B%0A%20%20kind%0A%20%20name%0A%20%20ofType%20%7B%0A%20%20%20%20kind%0A%20%20%20%20name%0A%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20kind%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20ofType%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20kind%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%7D%0A%7D&operationName=IntrospectionQuery"
                );*/

                //const docs = await loader.load();

                
                //const text_loader = new TextLoader('./query_result.txt')
                //const doc = await text_loader.load()
                //console.log(doc) 
                const doc = [new Document({pageContent:result_query})]


                const splitter = new RecursiveCharacterTextSplitter();

                const splitDocs = await splitter.splitDocuments(doc);

                const embeddings = new OpenAIEmbeddings({
                    openAIApiKey: "openapiKey"
                });

                const vectorstore = await MemoryVectorStore.fromDocuments(
                    splitDocs,
                    embeddings
                );

                const retriever = vectorstore.asRetriever();

                /*const prompt = ChatPromptTemplate.fromTemplate(
                    `Write a GraphQL Query based only on the provided example query given the parameter inputs:
                    <context>
                        {context}
                    </context>

                    Parameter: {input}
                    `
                );*/

                //newwww

                const historyAwarePrompt = ChatPromptTemplate.fromMessages([
                    new MessagesPlaceholder("chat_history"),
                    ["user","{input}"],
                    ["system","Given the above conversation generate just a GraphQL query without any surrounding text based on the given example query: {context}"],
                ]);

                const HistoryAwareRetrieverChain = await createHistoryAwareRetriever({
                    llm:chatModel,
                    retriever,
                    rephrasePrompt: historyAwarePrompt,
                });

                await HistoryAwareRetrieverChain.invoke({
                    input:"hi"
                });
                //until here

                const documentChain = await createStuffDocumentsChain({
                    llm: chatModel,
                    prompt: historyAwarePrompt,
                })

                
                const retrievalChain = await createRetrievalChain({
                    combineDocsChain: documentChain,
                    retriever: HistoryAwareRetrieverChain,
                })


                const results = await retrievalChain.invoke({
                    input: "from lat: "+this.from_coor[0]+"  lon: "+this.from_coor[1]+" to lat: "+this.to_coor[0]+"  lon: "+this.to_coor[1]+" on the 2nd of February 2024 at 12 am\n" + "Additional user request: " + addrequests,
                });
                console.log(results);
                console.log(results["answer"]);

                this.exe_chat_query(results["answer"]);
                
                //console.log(iti_result)
            },

            async exe_chat_query(gen_query){
                try{
                    let query = gql(gen_query)
                    //console.log("query")
                    //console.log(query)
                    //let iti_result = this.exe_query(query)
                    //let result_query_iti = 0;
                    const {result, loading, error} = useQuery(query)
                    console.log(result,loading,error)
                    
                    watchEffect(() => {
                        console.log("load: "+loading.value)
                        console.log(result.value)
                        if(result){
                            if (result.value){
                                (console.log("got a result"))

                                const loaded_itineraries = result.value["plan"]["itineraries"]
                                console.log(loaded_itineraries)
                                
                                d3.select(this.$refs.FoundItineraries)
                                    .selectAll('div')
                                    .data(loaded_itineraries)
                                    .enter()
                                    .append('div')
                                    //.append('p')
                                    //.value('hey')

                            }}
                        if (error.value){
                            console.log("Error"+error.value)
                        }
                        d3.select(this.$refs.textest)
                            .text(loading.value)
                    })
                } catch(error){
                    console.log(error);
                }
            }
        },

        computed:{
            stations:{
                get(){
                    return this.$store.getters.stations;
                }
            },

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
        },

        watch:{
            from:{
                handler(){
                },
                deep: true
            },

            to:{
                handler(){

                },
                deep:true
            }
        }

    }
</script>   