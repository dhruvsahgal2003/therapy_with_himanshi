import { Instagram, Mail, Calendar } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-muted/50 py-12 mt-auto">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-heading font-bold text-lg">Therapy with Himanshi</h3>
            <p className="text-sm text-muted-foreground mt-1">
              A safe space for healing, growth, and emotional clarity.
            </p>
          </div>

          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/therapy.w.himanshi"
              target="_blank"
              rel="noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href="mailto:hello@himanshi.com"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
            <Link href="/book">
              <span className="text-muted-foreground hover:text-primary transition-colors cursor-pointer" aria-label="Book Appointment">
                <Calendar size={20} />
              </span>
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border/50 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Therapy with Himanshi. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
