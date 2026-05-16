import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { CheckCircle2, XCircle, Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface QuizPlayerProps {
  quizId: string;
  moduleTitle: string;
  onComplete: (score: number, passed: boolean) => void;
  onClose: () => void;
}

const QuizPlayer = ({ quizId, moduleTitle, onComplete, onClose }: QuizPlayerProps) => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{score: number, passed: boolean} | null>(null);

  useEffect(() => {
    fetchQuestions();
  }, [quizId]);

  const fetchQuestions = async () => {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error: any) {
      toast.error("Error loading quiz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx(currentQuestionIdx - 1);
    }
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Please answer all questions");
      return;
    }

    setSubmitting(true);
    try {
      const sessionUserStr = localStorage.getItem("user");
      if (!sessionUserStr) return;
      const sessionUser = JSON.parse(sessionUserStr);

      // Calculate score
      let correctCount = 0;
      questions.forEach((q, idx) => {
        if (answers[idx] === q.correct_option_index) {
          correctCount++;
        }
      });

      const score = Math.round((correctCount / questions.length) * 100);
      const passed = score >= 70; // Hardcoded 70% passing for now

      // Get current attempt number
      const { count } = await supabase
        .from('quiz_attempts')
        .select('*', { count: 'exact', head: true })
        .eq('quiz_id', quizId)
        .eq('user_id', sessionUser.id);

      const attemptNumber = (count || 0) + 1;

      // Save attempt
      const { error: saveError } = await supabase
        .from('quiz_attempts')
        .insert([{
          quiz_id: quizId,
          user_id: sessionUser.id,
          score,
          passed,
          attempt_number: attemptNumber
        }]);

      if (saveError) throw saveError;

      setResult({ score, passed });
      onComplete(score, passed);
    } catch (error: any) {
      toast.error("Error submitting quiz: " + error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>;

  if (questions.length === 0) return <div className="text-center p-10">No questions found for this quiz.</div>;

  if (result) {
    return (
      <div className="text-center space-y-6 py-8">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          {result.passed ? (
            <div className="w-20 h-20 rounded-full bg-success/20 flex items-center justify-center mb-4">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
          ) : (
            <div className="w-20 h-20 rounded-full bg-destructive/20 flex items-center justify-center mb-4">
              <XCircle className="h-12 w-12 text-destructive" />
            </div>
          )}
          <h2 className="text-2xl font-bold">{result.passed ? "Congratulations!" : "Keep Practicing!"}</h2>
          <p className="text-muted-foreground mt-2">You scored {result.score}% in the {moduleTitle} Quiz.</p>
          <div className="mt-6 flex items-center justify-center gap-4">
            <div className="p-4 rounded-xl bg-card border shadow-sm">
              <p className="text-3xl font-bold">{result.score}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Your Score</p>
            </div>
            <div className="p-4 rounded-xl bg-card border shadow-sm">
              <p className="text-3xl font-bold">70%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Passing Score</p>
            </div>
          </div>
        </motion.div>
        <Button onClick={onClose} className="w-full max-w-xs">Return to Module</Button>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="space-y-8 py-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Question {currentQuestionIdx + 1} of {questions.length}</span>
        <div className="h-1.5 w-48 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-primary transition-all duration-300" 
            style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={currentQuestionIdx}
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -20, opacity: 0 }}
          className="space-y-6"
        >
          <h3 className="text-lg font-semibold leading-tight">{currentQ.question_text}</h3>
          
          <RadioGroup 
            value={answers[currentQuestionIdx]?.toString()} 
            onValueChange={(val) => setAnswers({...answers, [currentQuestionIdx]: parseInt(val)})}
            className="space-y-3"
          >
            {currentQ.options.map((option: string, idx: number) => (
              <div 
                key={idx}
                className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer hover:bg-muted/50 ${answers[currentQuestionIdx] === idx ? 'border-primary bg-primary/5 ring-1 ring-primary' : 'border-border'}`}
                onClick={() => setAnswers({...answers, [currentQuestionIdx]: idx})}
              >
                <RadioGroupItem value={idx.toString()} id={`opt-${idx}`} />
                <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium">{option}</Label>
              </div>
            ))}
          </RadioGroup>
        </motion.div>
      </AnimatePresence>

      <div className="flex items-center justify-between pt-4 border-t">
        <Button 
          variant="outline" 
          onClick={handlePrev} 
          disabled={currentQuestionIdx === 0}
        >
          Previous
        </Button>
        
        {currentQuestionIdx === questions.length - 1 ? (
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            className="bg-primary hover:bg-primary/90"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Send className="h-4 w-4 mr-2" />}
            Submit Quiz
          </Button>
        ) : (
          <Button onClick={handleNext}>
            Next Question
          </Button>
        )}
      </div>
    </div>
  );
};

export default QuizPlayer;
