import { motion } from "framer-motion";
import { Star, MessageCircle, Calendar, Mail } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Teacher {
  id: number;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  reviews: number;
  expertise: string[];
  availability: "available" | "busy" | "offline";
  nextSlot?: string;
}

const teachers: Teacher[] = [
  {
    id: 1,
    name: "Dr. Sarah Wilson",
    role: "Senior Mentor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
    rating: 4.9,
    reviews: 128,
    expertise: ["React", "JavaScript", "Web Development"],
    availability: "available",
    nextSlot: "Today, 3:00 PM",
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    role: "Technical Lead",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
    rating: 4.8,
    reviews: 95,
    expertise: ["Node.js", "Backend", "Database"],
    availability: "busy",
    nextSlot: "Tomorrow, 10:00 AM",
  },
  {
    id: 3,
    name: "Dr. Emily Parker",
    role: "Industry Expert",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
    rating: 4.7,
    reviews: 82,
    expertise: ["UI/UX", "Design Systems", "Accessibility"],
    availability: "available",
    nextSlot: "Today, 5:00 PM",
  },
  {
    id: 4,
    name: "John Anderson",
    role: "Career Counselor",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=john",
    rating: 4.9,
    reviews: 156,
    expertise: ["Career Guidance", "Interview Prep", "Resume Building"],
    availability: "offline",
  },
];

const getAvailabilityBadge = (status: Teacher["availability"]) => {
  switch (status) {
    case "available":
      return (
        <Badge className="bg-success text-success-foreground">
          <div className="w-2 h-2 bg-success-foreground rounded-full mr-1.5 animate-pulse" />
          Available
        </Badge>
      );
    case "busy":
      return (
        <Badge className="bg-warning text-warning-foreground">
          <div className="w-2 h-2 bg-warning-foreground rounded-full mr-1.5" />
          Busy
        </Badge>
      );
    case "offline":
      return (
        <Badge variant="secondary">
          <div className="w-2 h-2 bg-muted-foreground rounded-full mr-1.5" />
          Offline
        </Badge>
      );
  }
};

const Support = () => {
  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            Support & Teachers
          </h1>
          <p className="text-muted-foreground mt-1">
            Connect with our expert mentors for guidance and support
          </p>
        </motion.div>

        {/* Your Assigned Mentor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="premium-card p-6 bg-gradient-to-r from-primary/5 to-blue-500/5 border-primary/20"
        >
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary">
              <AvatarImage src={teachers[0].avatar} />
              <AvatarFallback>SW</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-lg">{teachers[0].name}</h3>
                <Badge variant="outline" className="text-primary border-primary">Your Mentor</Badge>
              </div>
              <p className="text-muted-foreground text-sm">{teachers[0].role}</p>
              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-sm font-medium">{teachers[0].rating}</span>
                  <span className="text-sm text-muted-foreground">({teachers[0].reviews} reviews)</span>
                </div>
                {getAvailabilityBadge(teachers[0].availability)}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Call
              </Button>
              <Button variant="premium">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </div>
        </motion.div>

        {/* All Teachers */}
        <div>
          <h2 className="text-lg font-semibold mb-4">All Teachers & Mentors</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {teachers.map((teacher, index) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.1 }}
                className="premium-card p-5 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={teacher.avatar} />
                    <AvatarFallback>{teacher.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate">{teacher.name}</h3>
                      {getAvailabilityBadge(teacher.availability)}
                    </div>
                    <p className="text-sm text-muted-foreground">{teacher.role}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="h-3.5 w-3.5 fill-warning text-warning" />
                      <span className="text-sm font-medium">{teacher.rating}</span>
                      <span className="text-xs text-muted-foreground">({teacher.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {teacher.expertise.map((skill) => (
                    <Badge key={skill} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {teacher.nextSlot && (
                  <div className="flex items-center gap-2 mt-3 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Next available: {teacher.nextSlot}</span>
                  </div>
                )}

                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-1" />
                    Contact
                  </Button>
                  <Button size="sm" className="flex-1" disabled={teacher.availability === "offline"}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Request Support
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Support;
