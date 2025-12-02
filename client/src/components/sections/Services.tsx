import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Users, Brain, Laptop, User } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "wouter";

const services = [
  {
    title: "One-on-One Therapy",
    description: "Personalized individual sessions to explore your thoughts and feelings in a safe space.",
    icon: User,
  },
  {
    title: "Anxiety & Stress",
    description: "Evidence-based strategies to manage anxiety, reduce stress, and regain control.",
    icon: Brain,
  },
  {
    title: "Relationship Counseling",
    description: "Navigate complex relationship dynamics and improve communication with your partner.",
    icon: Heart,
  },
  {
    title: "Teen/Young Adult",
    description: "Specialized support for the unique challenges faced by teenagers and young adults.",
    icon: Users,
  },
  {
    title: "Online Sessions",
    description: "Flexible therapy sessions from the comfort of your own home via secure video call.",
    icon: Laptop,
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
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full border-none shadow-sm hover:shadow-md transition-shadow bg-white/80 backdrop-blur-sm">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-secondary/50 flex items-center justify-center mb-4 text-primary-foreground">
                    <service.icon size={24} />
                  </div>
                  <CardTitle className="font-heading text-xl">{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {service.description}
                  </CardDescription>
                </CardContent>
                <CardFooter>
                  <Link href="/book" className="w-full">
                    <Button variant="outline" className="w-full border-primary/20 hover:bg-primary/5 hover:text-primary">
                      Book Now
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
