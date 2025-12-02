import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Link } from "wouter";
import heroImage from "@assets/generated_images/a_soft,_professional_portrait_placeholder_for_a_psychologist_website..png";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-soft py-20 md:py-32 lg:py-40">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1 space-y-6"
          >
            <span className="inline-block px-3 py-1 rounded-full bg-white/60 border border-white/50 text-sm font-medium text-primary-foreground/80">
              @therapy.w.himanshi
            </span>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground">
              Therapy with <span className="text-primary">Himanshi</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-md leading-relaxed">
              A safe space for healing, growth, and emotional clarity. Begin your journey towards a healthier mind today.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/book">
                <Button size="lg" className="rounded-full px-8 shadow-lg hover:shadow-xl transition-all">
                  Book a Session
                </Button>
              </Link>
              <a href="#contact">
                <Button variant="outline" size="lg" className="rounded-full px-8 bg-white/50 hover:bg-white border-primary/20">
                  Contact Me
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="order-1 md:order-2 relative"
          >
            <div className="relative aspect-[4/5] md:aspect-square rounded-[2rem] overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10"></div>
              <img
                src={heroImage}
                alt="Psychologist Portrait"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Decorative elements */}
            <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary rounded-full blur-2xl -z-10 opacity-60"></div>
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-primary rounded-full blur-3xl -z-10 opacity-40"></div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
