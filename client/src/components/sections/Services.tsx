import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Brain, Laptop, User, Clock, IndianRupee } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const serviceIcons: Record<string, typeof User> = {
  "individual-therapy": User,
  "anxiety-stress": Brain,
  "relationship-counseling": Heart,
  "teen-young-adult": Users,
  "online-session": Laptop,
};

const services = [
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

export function Services() {
  return (
    <section id="services" className="py-24 bg-muted/30">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            How I Can Help
          </h2>
          <p className="text-muted-foreground">
            Tailored therapeutic approaches designed to meet your unique needs and goals.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const IconComponent = serviceIcons[service.id] || User;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
                  <CardHeader>
                    <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4 text-primary-foreground">
                      <IconComponent size={24} />
                    </div>
                    <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <CardDescription className="text-base">
                      {service.description}
                    </CardDescription>
                    <div className="flex items-center gap-4 pt-2">
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock size={16} />
                        <span>{service.duration} mins</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-primary">
                        <IndianRupee size={16} />
                        <span>{service.price.toLocaleString()}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link href={`/payment?service=${service.id}`} className="w-full">
                      <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary">
                        Book Now
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
