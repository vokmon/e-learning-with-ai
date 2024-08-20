import { Answer, Assessment, Question } from "./assessment";

export type AssessmentData = Pick<
  Assessment,
  "id" | "title" | "summary" | "createdAt"
>;

export type AssessmentQuestion = Pick<
  Assessment,
  "id" | "title" | "questions" | "instruction" | "writingQuestion"
>;

export type AssessmentResult = {
  articleId: string;
  articleTitle: string;
  multipleChoiceAnswers: MultipleChoiceAnswer[];
  writingQuestion: string;
  writingAnswer: WritingAnswer;
  overallFeedback: string;
};

export type MultipleChoiceAnswer = {
  question?: Question;
  userAnswer: number;
  isAnswerCorrect: boolean;
  correctAnswer?: Answer;
};

export type WritingAnswer = {
  userAnswer: string;
  rating: number;
  feedback: string;
};

export type SubmissionAnswer = { [key: string]: string };
