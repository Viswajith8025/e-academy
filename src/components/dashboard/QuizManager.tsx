import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Trash2, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";


interface QuizQuestion {
  id?: string;
  question_text: string;
  options: string[];
  correct_option_index: number;
}

interface QuizManagerProps {
  moduleId: string;
  moduleTitle: string;
  onClose: () => void;
}

const QuizManager = ({ moduleId, moduleTitle, onClose }: QuizManagerProps) => {
  const [quiz, setQuiz] = useState<any>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // New question form state
  const [newQuestion, setNewQuestion] = useState<QuizQuestion>({
    question_text: "",
    options: ["", "", "", ""],
    correct_option_index: 0
  });

  useEffect(() => {
    fetchQuiz();
  }, [moduleId]);

  const fetchQuiz = async () => {
    setLoading(true);
    try {
      // Get or create quiz for this module
      let { data: quizData, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('module_id', moduleId)
        .maybeSingle();

      if (!quizData) {
        const { data: newQuiz, error: createError } = await supabase
          .from('quizzes')
          .insert([{ module_id: moduleId, title: `${moduleTitle} Quiz` }])
          .select()
          .single();
        
        if (createError) throw createError;
        if (!newQuiz) throw new Error("Failed to create quiz record");
        quizData = newQuiz;
      }

      setQuiz(quizData);


      // Get questions
      const { data: questionsData, error: qError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('quiz_id', quizData.id)
        .order('created_at', { ascending: true });

      if (qError) throw qError;
      setQuestions(questionsData || []);
    } catch (error: any) {
      toast.error("Error fetching quiz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!newQuestion.question_text.trim()) {
      toast.error("Question text is required");
      return;
    }
    if (newQuestion.options.some(opt => !opt.trim())) {
      toast.error("All options must be filled");
      return;
    }

    setSaving(true);
    try {
      if (!quiz || !quiz.id) {
        throw new Error("Quiz ID not found. Please refresh and try again.");
      }

      const { data, error } = await supabase
        .from('quiz_questions')
        .insert([{
          quiz_id: quiz.id,
          question_text: newQuestion.question_text,

          options: newQuestion.options,
          correct_option_index: newQuestion.correct_option_index
        }])
        .select()
        .single();

      if (error) throw error;

      setQuestions([...questions, data]);
      setNewQuestion({
        question_text: "",
        options: ["", "", "", ""],
        correct_option_index: 0
      });
      toast.success("Question added");
    } catch (error: any) {
      toast.error("Error adding question: " + error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('quiz_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(questions.filter(q => q.id !== id));
      toast.success("Question deleted");
    } catch (error: any) {
      toast.error("Error deleting question: " + error.message);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin h-8 w-8" /></div>;

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <div className="space-y-4 border p-4 rounded-lg bg-muted/20">
        <h3 className="font-semibold text-sm">Add New Question</h3>
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Question Text</Label>
            <Input 
              value={newQuestion.question_text}
              onChange={(e) => setNewQuestion({...newQuestion, question_text: e.target.value})}
              placeholder="Enter question..."
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {newQuestion.options.map((opt, idx) => (
              <div key={idx} className="space-y-1.5">
                <Label className="flex justify-between">
                  Option {idx + 1}
                  <span 
                    className={`text-[10px] cursor-pointer px-1.5 rounded ${newQuestion.correct_option_index === idx ? 'bg-success text-white' : 'bg-muted'}`}
                    onClick={() => setNewQuestion({...newQuestion, correct_option_index: idx})}
                  >
                    {newQuestion.correct_option_index === idx ? 'Correct' : 'Mark Correct'}
                  </span>
                </Label>
                <Input 
                  value={opt}
                  onChange={(e) => {
                    const newOpts = [...newQuestion.options];
                    newOpts[idx] = e.target.value;
                    setNewQuestion({...newQuestion, options: newOpts});
                  }}
                  placeholder={`Option ${idx + 1}`}
                />
              </div>
            ))}
          </div>
          <Button className="w-full mt-2" onClick={handleAddQuestion} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
            Add Question
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="font-semibold text-sm flex items-center justify-between">
          Existing Questions
          <Badge variant="outline">{questions.length}</Badge>
        </h3>
        {questions.length === 0 ? (
          <p className="text-center py-6 text-muted-foreground text-sm border rounded-lg border-dashed">No questions added yet.</p>
        ) : (
          <div className="space-y-3">
            {questions.map((q, qIdx) => (
              <div key={q.id} className="p-4 border rounded-lg bg-card group relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive"
                  onClick={() => q.id && handleDeleteQuestion(q.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
                <p className="font-medium text-sm pr-8">{qIdx + 1}. {q.question_text}</p>
                <div className="grid grid-cols-2 gap-2 mt-3">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className={`text-xs p-2 rounded flex items-center gap-2 ${q.correct_option_index === oIdx ? 'bg-success/10 border border-success/30' : 'bg-muted/50 border border-transparent'}`}>
                      {q.correct_option_index === oIdx ? <CheckCircle2 className="h-3 w-3 text-success" /> : <div className="h-3 w-3" />}
                      <span className={q.correct_option_index === oIdx ? 'text-success font-medium' : 'text-muted-foreground'}>{opt}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizManager;
