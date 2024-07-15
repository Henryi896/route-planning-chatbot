module.exports = {
    client: {
        service: {
            name: 'itinerary-chatbot',
            url: 'http://localhost:8080/otp/routers/default/index/graphql'
        },
        includes:[
            'src/**/*.vue',
            'src/**/*.js'
        ]
    }
}