import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import MeetingForm from "@/components/MeetingForm";
import MeetingsLibrary from "@/components/MeetingsLibrary";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <MeetingForm />
      <MeetingsLibrary />
      <Footer />
    </div>
  );
};

export default Index;
