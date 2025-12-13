import { FileText, Calendar, Users } from "lucide-react";
import { useState } from "react";

interface Meeting {
  id: string;
  title: string;
  date: string;
  duration: string;
  participants: number;
  thumbnail: string;
  hasTranscript: boolean;
}

const mockMeetings: Meeting[] = [
  {
    id: "1",
    title: "Product Sprint Planning",
    date: "Dec 4, 2024",
    duration: "45 min",
    participants: 8,
    thumbnail: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=400&h=225&fit=crop",
    hasTranscript: true,
  },
  {
    id: "2",
    title: "Client Onboarding Call",
    date: "Dec 3, 2024",
    duration: "32 min",
    participants: 4,
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=225&fit=crop",
    hasTranscript: true,
  },
  {
    id: "3",
    title: "Weekly Team Standup",
    date: "Dec 2, 2024",
    duration: "15 min",
    participants: 12,
    thumbnail: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&h=225&fit=crop",
    hasTranscript: true,
  },
  {
    id: "4",
    title: "Design Review Session",
    date: "Dec 1, 2024",
    duration: "58 min",
    participants: 6,
    thumbnail: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=225&fit=crop",
    hasTranscript: false,
  },
];

const MeetingsLibrary = () => {
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <span className="text-primary text-sm font-semibold uppercase tracking-wider">Meeting Library</span>
          <h2 className="text-3xl md:text-5xl font-bold mt-4 mb-4 tracking-tight">
            <span className="text-foreground">Your </span>
            <span className="gradient-text">recordings</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Access recordings, transcripts, and insights from all your meetings.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {meeting.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    {meeting.participants}
                  </div>
                </div>

                {meeting.hasTranscript && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <FileText className="w-3 h-3" />
                    Transcript available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MeetingsLibrary;
