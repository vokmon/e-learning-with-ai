export type AssessmentFromLlm = {
  instruction: string;
  summary: string;
  title: string;
  questions: Question[];
  answers: Answer[];
  writtenQuestion: string;
}

export type Assessment = {
  id: string;
  fileName: string;
  path: string,
  createdAt: Date;
} & AssessmentFromLlm;

export type Question = {
  index: number;
  question: string;
  choices: Choice[];
}

export type Choice = {
  index: number;
  choice: string;
}

export type Answer = {
  questionIndex: number;
  answerIndex: number;
  reference: string;
}
