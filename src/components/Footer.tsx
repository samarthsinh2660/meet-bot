import { POLICY_LINKS } from '@/constants/policyLinks';

const Footer = () => {
  return (
    <footer className="py-8 sm:py-12 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex flex-col items-center gap-4 sm:gap-6 text-center md:text-left md:flex-row md:justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">S</span>
            </div>
            <span className="text-xl font-bold text-foreground tracking-tight">Skriber</span>
          </div>

          {/* Links */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm text-muted-foreground">
            <a
              href={POLICY_LINKS.privacy}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </a>
            <a
              href={POLICY_LINKS.terms}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </a>
            <a
              href={POLICY_LINKS.refund}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Refund Policy
            </a>
            <a
              href={POLICY_LINKS.contact}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Contact Us
            </a>
          </div>

          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Skriber. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
