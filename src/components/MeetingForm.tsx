import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, X, Link, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const MeetingForm = () => {
  const [links, setLinks] = useState<string[]>([""]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addLink = () => {
    if (links.length < 5) {
      setLinks([...links, ""]);
    }
  };

  const removeLink = (index: number) => {
    if (links.length > 1) {
      setLinks(links.filter((_, i) => i !== index));
    }
  };

  const updateLink = (index: number, value: string) => {
    const newLinks = [...links];
    newLinks[index] = value;
    setLinks(newLinks);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validLinks = links.filter(link => link.trim() !== "");
    
    if (validLinks.length === 0) {
      toast.error("Please enter at least one meeting link");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    toast.success(`${validLinks.length} notetaker(s) dispatched to meetings!`);
    setLinks([""]);
    setIsSubmitting(false);
  };

  return (
    <section id="meetings" className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Deploy Notetakers</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            <span className="text-foreground">Schedule your </span>
            <span className="gradient-text">meeting coverage</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Add meeting links and your AI notetaker will join automatically. 
            Access recordings and transcripts within minutes.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 glow-purple">
            <div className="space-y-4 mb-6">
              {links.map((link, index) => (
                <div key={index} className="flex items-center gap-3 animate-slide-in">
                  <div className="flex-1 relative">
                    <Link className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="url"
                      placeholder="Enter meeting URL (Zoom, Google Meet, Teams)"
                      value={link}
                      onChange={(e) => updateLink(index, e.target.value)}
                      className="pl-10 h-12 bg-secondary/50 border-border focus:border-primary"
                    />
                  </div>
                  {links.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeLink(index)}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={addLink}
                disabled={links.length >= 5}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Meeting
              </Button>

              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={isSubmitting}
                className="w-full sm:w-auto sm:ml-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deploying...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Deploy Notetakers
                  </>
                )}
              </Button>
            </div>

            <p className="text-xs text-muted-foreground text-center mt-4">
              Compatible with Zoom, Google Meet, Microsoft Teams, and Webex
            </p>
          </form>
        </div>
      </div>
    </section>
  );
};

export default MeetingForm;
