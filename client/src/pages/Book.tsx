import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lock, Calendar } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearch, Link } from "wouter";

export default function Book() {
  const [accessStatus, setAccessStatus] = useState<"loading" | "authorized" | "unauthorized">("loading");
  const [calLink, setCalLink] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  
  const searchString = useSearch();
  const params = new URLSearchParams(searchString);
  const tokenFromUrl = params.get("token");

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const url = tokenFromUrl 
          ? `/api/book/access?token=${tokenFromUrl}`
          : "/api/book/access";
          
        const response = await fetch(url, {
          credentials: "include",
        });

        const data = await response.json();

        if (data.authorized) {
          setCalLink(data.calLink);
          setAccessStatus("authorized");
        } else {
          setError(data.error || "Access denied");
          setAccessStatus("unauthorized");
        }
      } catch (err) {
        setError("Failed to verify access. Please try again.");
        setAccessStatus("unauthorized");
      }
    };

    checkAccess();
  }, [tokenFromUrl]);

  useEffect(() => {
    if (accessStatus === "authorized") {
      const script = document.createElement("script");
      script.src = "https://cal.com/embed.js";
      script.async = true;
      document.head.appendChild(script);
    }
  }, [accessStatus]);

  if (accessStatus === "loading") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Verifying your access...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (accessStatus === "unauthorized") {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        <main className="flex-grow flex items-center justify-center p-4">
          <Card className="w-full max-w-md shadow-xl border-none text-center">
            <CardHeader>
              <div className="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Lock size={32} className="text-muted-foreground" />
              </div>
              <CardTitle className="font-heading text-2xl">Payment Required</CardTitle>
              <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-amber-600 bg-amber-50 p-3 rounded-lg text-sm">
                <AlertCircle size={16} />
                <span>Please complete payment to access booking</span>
              </div>
              <Link href="/#services">
                <Button className="w-full rounded-full h-12">
                  <Calendar className="mr-2" size={20} />
                  View Services & Pay
                </Button>
              </Link>
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
      <main className="flex-grow pt-12 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm mb-4">
              <Calendar size={16} />
              Payment Verified
            </div>
            <h1 className="font-heading text-3xl font-bold mb-2">Book Your Session</h1>
            <p className="text-muted-foreground">Choose a time that works for you.</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50 min-h-[600px]">
            {calLink && (
              <iframe
                src={calLink}
                width="100%"
                height="600"
                frameBorder="0"
                title="Book Appointment"
                className="w-full"
              />
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
