import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle, Clock, IndianRupee, ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation, useSearch } from "wouter";
import { Link } from "wouter";

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface ServiceInfo {
  id: string;
  title: string;
  description: string;
  duration: number;
  price: number;
}

const services: ServiceInfo[] = [
  {
    id: "individual-therapy",
    title: "One-on-One Therapy",
    description: "Personalized individual sessions to explore your thoughts and feelings in a safe space.",
    duration: 60,
    price: 1000,
  },
  {
    id: "anxiety-stress",
    title: "Anxiety & Stress Management",
    description: "Evidence-based strategies to manage anxiety, reduce stress, and regain control.",
    duration: 60,
    price: 1000,
  },
  {
    id: "relationship-counseling",
    title: "Relationship Counseling",
    description: "Navigate complex relationship dynamics and improve communication with your partner.",
    duration: 60,
    price: 1000,
  },
  {
    id: "teen-young-adult",
    title: "Teen/Young Adult Therapy",
    description: "Specialized support for the unique challenges faced by teenagers and young adults.",
    duration: 60,
    price: 1000,
  },
  {
    id: "online-session",
    title: "Online Session",
    description: "Flexible therapy sessions from the comfort of your own home via secure video call.",
    duration: 60,
    price: 1000,
  },
];

export default function Payment() {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [, setLocation] = useLocation();
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const serviceId = params.get("service");
  
  const selectedService = services.find(s => s.id === serviceId);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handlePayment = async () => {
    if (!selectedService) {
      setErrorMessage("Please select a service first");
      setStatus("error");
      return;
    }

    setStatus("processing");
    setErrorMessage("");
    
    try {
      const orderResponse = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceId: selectedService.id }),
      });

      if (!orderResponse.ok) {
        const error = await orderResponse.json();
        throw new Error(error.error || "Failed to create order");
      }

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Therapy with Himanshi",
        description: `${orderData.serviceName} (${orderData.serviceDuration} mins)`,
        order_id: orderData.orderId,
        handler: async function (response: any) {
          try {
            const verifyResponse = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verifyData = await verifyResponse.json();
            
            setStatus("success");
            setTimeout(() => {
              setLocation(`/book?token=${verifyData.bookingToken}`);
            }, 2000);
          } catch (error) {
            setErrorMessage("Payment verification failed. Please contact support.");
            setStatus("error");
          }
        },
        modal: {
          ondismiss: function() {
            setStatus("idle");
          }
        },
        theme: {
          color: "#ff8eb3",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.on("payment.failed", function (response: any) {
          setErrorMessage(response.error?.description || "Payment failed");
          setStatus("error");
        });
        razorpay.open();
      } else {
        throw new Error("Payment gateway failed to load. Please refresh the page.");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Something went wrong");
      setStatus("error");
    }
  };

  if (!selectedService) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-none text-center">
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Select a Service</CardTitle>
              <CardDescription>Please choose a therapy service to proceed with payment</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {services.map((service) => (
                <Link key={service.id} href={`/payment?service=${service.id}`} className="block">
                  <div className="p-4 border rounded-xl hover:bg-secondary/20 transition-colors cursor-pointer text-left">
                    <div className="font-medium">{service.title}</div>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock size={14} /> {service.duration} mins
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-primary">
                        <IndianRupee size={14} /> {service.price.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="text-center">
            <Link href="/payment" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4 w-fit">
              <ArrowLeft size={16} /> Change Service
            </Link>
            <CardTitle className="font-heading text-2xl">Complete Payment</CardTitle>
            <CardDescription>Secure payment via Razorpay</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="p-4 bg-secondary/20 rounded-xl space-y-3">
              <div className="font-medium text-lg">{selectedService.title}</div>
              <p className="text-sm text-muted-foreground">{selectedService.description}</p>
              <div className="flex items-center justify-between pt-2 border-t">
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock size={16} /> {selectedService.duration} minutes
                </span>
                <span className="flex items-center gap-1 font-bold text-lg">
                  <IndianRupee size={18} /> {selectedService.price.toLocaleString()}
                </span>
              </div>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                <span>{errorMessage || "Payment failed. Please try again."}</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600 bg-green-100 p-3 rounded-lg text-sm animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>Payment successful! Redirecting to book your session...</span>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full rounded-full h-12 text-lg" 
              onClick={handlePayment}
              disabled={status === "processing" || status === "success"}
            >
              {status === "processing" ? "Processing..." : `Pay ₹${selectedService.price.toLocaleString()}`}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
