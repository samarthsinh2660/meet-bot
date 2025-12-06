import { Bot, Video, FileText, Cloud, Shield, Zap } from "lucide-react";

const features = [
  {
    icon: Bot,
    title: "Intelligent Meeting Bots",
    description: "AI assistants that join meetings seamlessly, capturing every detail without disruption.",
  },
  {
    icon: Video,
    title: "HD Video Capture",
    description: "Crystal-clear recordings stored securely in enterprise-grade cloud infrastructure.",
  },
  {
    icon: FileText,
    title: "Smart Transcription",
    description: "AI-powered transcripts with speaker identification, timestamps, and key highlights.",
  },
  {
    icon: Cloud,
    title: "Secure Cloud Storage",
    description: "Unlimited storage with instant access. Your data, always available, always protected.",
  },
  {
    icon: Shield,
    title: "Enterprise-Grade Security",
    description: "Bank-level encryption with SOC 2, GDPR, and HIPAA compliance built-in.",
  },
  {
    icon: Zap,
    title: "Real-Time Processing",
    description: "Recordings and transcripts delivered within minutes of meeting completion.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Features</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            <span className="text-foreground">Purpose-built for </span>
            <span className="gradient-text">modern teams</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A comprehensive suite of tools designed to capture, transcribe, and deliver 
            meeting intelligence at scale.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="glass-card rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 group animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/30 transition-colors">
                <feature.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
