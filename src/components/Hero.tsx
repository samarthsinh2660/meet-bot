import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Bot, Video, FileText } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-hero-gradient" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-glow/15 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 rounded-full mb-8 animate-slide-in">
            <Bot className="w-4 h-4 text-primary" />
            <span className="text-sm text-muted-foreground">Autonomous Meeting Intelligence</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-slide-in tracking-tight" style={{ animationDelay: '0.1s' }}>
            <span className="text-foreground">Be everywhere</span>
            <br />
            <span className="gradient-text">at once.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-in leading-relaxed" style={{ animationDelay: '0.2s' }}>
            Deploy AI-powered meeting notetakers to attend unlimited meetings simultaneously. 
            Receive HD recordings, intelligent transcripts, and actionable insights—automatically.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 animate-slide-in" style={{ animationDelay: '0.3s' }}>
            <Link to="/auth/register">
              <Button variant="hero" size="xl" className="group">
                Start Free Trial
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/auth/login">
              <Button variant="outline" size="xl">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-4 animate-slide-in" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Video className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">HD Recording</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <FileText className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Auto Transcripts</span>
            </div>
            <div className="flex items-center gap-2 glass-card px-4 py-2 rounded-full">
              <Bot className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground">Multi-Meeting</span>
            </div>
          </div>
        </div>

        {/* Hero Visual */}
        <div className="mt-16 relative animate-slide-in" style={{ animationDelay: '0.5s' }}>
          <div className="glass-card rounded-2xl p-1 glow-purple max-w-5xl mx-auto">
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="w-3 h-3 rounded-full bg-destructive/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-muted-foreground ml-2">Skriber Dashboard</span>
              </div>
              <div className="p-6 bg-gradient-to-br from-card to-secondary/30">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="glass-card rounded-lg p-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                      <Video className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">24</div>
                    <div className="text-sm text-muted-foreground">Meetings Recorded</div>
                  </div>
                  <div className="glass-card rounded-lg p-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">156</div>
                    <div className="text-sm text-muted-foreground">Hours Transcribed</div>
                  </div>
                  <div className="glass-card rounded-lg p-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                      <Bot className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-2xl font-bold text-foreground">3</div>
                    <div className="text-sm text-muted-foreground">Active Notetakers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
