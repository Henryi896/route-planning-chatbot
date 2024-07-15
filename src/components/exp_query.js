export var query = `{
    plan(
        from: { lat: dep_lat, lon: dep_lon }
        to: { lat: dest_lat, lon: dest_lon }
        date: "date_placeholder",
        time: "time_placeholder",
        transferPenalty: 0,
        walkReluctance:1
    ) {
        itineraries {
          startTime
          endTime
          duration
            legs {
                mode
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
                duration
                startTime
                endTime
                mode
                legGeometry{
                    points
                }
                generalizedCost
            }
        }
    }
  }`