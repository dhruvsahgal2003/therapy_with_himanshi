import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";

export default function Book() {
  useEffect(() => {
    // Initialize Cal.com embed
    const script = document.createElement("script");
    script.src = "https://cal.com/embed.js";
    script.async = true;
    document.head.appendChild(script);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-grow pt-12 pb-24 px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="font-heading text-3xl font-bold mb-2">Book Your Session</h1>
            <p className="text-muted-foreground">Choose a time that works for you.</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50 min-h-[600px]">
            {/* Cal.com Embed - Add your Cal.com link here */}
            <iframe
              src="https://cal.com/himanshi-sahni/30min"
              width="100%"
              height="600"
              frameBorder="0"
              title="Book Appointment"
              className="w-full"
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
