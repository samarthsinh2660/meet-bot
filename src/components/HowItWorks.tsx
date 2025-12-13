import { Link, Bot, Video, FileText } from "lucide-react";

const steps = [
  {
    icon: Link,
    step: "01",
    title: "Submit Meeting Links",
    description: "Add your Zoom, Google Meet, or Teams meeting links to the dashboard.",
  },
  {
    icon: Bot,
    step: "02",
    title: "Notetaker Deployment",
    description: "Your AI notetaker joins meetings automatically at the scheduled time.",
  },
  {
    icon: Video,
    step: "03",
    title: "Secure Recording",
    description: "Meetings are captured in HD and stored securely in cloud infrastructure.",
  },
  {
    icon: FileText,
    step: "04",
    title: "Instant Delivery",
    description: "Access transcripts with speaker identification within minutes.",
  },
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-primary/5" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">How It Works</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            <span className="text-foreground">Effortless </span>
            <span className="gradient-text">automation</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Get started with Skriber in under a minute. Four simple steps to meeting intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={item.step}
              className="relative animate-slide-in"
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-12 left-full w-full h-px bg-gradient-to-r from-primary/50 to-transparent z-0" />
              )}
              
              <div className="glass-card rounded-2xl p-6 relative z-10 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <item.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-bold text-primary/30">{item.step}</span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
