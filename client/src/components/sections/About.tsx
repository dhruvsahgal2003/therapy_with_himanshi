import { motion } from "framer-motion";

export function About() {
  return (
    <section id="about" className="py-20 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Image Placeholder for About - Using a simple gradient block or another generated asset if we had one. 
              For now, let's use a styled div to keep it clean/minimal as requested. */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative aspect-square rounded-[2rem] overflow-hidden bg-muted"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-secondary/50 to-primary/20 flex items-center justify-center">
              <span className="text-primary/40 font-heading font-bold text-2xl">About Himanshi</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
              Compassionate Care for Your Journey
            </h2>
            <div className="space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Hello, I’m Himanshi. I am a dedicated psychologist passionate about creating a safe, non-judgmental space for individuals to explore their emotions and navigate life’s challenges.
              </p>
              <p>
                My approach combines empathy with evidence-based techniques to help you find clarity and resilience. Whether you are dealing with anxiety, relationship issues, or just feeling stuck, I am here to walk alongside you.
              </p>
              <p>
                I believe that healing is not linear, and every step forward is a victory worth celebrating. Together, we can work towards a more balanced and fulfilling life.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
