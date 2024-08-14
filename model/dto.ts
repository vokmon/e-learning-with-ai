import { Answer, Assessment, Question } from "./assessment";

export type AssessmentData = Pick<
  Assessment,
  "id" | "title" | "summary" | "createdAt"
>;

export type AssessmentQuestion = Pick<
  Assessment,
  "id" | "title" | "questions" | "instruction" | "writtenQuestion"
>;

export type AssessmentResult = {
  articleId: string;
  articleTitle: string;
  multipleChoiceAnswers: MultipleChoiceAnswer[];
  writtenQuestion: string;
  writtenAnswer: WrittenAnswer;
  overallFeedback: string;
};

export type MultipleChoiceAnswer = {
  question?: Question;
  userAnswer: number;
  isAnswerCorrect: boolean;
  correctAnswer?: Answer;
};

export type WrittenAnswer = {
  userAnswer: string;
  rating: number;
  feedback: string;
};

export type SubmissionAnswer = { [key: string]: string };
