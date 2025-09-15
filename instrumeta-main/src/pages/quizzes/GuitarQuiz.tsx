import React, { useState, useEffect } from 'react';
import { Layout } from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { Guitar, AlertCircle, CheckCircle, XCircle, ArrowRight, RotateCcw, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
}

// Guitar quiz questions
const guitarQuestions: QuizQuestion[] = [
  {
    question: "How many strings does a standard guitar have?",
    options: ["4", "6", "8", "12"],
    answer: "6"
  },
  {
    question: "What is the thickest string on the guitar called?",
    options: ["High E", "G", "Low E", "A"],
    answer: "Low E"
  },
  {
    question: "What part of the guitar do you use to change the pitch by pressing down the strings?",
    options: ["Bridge", "Frets", "Pickguard", "Tuner"],
    answer: "Frets"
  },
  {
    question: "Which hand is usually used to strum the guitar (for right-handed players)?",
    options: ["Left", "Right"],
    answer: "Right"
  },
  {
    question: "What is the wooden body of the guitar called?",
    options: ["Headstock", "Neck", "Soundhole", "Body"],
    answer: "Body"
  },
  {
    question: "Which of these is NOT a type of guitar?",
    options: ["Acoustic", "Electric", "Trumpet", "Bass"],
    answer: "Trumpet"
  },
  {
    question: "What is the name of the small tool used to pluck the strings?",
    options: ["Stick", "Pick", "Clip", "Plug"],
    answer: "Pick"
  },
  {
    question: "What is the standard tuning for the guitar from lowest to highest string?",
    options: ["E A D G B E", "A D G B E A", "C D E F G A", "E F G A B C"],
    answer: "E A D G B E"
  },
  {
    question: "What do we call the vertical metal strips on the guitar neck?",
    options: ["Frets", "Strings", "Tuners", "Plugs"],
    answer: "Frets"
  },
  {
    question: "Which of these is a basic open chord?",
    options: ["G", "F#m7b5", "Cdim", "Bbmaj7"],
    answer: "G"
  }
];

const GuitarQuiz = () => {
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [score, setScore] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState<{question: number, isCorrect: boolean, selectedAnswer: string}[]>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  
  const currentQuestion = guitarQuestions[currentQuestionIndex];
  
  const progress = (currentQuestionIndex / guitarQuestions.length) * 100;
  
  const handleSelectAnswer = (answer: string) => {
    if (showAnswer) return;
    setSelectedAnswer(answer);
  };
  
  const handleCheckAnswer = () => {
    if (!selectedAnswer) return;
    
    const isCorrect = selectedAnswer === currentQuestion.answer;
    if (isCorrect) {
      setScore(score + 1);
    }
    
    setAnsweredQuestions([
      ...answeredQuestions,
      {
        question: currentQuestionIndex,
        isCorrect,
        selectedAnswer: selectedAnswer
      }
    ]);
    
    setShowAnswer(true);
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < guitarQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setQuizComplete(true);
    }
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setScore(0);
    setAnsweredQuestions([]);
    setQuizComplete(false);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="flex items-center space-x-2 mb-6">
          <Guitar className="h-6 w-6 text-amber-500" />
          <h1 className="text-3xl font-bold">Guitar Quiz</h1>
        </div>
        
        {!quizComplete ? (
          <>
            <div className="mb-8">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>Question {currentQuestionIndex + 1} of {guitarQuestions.length}</span>
                <span>Score: {score}/{currentQuestionIndex}</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <Button
                      key={index}
                      variant={selectedAnswer === option 
                        ? (showAnswer 
                          ? (option === currentQuestion.answer ? "default" : "destructive") 
                          : "default") 
                        : (showAnswer && option === currentQuestion.answer ? "default" : "outline")}
                      className={`w-full justify-start h-auto py-4 px-4 text-left ${
                        showAnswer && option === currentQuestion.answer ? "bg-green-500 hover:bg-green-600" : ""
                      }`}
                      onClick={() => handleSelectAnswer(option)}
                      disabled={showAnswer}
                    >
                      <div className="flex items-center">
                        {showAnswer && option === currentQuestion.answer && (
                          <CheckCircle className="h-5 w-5 mr-2 text-white" />
                        )}
                        {showAnswer && selectedAnswer === option && option !== currentQuestion.answer && (
                          <XCircle className="h-5 w-5 mr-2" />
                        )}
                        <span className="mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                      </div>
                    </Button>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                {!showAnswer ? (
                  <Button 
                    onClick={handleCheckAnswer} 
                    disabled={!selectedAnswer}
                    className="ml-auto"
                  >
                    Check Answer
                  </Button>
                ) : (
                  <Button 
                    onClick={handleNextQuestion} 
                    className="ml-auto bg-blue-500 hover:bg-blue-600"
                  >
                    {currentQuestionIndex < guitarQuestions.length - 1 ? (
                      <>Next Question <ArrowRight className="ml-2 h-4 w-4" /></>
                    ) : (
                      "Finish Quiz"
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {showAnswer && (
              <Alert variant={selectedAnswer === currentQuestion.answer ? "default" : "destructive"}>
                {selectedAnswer === currentQuestion.answer ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertTitle>
                  {selectedAnswer === currentQuestion.answer ? "Correct!" : "Incorrect!"}
                </AlertTitle>
                <AlertDescription>
                  {selectedAnswer === currentQuestion.answer 
                    ? "Great job! You selected the right answer." 
                    : `The correct answer is: ${currentQuestion.answer}`}
                </AlertDescription>
              </Alert>
            )}
          </>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Quiz Complete!</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <div className="inline-flex h-24 w-24 rounded-full bg-green-100 items-center justify-center mb-4">
                  <Award className="h-12 w-12 text-green-600" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Your Score</h2>
                <div className="text-5xl font-bold mb-6 text-music-purple">{score}/{guitarQuestions.length}</div>
                <p className="text-muted-foreground">
                  {score === guitarQuestions.length 
                    ? "Perfect! You're a guitar master!" 
                    : score >= guitarQuestions.length * 0.7 
                      ? "Great job! You know a lot about guitars!" 
                      : "Keep practicing and learning about guitars!"}
                </p>
              </div>
              
              <div className="mt-8">
                <h3 className="font-bold text-lg mb-4">Questions Review</h3>
                <div className="space-y-4">
                  {answeredQuestions.map((answer, index) => (
                    <div key={index} className={`p-3 rounded-lg ${answer.isCorrect ? 'bg-green-50' : 'bg-red-50'}`}>
                      <div className="flex items-start">
                        <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center mr-3 ${answer.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                          {answer.isCorrect ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : (
                            <XCircle className="h-4 w-4" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium">{guitarQuestions[answer.question].question}</p>
                          <div className="mt-1 text-sm">
                            <p>
                              <span className="text-muted-foreground">Your answer: </span>
                              <span className={answer.isCorrect ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
                                {answer.selectedAnswer}
                              </span>
                            </p>
                            {!answer.isCorrect && (
                              <p>
                                <span className="text-muted-foreground">Correct answer: </span>
                                <span className="text-green-600 font-medium">{guitarQuestions[answer.question].answer}</span>
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={() => navigate('/quiz')}>
                Back to Quizzes
              </Button>
              <Button onClick={handleRestartQuiz}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Restart Quiz
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GuitarQuiz;
