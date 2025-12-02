import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Book() {
  useEffect(() => {
    // This is where we would initialize Cal.com embed
    // For now we just show a placeholder as requested
    // In a real app:
    // (function (C, A, L) { ... })(window, "https://cal.com/embed.js", "cal");
    // cal("init", "your-cal-link");
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
          
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-border/50 min-h-[600px] flex items-center justify-center relative">
            {/* Placeholder for Cal.com Embed */}
            <div className="text-center p-8 max-w-md">
               <div className="w-16 h-16 bg-secondary/30 rounded-full flex items-center justify-center mx-auto mb-4 text-primary">
                 <Loader2 className="animate-spin" size={32} />
               </div>
               <h3 className="font-heading text-xl font-semibold mb-2">Cal.com Integration</h3>
               <p className="text-muted-foreground mb-6">
                 This is a placeholder for the Cal.com booking widget. 
                 In a production environment, the scheduling interface would load here.
               </p>
               <div className="p-4 bg-muted rounded-xl text-sm font-mono text-muted-foreground">
                 // Cal.com embed code would go here
               </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
