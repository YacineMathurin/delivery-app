import React, { useState, useRef } from "react";
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
  const [currentStep, setCurrentStep] = useState(0);
  const [senderPhone, setSenderPhone] = useState("");
  const [receiverPhone, setReceiverPhone] = useState("");
  const [photoPreview, setPhotoPreview] = useState(null);
  const fileInputRef = useRef(null);

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

  const selectedVehicleData = vehicleTypes.find((v) => v.id === selectedVehicle);

  const steps = [
    { id: 0, name: "Vehicle", completed: selectedVehicle !== "" },
    { id: 1, name: "Contacts", completed: senderPhone && receiverPhone },
    { id: 2, name: "Photo", completed: photoPreview !== null },
  ];

  const handleNextStep = () => {
    if (currentStep < 2) setCurrentStep(currentStep + 1);
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleBooking = () => {
    alert(`Booking confirmed!\nVehicle: ${selectedVehicleData.name}\nPrice: $${calculatePrice()}\nSender: ${senderPhone}\nReceiver: ${receiverPhone}`);
  };

  const handleFindRoute = async () => {
    if (!origin || !destination) return;
    setIsLoading(true);
    setTimeout(() => {
      setRouteInfo({
        distance: "15.3 km",
        duration: "25 mins",
        distanceValue: 15.3,
      });
      setIsLoading(false);
      setShowMap(true);
    }, 1500);
  };

  const handleBackToPlanning = () => {
    setShowMap(false);
    setRouteInfo(null);
    setDrawerOpen(false);
    setCurrentStep(0);
    setSelectedVehicle("");
    setSenderPhone("");
    setReceiverPhone("");
    setPhotoPreview(null);
  };

  const calculatePrice = () => {
    if (!routeInfo || !selectedVehicleData) return 0;
    const pricePerKm = parseFloat(selectedVehicleData.price.replace("$", "").replace("/km", ""));
    return (routeInfo.distanceValue * pricePerKm).toFixed(2);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {!showMap ? (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <header className="bg-white shadow-sm border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-600 rounded-lg">
                    <Navigation className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">RouteGo</h1>
                    <p className="text-sm text-gray-600">Smart Transportation Planning</p>
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
                    <Label htmlFor="origin" className="flex items-center space-x-2">
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
                    <Label htmlFor="destination" className="flex items-center space-x-2">
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
        <>
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-blue-600 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold">Map View</p>
              <p className="text-sm text-gray-600 mt-2">Route: {origin} → {destination}</p>
            </div>
          </div>

          <div className="absolute top-4 left-4 right-4 z-20 animate-in slide-in-from-top duration-300">
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
                      {selectedVehicleData && (
                        <div className="flex items-center space-x-1">
                          <DollarSign className="h-4 w-4 text-green-600" />
                          <span>${calculatePrice()}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {!drawerOpen && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 animate-in slide-in-from-bottom duration-300">
              <Button
                onClick={() => setDrawerOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 shadow-2xl px-6 py-6 rounded-full"
                size="lg"
              >
                <Car className="h-5 w-5 mr-2" />
                Choose Vehicle
                <ChevronUp className="h-5 w-5 ml-2" />
              </Button>
            </div>
          )}

          {drawerOpen && (
            <>
              <div
                onClick={() => setDrawerOpen(false)}
                className="absolute inset-0 bg-black/30 z-30 animate-in fade-in duration-200"
              />

              <div className="absolute bottom-0 left-0 right-0 z-40 max-h-[80vh] animate-in slide-in-from-bottom duration-300">
                <Card className="shadow-2xl border-0 bg-white rounded-t-3xl rounded-b-none">
                  <CardContent className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between mb-6 px-4">
                      {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                          <div className="flex flex-col items-center flex-1">
                            <div
                              className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                                step.completed
                                  ? "bg-green-500 text-white"
                                  : currentStep === step.id
                                  ? "bg-blue-500 text-white"
                                  : "bg-gray-200 text-gray-400"
                              }`}
                            >
                              {step.completed ? "✓" : step.id + 1}
                            </div>
                            <div
                              className={`text-xs mt-1 font-medium ${
                                step.completed || currentStep === step.id
                                  ? "text-gray-900"
                                  : "text-gray-400"
                              }`}
                            >
                              {step.name}
                            </div>
                          </div>
                          {index < steps.length - 1 && (
                            <div
                              className={`h-1 flex-1 mx-2 rounded transition-all duration-300 ${
                                step.completed ? "bg-green-500" : "bg-gray-200"
                              }`}
                            />
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <Car className="h-6 w-6 text-blue-600" />
                        <h3 className="text-xl font-bold">
                          {currentStep === 0
                            ? "Choose Vehicle"
                            : currentStep === 1
                            ? "Contact Information"
                            : "Upload Photo"}
                        </h3>
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

                    {routeInfo && (
                      <div className="flex items-center justify-around mb-6 p-4 bg-blue-50 rounded-xl">
                        <div className="text-center">
                          <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Duration</div>
                          <div className="font-semibold">{routeInfo.duration}</div>
                        </div>
                        <div className="text-center">
                          <Route className="h-5 w-5 text-green-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-600">Distance</div>
                          <div className="font-semibold">{routeInfo.distance}</div>
                        </div>
                        {selectedVehicleData && (
                          <div className="text-center">
                            <DollarSign className="h-5 w-5 text-green-600 mx-auto mb-1" />
                            <div className="text-xs text-gray-600">Price</div>
                            <div className="font-semibold">${calculatePrice()}</div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="overflow-hidden">
                      <div
                        className="flex transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${currentStep * 100}%)`, width: "300%" }}
                      >
                        <div className="w-full px-2" style={{ width: "33.333%" }}>
                          <div className="grid grid-cols-1 gap-4 mb-6 max-h-[40vh] overflow-y-auto">
                            {vehicleTypes.map((vehicle) => {
                              const IconComponent = vehicle.icon;
                              return (
                                <div
                                  key={vehicle.id}
                                  onClick={() => setSelectedVehicle(vehicle.id)}
                                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 active:scale-95 ${
                                    selectedVehicle === vehicle.id
                                      ? "border-blue-500 bg-blue-50 shadow-lg"
                                      : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
                                  }`}
                                >
                                  <div className="flex items-center space-x-4">
                                    <div className={`p-3 rounded-xl ${vehicle.color} text-white`}>
                                      <IconComponent className="h-6 w-6" />
                                    </div>
                                    <div>
                                      <h4 className="font-semibold text-gray-900">{vehicle.name}</h4>
                                      <div className="text-xs text-gray-600 mt-1">{vehicle.capacity}</div>
                                      <div className="font-bold text-green-600 mt-1">{vehicle.price}</div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {selectedVehicle && (
                            <Button
                              onClick={handleNextStep}
                              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg rounded-2xl"
                            >
                              Next: Contact Information
                            </Button>
                          )}
                        </div>

                        <div className="w-full px-2" style={{ width: "33.333%" }}>
                          <div className="space-y-6 mb-6">
                            <div className="space-y-2">
                              <Label htmlFor="senderPhone" className="text-base font-semibold">
                                Sender Phone Number
                              </Label>
                              <Input
                                id="senderPhone"
                                type="tel"
                                placeholder="+33 6 12 34 56 78"
                                value={senderPhone}
                                onChange={(e) => setSenderPhone(e.target.value)}
                                className="py-6 text-lg"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="receiverPhone" className="text-base font-semibold">
                                Receiver Phone Number
                              </Label>
                              <Input
                                id="receiverPhone"
                                type="tel"
                                placeholder="+33 6 98 76 54 32"
                                value={receiverPhone}
                                onChange={(e) => setReceiverPhone(e.target.value)}
                                className="py-6 text-lg"
                              />
                            </div>
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={handlePreviousStep}
                              variant="outline"
                              className="flex-1 py-6 text-lg rounded-2xl"
                            >
                              Back
                            </Button>
                            <Button
                              onClick={handleNextStep}
                              disabled={!senderPhone || !receiverPhone}
                              className="flex-1 bg-blue-600 hover:bg-blue-700 py-6 text-lg rounded-2xl"
                            >
                              Next: Upload Photo
                            </Button>
                          </div>
                        </div>

                        <div className="w-full px-2" style={{ width: "33.333%" }}>
                          <div className="mb-6">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />

                            {!photoPreview ? (
                              <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all"
                              >
                                <div className="flex flex-col items-center space-y-3">
                                  <div className="p-4 bg-blue-100 rounded-full">
                                    <MapPin className="h-8 w-8 text-blue-600" />
                                  </div>
                                  <div className="text-lg font-semibold text-gray-700">
                                    Upload Item Photo
                                  </div>
                                  <div className="text-sm text-gray-500">Click to select an image</div>
                                </div>
                              </div>
                            ) : (
                              <div className="relative">
                                <img
                                  src={photoPreview}
                                  alt="Uploaded item"
                                  className="w-full h-64 object-cover rounded-2xl"
                                />
                                <Button
                                  onClick={() => setPhotoPreview(null)}
                                  variant="destructive"
                                  size="sm"
                                  className="absolute top-2 right-2 rounded-full"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                                <div className="absolute bottom-2 left-2 right-2 bg-green-500 text-white py-2 px-4 rounded-xl text-center font-semibold">
                                  ✓ Photo Uploaded
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-3">
                            <Button
                              onClick={handlePreviousStep}
                              variant="outline"
                              className="flex-1 py-6 text-lg rounded-2xl"
                            >
                              Back
                            </Button>
                            <Button
                              onClick={handleBooking}
                              disabled={!photoPreview}
                              className="flex-1 bg-green-600 hover:bg-green-700 py-6 text-lg rounded-2xl font-bold"
                            >
                              Book Now - ${calculatePrice()}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default TransportationApp;
