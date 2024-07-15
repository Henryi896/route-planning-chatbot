import {Document} from "langchain/document";

/*wheelchair
Boolean
Whether the itinerary must be wheelchair accessible. Default value: false*/

export var query_doc = [new Document({
    pageContent:`date
String
Date of departure or arrival in format YYYY-MM-DD. Default value: current date
time
String
Time of departure or arrival in format hh:mm:ss. Default value: current time
from
InputCoordinates
The geographical location where the itinerary begins. Use either this argument or fromPlace, but not both.
to
InputCoordinates
The geographical location where the itinerary ends. Use either this argument or toPlace, but not both.
fromPlace
String
The place where the itinerary begins in format name::place, where place is either a lat,lon pair (e.g. Pasila::60.199041,24.932928) or a stop id (e.g. Pasila::HSL:1000202). Use either this argument or from, but not both.
toPlace
String
The place where the itinerary ends in format name::place, where place is either a lat,lon pair (e.g. Pasila::60.199041,24.932928) or a stop id (e.g. Pasila::HSL:1000202). Use either this argument or to, but not both.
numItineraries
Int
The maximum number of itineraries to return. Default value: 3.
searchWindow
Long
The length of the search-window in seconds. This parameter is optional.
The search-window is defined as the duration between the earliest-departure-time(EDT) and the latest-departure-time(LDT). OTP will search for all itineraries in this departure window. If arriveBy=true the dateTime parameter is the latest-arrival-time, so OTP will dynamically calculate the EDT. Using a short search-window is faster than using a longer one, but the search duration is not linear. Using a too short search-window will waste resources server side, while using a search-window that is too long will be slow.
OTP will dynamically calculate a reasonable value for the search-window, if not provided. The calculation comes with a significant overhead (10-20% extra). Whether you should use the dynamic calculated value or pass in a value depends on your use-case. For a travel planner in a small geographical area, with a dense network of public transportation, a fixed value between 40 minutes and 2 hours makes sense. To find the appropriate search-window, adjust it so that the number of itineraries on average is around the wanted numItineraries. Make sure you set the numItineraries to a high number while testing. For a country wide area like Norway, using the dynamic search-window is the best.
When paginating, the search-window is calculated using the numItineraries in the original search together with statistics from the search for the last page. This behaviour is configured server side, and can not be overridden from the client.
The search-window used is returned to the response metadata as searchWindowUsed for debugging purposes.
pageCursor
String
Use the cursor to get the next or previous page of results. The next page is a set of itineraries departing after the last itinerary in this result and the previous page is a set of itineraries departing before the first itinerary. This is only usable when public transportation mode(s) are included in the query.
bikeReluctance
Float
A multiplier for how bad biking is, compared to being in transit for equal lengths of time. Default value: 2.0
bikeWalkingReluctance
Float
A multiplier for how bad walking with a bike is, compared to being in transit for equal lengths of time. Default value: 5.0
carReluctance
Float
A multiplier for how bad driving is, compared to being in transit for equal lengths of time. Default value: 3.0
walkReluctance
Float
A multiplier for how bad walking is, compared to being in transit for equal lengths of time. Use also when walking is specified as slow. Empirically, values between 2 and 4 seem to correspond well to the concept of not wanting to walk too much without asking for totally ridiculous itineraries, but this observation should in no way be taken as scientific or definitive. Your mileage may vary. See https://github.com/opentripplanner/OpenTripPlanner/issues/4090 for impact on performance with high values. Default value: 2.0.
waitReluctance
Float
How much worse is waiting for a transit vehicle than being on a transit vehicle, as a multiplier. The default value treats wait and on-vehicle time as the same. It may be tempting to set this higher than walkReluctance (as studies often find this kind of preferences among riders) but the planner will take this literally and walk down a transit line to avoid waiting at a stop. This used to be set less than 1 (0.95) which would make waiting offboard preferable to waiting onboard in an interlined trip. That is also undesirable. If we only tried the shortest possible transfer at each stop to neighboring stop patterns, this problem could disappear. Default value: 1.0.
walkSpeed
Float
Max walk speed along streets, in meters per second. Default value: 1.33
bikeSpeed
Float
Max bike speed along streets, in meters per second. Default value: 5.0
bikeSwitchTime
Int
Time to get on and off your own bike, in seconds. Default value: 0
bikeSwitchCost
Int
Cost of getting on and off your own bike. Unit: seconds. Default value: 0
optimize
OptimizeType
Optimization type for bicycling legs, e.g. prefer flat terrain. Default value: QUICK
triangle
InputTriangle
Triangle optimization parameters for bicycling legs. Only effective when optimize is set to TRIANGLE.
arriveBy
Boolean
Whether the itinerary should depart at the specified time (false), or arrive to the destination at the specified time (true). Default value: false.
preferred
InputPreferred
List of routes and agencies which are given higher preference when planning the itinerary
unpreferred
InputUnpreferred
List of routes and agencies which are given lower preference when planning the itinerary
walkBoardCost
Int
This prevents unnecessary transfers by adding a cost for boarding a vehicle. Unit: seconds. Default value: 600
bikeBoardCost
Int
Separate cost for boarding a vehicle with a bicycle, which is more difficult than on foot. Unit: seconds. Default value: 600
banned
InputBanned
List of routes, trips, agencies and stops which are not used in the itinerary
transferPenalty
Int
An extra penalty added on transfers (i.e. all boardings except the first one). Not to be confused with bikeBoardCost and walkBoardCost, which are the cost of boarding a vehicle with and without a bicycle. The boardCosts are used to model the 'usual' perceived cost of using a transit vehicle, and the transferPenalty is used when a user requests even less transfers. In the latter case, we don't actually optimize for fewest transfers, as this can lead to absurd results. Consider a trip in New York from Grand Army Plaza (the one in Brooklyn) to Kalustyan's at noon. The true lowest transfers route is to wait until midnight, when the 4 train runs local the whole way. The actual fastest route is the 2/3 to the 4/5 at Nevins to the 6 at Union Square, which takes half an hour. Even someone optimizing for fewest transfers doesn't want to wait until midnight. Maybe they would be willing to walk to 7th Ave and take the Q to Union Square, then transfer to the 6. If this takes less than optimize_transfer_penalty seconds, then that's what we'll return. Default value: 0.
transportModes
[TransportMode]
List of transportation modes that the user is willing to use. Default: 'transportModes: [{ mode: WALK},{mode:TRANSIT}]'. Other possibilities are BICYCLE, CAR, WALK, BUS, TRAM, RAIL, SUBWAY and FERRY. When asked for train, return RAIL. Always use the structure {mode: mode} for each mode.
modeWeight
InputModeWeight
The weight multipliers for transit modes. WALK, BICYCLE, CAR, TRANSIT and LEG_SWITCH are not included.
debugItineraryFilter
Boolean
Debug the itinerary-filter-chain. The filters will mark itineraries as deleted, but does NOT delete them when this is enabled.
allowKeepingRentedBicycleAtDestination
Boolean
Whether arriving at the destination with a rented (station) bicycle is allowed without dropping it off. Default: false.
keepingRentedBicycleAtDestinationCost
Int
The cost of arriving at the destination with the rented vehicle, to discourage doing so. Default value: 0.
boardSlack
Int
Invariant: boardSlack + alightSlack <= transferSlack. Default value: 0
alightSlack
Int
Invariant: boardSlack + alightSlack <= transferSlack. Default value: 0
minTransferTime
Int
A global minimum transfer time (in seconds) that specifies the minimum amount of time that must pass between exiting one transit vehicle and boarding another. This time is in addition to time it might take to walk between transit stops. Default value: 0
nonpreferredTransferPenalty
Int
Penalty (in seconds) for using a non-preferred transfer. Default value: 180
maxTransfers
Int
Maximum number of transfers. Number of changes/ Umstiege + 1. E.g. wanting at most 2 Umstiege, set maxTransfers to 3.
startTransitStopId
String
This argument has currently no effect on which itineraries are returned. Use argument fromPlace to start the itinerary from a specific stop. A transit stop that this trip must start from
omitCanceled
=
true
Boolean
When false, return itineraries using canceled trips. Default value: true.
ignoreRealtimeUpdates
Boolean
When true, real-time updates are ignored during this search. Default value: false
locale
String
Two-letter language code (ISO 639-1) used for returned text. Note: only part of the data has translations available and names of stops and POIs are returned in their default language. Due to missing translations, it is sometimes possible that returned text uses a mixture of two languages.
allowedTicketTypes
[String]
List of ticket types that are allowed to be used in itineraries. See ticketTypes query for list of possible ticket types.
allowedVehicleRentalNetworks
[String]
Which vehicle rental networks can be used. By default, all networks are allowed.
bannedVehicleRentalNetworks
[String]
Which vehicle rental networks cannot be used. By default, all networks are allowed.
walkSafetyFactor
Float
Factor for how much the walk safety is considered in routing. Value should be between 0 and 1. If the value is set to be 0, safety is ignored. Default is 1.0.
parking
VehicleParkingInput
Preferences for vehicle parking`,
metadata: {type:"docs"},
})]

export var return_format = `{
                                itineraries {
                                startTime
                                endTime
                                duration
                                    legs {
                                        mode
                                        route{shortName}
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
                            }`