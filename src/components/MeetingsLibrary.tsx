import { useState } from "react";

interface Meeting {
  id: string;
  title: string;
  duration: string;
  thumbnail: string;
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Product Sprint Planning",
    duration: "45 min",
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=225&fit=crop",
  },
  {
    id: "2",
    title: "Client Onboarding Call",
    duration: "32 min",
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
  },
  {
    id: "3",
    title: "Weekly Team Standup",
    duration: "15 min",
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=225&fit=crop",
  },
  {
    id: "4",
    title: "Design Review Session",
    duration: "58 min",
    thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=225&fit=crop",
  },
];

const MeetingsLibrary = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <section className="py-16 sm:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Meeting Library</span>
          <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            <span className="text-foreground">Your </span>
            <span className="gradient-text">recordings</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access recordings, transcripts, and insights from all your meetings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {mockMeetings.map((meeting, index) => (
            <div
              key={meeting.id}
              className="glass-card rounded-2xl overflow-hidden group hover:border-primary/50 transition-all duration-300 animate-slide-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={meeting.thumbnail}
                  alt={meeting.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute bottom-2 right-2 glass-card px-2 py-1 rounded text-xs text-foreground">
                  {meeting.duration}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 truncate">{meeting.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetingsLibrary;
