"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Navigation,
  Car,
  Euro,
  Truck,
  Bike,
  Clock,
  DollarSign,
  Route,
  Target,
  Zap,
  ArrowLeft,
  ChevronUp,
  X,
} from "lucide-react";

const TransportationApp = () => {
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [routeInfo, setRouteInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
    setDrawerOpen(false);
  };

  const calculatePrice = () => {
    if (!routeInfo || !selectedVehicleData) return 0;
    const pricePerKm = parseFloat(
      selectedVehicleData.price.replace("$", "").replace("/km", "")
    );
    return (routeInfo.distanceValue * pricePerKm).toFixed(2);
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {!showMap ? (
        /* Trip Planning View */
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
                    <h1 className="text-2xl font-bold text-gray-900">
                      RouteGo
                    </h1>
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
          </div>
        </div>
      ) : (
        /* Map View - Full Screen */
        <>
          {/* Full Screen Map Background */}
          <div ref={mapRef} className="absolute inset-0 w-full h-full">
            {/* Fallback content */}
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">Loading Google Maps...</p>
                <p className="text-sm text-gray-500 mt-2">
                  Route: {origin} → {destination}
                </p>
              </div>
            </div>
          </div>

          {/* Top Search Bar - Floating */}
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="absolute top-4 left-4 right-4 z-20"
          >
            <Card className="shadow-2xl border-0 bg-white/95 backdrop-blur-md">
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
                    <div className="hidden md:flex items-center space-x-4 text-sm">
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
          </motion.div>

          {/* Bottom Drawer Trigger */}
          <AnimatePresence>
            {!drawerOpen && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20"
              >
                <Button
                  onClick={() => setDrawerOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 shadow-2xl px-6 py-6 rounded-full"
                  size="lg"
                >
                  <Car className="h-5 w-5 mr-2" />
                  Choose Vehicle
                  <ChevronUp className="h-5 w-5 ml-2" />
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom Drawer - Vehicle Selection */}
          <AnimatePresence>
            {drawerOpen && (
              <>
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawerOpen(false)}
                  className="absolute inset-0 bg-black/30 z-30"
                />

                {/* Drawer */}
                <motion.div
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 30, stiffness: 300 }}
                  className="absolute bottom-0 left-0 right-0 z-40 max-h-[80vh]"
                >
                  <Card className="shadow-2xl border-0 bg-white rounded-t-3xl rounded-b-none">
                    <CardContent className="p-6">
                      {/* Drawer Handle */}
                      <div className="flex justify-center mb-4">
                        <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                      </div>

                      {/* Header */}
                      <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                          <Car className="h-6 w-6 text-blue-600" />
                          <h3 className="text-xl font-bold">Choose Vehicle</h3>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDrawerOpen(false)}
                          className="rounded-full"
                        >
                          <X className="h-5 w-5" />
                        </Button>
                      </div>

                      {/* Route Info */}
                      {routeInfo && (
                        <div className="flex items-center justify-around mb-6 p-4 bg-blue-50 rounded-xl">
                          <div className="text-center">
                            <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                            <div className="text-xs text-gray-600">
                              Duration
                            </div>
                            <div className="font-semibold">
                              {routeInfo.duration}
                            </div>
                          </div>
                          <div className="text-center">
                            <Route className="h-5 w-5 text-green-600 mx-auto mb-1" />
                            <div className="text-xs text-gray-600">
                              Distance
                            </div>
                            <div className="font-semibold">
                              {routeInfo.distance}
                            </div>
                          </div>
                          <div className="text-center">
                            <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                            <div className="text-xs text-gray-600">Price</div>
                            <div className="font-semibold">
                              ${calculatePrice()}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Vehicle Grid */}
                      <div className="grid grid-cols-1 gap-4 mb-6 max-h-[40vh] overflow-y-auto">
                        {vehicleTypes.map((vehicle) => {
                          const IconComponent = vehicle.icon;
                          return (
                            <motion.div
                              key={vehicle.id}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setSelectedVehicle(vehicle.id)}
                              className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                                selectedVehicle === vehicle.id
                                  ? "border-blue-500 bg-blue-50 shadow-lg"
                                  : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                              }`}
                            >
                              <div className="flex  items-center space-y-3">
                                <div
                                  className={`p-3 rounded-xl ${vehicle.color} text-white mr-4`}
                                >
                                  <IconComponent className="h-6 w-6" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-gray-900">
                                    {vehicle.name}
                                  </h4>
                                  <div className="text-xs text-gray-600 mt-1">
                                    {vehicle.capacity}
                                  </div>
                                  <div className="font-bold text-green-600 mt-1">
                                    {vehicle.price}
                                  </div>
                                </div>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>

                      {/* Book Button */}
                      {/* {routeInfo && ( */}
                      {selectedVehicleData && (
                        <Button
                          onClick={() => setDrawerOpen(true)}
                          className="w-full bg-yellow-600 hover:bg-blue-700 shadow-2xl px-6 py-6 rounded-full"
                          size="lg"
                        >
                          Book {selectedVehicleData?.name} - ${calculatePrice()}
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default TransportationApp;
