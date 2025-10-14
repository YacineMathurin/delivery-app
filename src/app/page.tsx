"use client";
import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Car,
  Truck,
  Bike,
  Clock,
  DollarSign,
  Route,
  Target,
  Zap,
  ArrowLeft,
} from "lucide-react";

const TransportationApp = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("car");
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const directionsServiceRef = useRef(null);
  const directionsRendererRef = useRef(null);

  const vehicleTypes = [
    {
      id: "car",
      name: "Standard Car",
      icon: Car,
      price: "$0.75/km",
      capacity: "4 passengers",
      color: "bg-blue-500",
    },
    {
      id: "suv",
      name: "SUV",
      icon: Truck,
      price: "$1.20/km",
      capacity: "7 passengers",
      color: "bg-green-500",
    },
    {
      id: "luxury",
      name: "Luxury Car",
      icon: Car,
      price: "$2.50/km",
      capacity: "4 passengers",
      color: "bg-purple-500",
    },
    {
      id: "bike",
      name: "Motorcycle",
      icon: Bike,
      price: "$0.35/km",
      capacity: "2 passengers",
      color: "bg-orange-500",
    },
  ];

  const selectedVehicleData = vehicleTypes.find(
    (v) => v.id === selectedVehicle
  );

  // Initialize Google Maps
  useEffect(() => {
    if (!showMap) return;

    const initMap = () => {
      const map = new window.google.maps.Map(mapRef.current, {
        center: { lat: 48.8566, lng: 2.3522 }, // Paris center
        zoom: 12,
        styles: [
          {
            featureType: "all",
            elementType: "geometry.fill",
            stylers: [{ color: "#f8fafc" }],
          },
          {
            featureType: "water",
            elementType: "geometry.fill",
            stylers: [{ color: "#3b82f6" }],
          },
        ],
      });

      mapInstanceRef.current = map;
      directionsServiceRef.current = new window.google.maps.DirectionsService();
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer(
        {
          suppressMarkers: false,
          polylineOptions: {
            strokeColor:
              selectedVehicleData?.color.replace("bg-", "#") || "#3b82f6",
            strokeWeight: 5,
            strokeOpacity: 0.8,
          },
        }
      );
      directionsRendererRef.current.setMap(map);

      // If we have route info, calculate and display the route
      if (origin && destination) {
        calculateRouteOnMap();
      }
    };

    // Check if Google Maps is loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Load Google Maps script (Note: In a real app, you'd add your API key)
      const script = document.createElement("script");
      script.src =
        "https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places";
      script.onload = initMap;
      document.head.appendChild(script);
    }
  }, [showMap, selectedVehicleData]);

  const calculateRouteOnMap = async () => {
    if (!origin || !destination || !directionsServiceRef.current) return;

    const request = {
      origin: origin,
      destination: destination,
      travelMode: window.google.maps.TravelMode.DRIVING,
    };

    directionsServiceRef.current.route(request, (result, status) => {
      if (status === "OK") {
        directionsRendererRef.current.setDirections(result);

        const route = result.routes[0];
        const leg = route.legs[0];

        setRouteInfo({
          distance: leg.distance.text,
          duration: leg.duration.text,
          distanceValue: leg.distance.value / 1000, // Convert to km
        });
      } else {
        console.error("Directions request failed due to " + status);
      }
    });
  };

  const handleFindRoute = async () => {
    if (!origin || !destination) return;

    setIsLoading(true);

    // Simulate route calculation
    setTimeout(() => {
      setIsLoading(false);
      setShowMap(true);
    }, 1500);
  };

  const handleBackToPlanning = () => {
    setShowMap(false);
    setRouteInfo(null);
  };

  const calculatePrice = () => {
    if (!routeInfo || !selectedVehicleData) return 0;
    const pricePerKm = parseFloat(
      selectedVehicleData.price.replace("$", "").replace("/km", "")
    );
    return (routeInfo.distanceValue * pricePerKm).toFixed(2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Navigation className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">RouteGo</h1>
                <p className="text-sm text-gray-600">
                  Smart Transportation Planning
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              <Zap className="h-4 w-4 mr-1" />
              Live Routes
            </Badge>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!showMap ? (
          /* Trip Planning View */
          <div className="max-w-md mx-auto">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center space-x-2 justify-center">
                  <Route className="h-5 w-5 text-blue-600" />
                  <span>Plan Your Route</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="origin"
                    className="flex items-center space-x-2"
                  >
                    <MapPin className="h-4 w-4 text-green-600" />
                    <span>From</span>
                  </Label>
                  <Input
                    id="origin"
                    placeholder="Enter pickup location"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="pl-4 py-3 text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="destination"
                    className="flex items-center space-x-2"
                  >
                    <Target className="h-4 w-4 text-red-600" />
                    <span>To</span>
                  </Label>
                  <Input
                    id="destination"
                    placeholder="Enter destination"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="pl-4 py-3 text-lg"
                  />
                </div>

                <Button
                  onClick={handleFindRoute}
                  disabled={!origin || !destination || isLoading}
                  className="w-full bg-blue-600 hover:bg-blue-700 py-3 text-lg"
                >
                  {isLoading ? "Finding Route..." : "Find Route"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Map View */
          <div className="flex flex-col h-[calc(100vh-200px)]">
            {/* Top Bar - Destination and Back Button */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm mb-4">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToPlanning}
                    className="flex items-center space-x-2 hover:bg-gray-100"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    <span>Back</span>
                  </Button>

                  <div className="flex-1 flex items-center space-x-3">
                    <Target className="h-5 w-5 text-red-600" />
                    <Input
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Enter destination"
                      className="flex-1"
                    />
                  </div>

                  {routeInfo && (
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{routeInfo.duration}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Route className="h-4 w-4 text-green-600" />
                        <span>{routeInfo.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span>${calculatePrice()}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm flex-1 mb-4">
              <CardContent className="p-0 h-full">
                <div
                  ref={mapRef}
                  className="w-full h-full rounded-lg"
                  style={{ minHeight: "400px" }}
                >
                  {/* Fallback content */}
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">Loading Google Maps...</p>
                      <p className="text-sm text-gray-500 mt-2">
                        Route: {origin} → {destination}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bottom Bar - Vehicle Selection */}
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Car className="h-5 w-5 text-blue-600" />
                  <span className="font-medium">Choose Vehicle</span>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {vehicleTypes.map((vehicle) => {
                    const IconComponent = vehicle.icon;
                    return (
                      <div
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle.id)}
                        className={`p-3 rounded-lg border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                          selectedVehicle === vehicle.id
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div
                            className={`p-2 rounded-lg ${vehicle.color} text-white`}
                          >
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="text-center">
                            <h3 className="font-semibold text-sm text-gray-900">
                              {vehicle.name}
                            </h3>
                            <div className="text-xs text-gray-600">
                              <div>{vehicle.capacity}</div>
                              <div className="font-medium text-green-600">
                                {vehicle.price}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {routeInfo && (
                  <div className="mt-4 pt-4 border-t">
                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      Book {selectedVehicleData?.name} - ${calculatePrice()}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransportationApp;
