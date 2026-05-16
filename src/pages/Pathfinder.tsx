import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, RefreshCcw, BookOpen, Sparkles, Brain, Code, Palette, Database, BarChart3, Globe, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

interface Question {
  id: number;
  text: string;
  options: {
    text: string;
    weights: Record<string, number>;
  }[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "How do you prefer to approach a complex problem?",
    options: [
      { text: "Break it down into logical steps and analyze data", weights: { DS: 3, WD: 1, CC: 1 } },
      { text: "Sketch out ideas and think about the user experience", weights: { UX: 3, DM: 1 } },
      { text: "Experiment with different solutions until one works", weights: { WD: 2, ES: 2 } }
    ]
  },
  {
    id: 2,
    text: "Which of these activities sounds most exciting to you?",
    options: [
      { text: "Building a functional application from scratch", weights: { WD: 3, ES: 1 } },
      { text: "Finding hidden patterns in large sets of information", weights: { DS: 3, DM: 1 } },
      { text: "Designing a beautiful and intuitive interface", weights: { UX: 3 } }
    ]
  },
  {
    id: 3,
    text: "How do you feel about working with numbers and statistics?",
    options: [
      { text: "I love it! Data tells a story", weights: { DS: 3, DM: 2, CC: 1 } },
      { text: "It's okay, but I prefer visual tasks", weights: { UX: 2, WD: 1 } },
      { text: "I'd rather focus on the logic and flow", weights: { WD: 2, ES: 1 } }
    ]
  },
  {
    id: 4,
    text: "Are you more interested in...",
    options: [
      { text: "How things work behind the scenes (logic, servers)", weights: { CC: 3, WD: 2, ES: 2 } },
      { text: "How things look and feel to the user", weights: { UX: 3, WD: 1, DM: 1 } }
    ]
  },
  {
    id: 5,
    text: "When you visit a website, what's the first thing you notice?",
    options: [
      { text: "The layout, colors, and ease of use", weights: { UX: 3, DM: 1 } },
      { text: "The features, speed, and functionality", weights: { WD: 3, CC: 1 } },
      { text: "The content and how it's presented", weights: { DM: 3, UX: 1 } }
    ]
  },
  {
    id: 6,
    text: "Do you enjoy fixing broken things or improving efficiency?",
    options: [
      { text: "Yes, I love debugging and optimizing systems", weights: { WD: 2, CC: 3, ES: 2 } },
      { text: "I prefer creating new things from an idea", weights: { UX: 2, DM: 2, WD: 1 } }
    ]
  },
  {
    id: 7,
    text: "How much attention do you pay to small details?",
    options: [
      { text: "I'm a perfectionist; every pixel/line matters", weights: { UX: 3, WD: 2, ES: 1 } },
      { text: "I focus on the big picture and overall result", weights: { DM: 2, DS: 2, CC: 1 } }
    ]
  },
  {
    id: 8,
    text: "If you were to build a gadget, what would it be?",
    options: [
      { text: "A smart device that controls household items", weights: { ES: 3, CC: 1 } },
      { text: "An app that helps people manage their finances", weights: { WD: 2, DS: 2 } },
      { text: "A platform for creative artists to showcase work", weights: { UX: 2, DM: 1 } }
    ]
  },
  {
    id: 9,
    text: "Do you like to plan things out before starting?",
    options: [
      { text: "Extensively, I need a clear roadmap and data", weights: { DS: 2, CC: 2, UX: 1 } },
      { text: "A little, but I like to dive in and learn as I go", weights: { WD: 2, ES: 1, DM: 1 } }
    ]
  },
  {
    id: 10,
    text: "Which sounds more appealing?",
    options: [
      { text: "Managing a large network of servers", weights: { CC: 3, ES: 1 } },
      { text: "Creating a viral marketing campaign", weights: { DM: 3, UX: 1 } },
      { text: "Writing code that solves a complex math problem", weights: { DS: 3, WD: 1 } }
    ]
  },
  {
    id: 11,
    text: "Are you interested in how hardware connects to software?",
    options: [
      { text: "Yes, I want to know how the physical components work", weights: { ES: 3, CC: 1 } },
      { text: "Not really, I prefer working on the software side", weights: { WD: 2, DS: 2, UX: 2 } }
    ]
  },
  {
    id: 12,
    text: "Do you like to explain complex ideas to others?",
    options: [
      { text: "Yes, I enjoy making things easy to understand", weights: { UX: 2, DM: 3, DS: 1 } },
      { text: "I'd rather let the results/code speak for itself", weights: { WD: 2, CC: 2, ES: 2 } }
    ]
  },
  {
    id: 13,
    text: "How do you feel about constant learning and updates?",
    options: [
      { text: "I love it, I want to stay on the cutting edge", weights: { WD: 3, CC: 3, DS: 2 } },
      { text: "I prefer mastering a set of core principles", weights: { UX: 2, ES: 2, DM: 1 } }
    ]
  },
  {
    id: 14,
    text: "Do you enjoy automating repetitive tasks?",
    options: [
      { text: "Yes, efficiency is key to everything I do", weights: { CC: 3, DS: 2, WD: 1 } },
      { text: "I enjoy the manual process of creation", weights: { UX: 2, ES: 1 } }
    ]
  },
  {
    id: 15,
    text: "What is your ultimate goal in a career?",
    options: [
      { text: "To innovate and build the next big technology", weights: { WD: 2, ES: 2, CC: 1 } },
      { text: "To help people through better design and UX", weights: { UX: 3, DM: 1 } },
      { text: "To solve the world's problems with data and AI", weights: { DS: 3, CC: 1 } }
    ]
  }
];

const courseData: Record<string, { title: string, desc: string, icon: any, color: string }> = {
  WD: { title: "Web Development", desc: "Build modern websites and applications using React, Node.js, and TypeScript. Perfect for problem solvers who love seeing immediate results.", icon: Code, color: "text-blue-500" },
  DS: { title: "Data Science", desc: "Uncover insights and build AI models using Python and Machine Learning. Ideal for those who love patterns, math, and logical analysis.", icon: Database, color: "text-purple-500" },
  UX: { title: "UI/UX Design", desc: "Design beautiful, user-centric interfaces and experiences. Best for creative minds with an eye for detail and empathy for users.", icon: Palette, color: "text-pink-500" },
  DM: { title: "Digital Marketing", desc: "Master the art of growth, SEO, and social media strategy. Great for communicators and strategists who want to drive results.", icon: BarChart3, color: "text-orange-500" },
  CC: { title: "Cloud Computing", desc: "Manage and scale global infrastructure with AWS and DevOps. Perfect for those who enjoy system architecture and high-scale logic.", icon: Globe, color: "text-cyan-500" },
  ES: { title: "Embedded Systems", desc: "Program hardware and IoT devices at the core level. Ideal for those interested in the intersection of physical devices and code.", icon: Cpu, color: "text-emerald-500" }
};

const Pathfinder = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({ WD: 0, DS: 0, UX: 0, DM: 0, CC: 0, ES: 0 });
  const [isFinished, setIsFinished] = useState(false);

  const handleAnswer = (weights: Record<string, number>) => {
    const newScores = { ...scores };
    Object.keys(weights).forEach(key => {
      newScores[key] = (newScores[key] || 0) + weights[key];
    });
    setScores(newScores);

    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsFinished(true);
    }
  };

  const getRecommendedCourse = () => {
    let maxScore = -1;
    let recommended = "WD";
    Object.keys(scores).forEach(key => {
      if (scores[key] > maxScore) {
        maxScore = scores[key];
        recommended = key;
      }
    });
    return courseData[recommended];
  };

  const resetQuiz = () => {
    setCurrentStep(0);
    setScores({ WD: 0, DS: 0, UX: 0, DM: 0, CC: 0, ES: 0 });
    setIsFinished(false);
  };

  const recommendation = getRecommendedCourse();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Mini Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo size="md" />
          <Link to="/">
            <Button variant="ghost" size="sm">Back to Home</Button>
          </Link>
        </div>
      </nav>

      <main className="flex-1 pt-24 pb-12 px-4 flex items-center justify-center">
        <div className="w-full max-w-2xl mx-auto">
          {!isFinished ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="premium-card p-8 md:p-12 space-y-8"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-primary">
                  <span>Question {currentStep + 1} of {questions.length}</span>
                  <span>{Math.round(((currentStep + 1) / questions.length) * 100)}%</span>
                </div>
                <Progress value={((currentStep + 1) / questions.length) * 100} className="h-2" />
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-8"
                >
                  <h2 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
                    {questions[currentStep].text}
                  </h2>

                  <div className="grid grid-cols-1 gap-4">
                    {questions[currentStep].options.map((option, idx) => (
                      <motion.button
                        key={idx}
                        whileHover={{ scale: 1.02, x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(option.weights)}
                        className="group flex items-center justify-between p-5 rounded-2xl border bg-card hover:border-primary hover:bg-primary/5 transition-all text-left"
                      >
                        <span className="text-lg font-medium group-hover:text-primary transition-colors">{option.text}</span>
                        <div className="w-8 h-8 rounded-full border flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <div className="premium-card p-10 md:p-16 space-y-8 relative overflow-hidden">
                {/* Background Sparkles Effect */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-blue-400 to-primary" />
                
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary mb-2">
                    <Sparkles className="h-10 w-10 animate-pulse" />
                  </div>
                  <h1 className="text-3xl md:text-5xl font-bold">Your Ideal Path Found!</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">Based on your aptitude and interests, we recommend:</p>
                </div>

                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="p-8 rounded-3xl bg-accent/30 border-2 border-primary/20 space-y-6"
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-2xl bg-white shadow-xl flex items-center justify-center ${recommendation.color} mb-4`}>
                      <recommendation.icon className="h-8 w-8" />
                    </div>
                    <h2 className="text-3xl font-bold">{recommendation.title}</h2>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{recommendation.desc}</p>
                </motion.div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                  <Link to="/register" className="w-full">
                    <Button size="xl" variant="premium" className="w-full group">
                      Get Started with {recommendation.title}
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Button size="xl" variant="outline" onClick={resetQuiz} className="w-full gap-2">
                    <RefreshCcw className="h-4 w-4" />
                    Retake Quiz
                  </Button>
                </div>
              </div>

              <div className="flex items-center justify-center gap-8 text-muted-foreground">
                <div className="flex items-center gap-2"><Brain className="h-4 w-4" /> <span>Aptitude Matched</span></div>
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> <span>Course Validated</span></div>
              </div>
            </motion.div>
          )}
        </div>
      </main>

      <footer className="py-8 border-t text-center text-sm text-muted-foreground">
        <p>© 2025 EIT Career Pathfinder. Find your future.</p>
      </footer>
    </div>
  );
};

export default Pathfinder;
