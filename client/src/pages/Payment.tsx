import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment() {
  const [status, setStatus] = useState<"idle" | "processing" | "success" | "error">("idle");
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  const handlePayment = async () => {
    setStatus("processing");
    
    try {
      const options = {
        key: process.env.VITE_RAZORPAY_KEY_ID || "rzp_test_1DP5mmOlF5G0M3",
        amount: 150000, // ₹1,500 in paise
        currency: "INR",
        name: "Therapy with Himanshi",
        description: "50-minute Therapy Session",
        handler: function (response: any) {
          setStatus("success");
          setTimeout(() => {
            setLocation("/book");
          }, 2000);
        },
        prefill: {
          email: "client@example.com",
          contact: "+919999999999",
        },
        theme: {
          color: "#ff8eb3",
        },
      };

      if (window.Razorpay) {
        const razorpay = new window.Razorpay(options);
        razorpay.open();
      } else {
        throw new Error("Razorpay failed to load");
      }
    } catch (error) {
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl border-none">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">Session Payment</CardTitle>
            <CardDescription>Secure payment via Razorpay</CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="flex justify-between items-center p-4 bg-secondary/20 rounded-xl">
              <span className="font-medium">Therapy Session (50 min)</span>
              <span className="font-bold text-lg">₹1,500</span>
            </div>

            {status === "error" && (
              <div className="flex items-center gap-2 text-destructive bg-destructive/10 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                <span>Payment failed. Please try again.</span>
              </div>
            )}

            {status === "success" && (
              <div className="flex items-center gap-2 text-green-600 bg-green-100 p-3 rounded-lg text-sm animate-in fade-in">
                <CheckCircle2 size={16} />
                <span>Payment successful! Redirecting...</span>
              </div>
            )}
          </CardContent>

          <CardFooter>
            <Button 
              className="w-full rounded-full h-12 text-lg" 
              onClick={handlePayment}
              disabled={status === "processing" || status === "success"}
            >
              {status === "processing" ? "Processing..." : "Pay Now"}
            </Button>
          </CardFooter>
        </Card>
      </main>
      <Footer />
    </div>
  );
}
