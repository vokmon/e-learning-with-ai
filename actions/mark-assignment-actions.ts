"use server";

import { getChain } from "@/article-loaders/src/utils/chain";
import { Answer, Assessment, Question } from "@/model/assessment";
import {
  AssessmentResult,
  MultipleChoiceAnswer,
  SubmissionAnswer,
  WrittenAnswer,
} from "@/model/dto";
import { markWrittenAnswerPrompt, overallFeedbackPrompt } from "@/prompts/assignment-prompts";
import { getDataById } from "@/utils/firebase.ts/firestore";
import { getFileBlob, getFileUrl } from "@/utils/firebase.ts/storage";
import { getPdfDocument } from "@/utils/pdf-loaders";
import { JsonOutputParser } from "@langchain/core/output_parsers";

const collection = process.env.FIREBASE_ARTICLE_ASSESSMENT_COLLECTION!;

export async function markAssignment(
  articleId: string,
  answers: SubmissionAnswer
): Promise<AssessmentResult> {
  const assessment = await getDataById(collection, articleId);
  const multipleChoiceAnswers = markMultipleChoices(assessment, answers);
  const writtenAnswer = await markWrittenQuestion(assessment, answers);

  const overallFeedback = await generateOverallFeedback(multipleChoiceAnswers, writtenAnswer);

  const result: AssessmentResult = {
    articleId,
    articleTitle: assessment.title,
    multipleChoiceAnswers,
    writtenQuestion: assessment.writtenQuestion,
    writtenAnswer: { ...writtenAnswer, userAnswer: answers["writtenAnswer"] },
    overallFeedback,
  };

  return result;
}

function markMultipleChoices(
  assessment: Assessment,
  answers: SubmissionAnswer
) {
  const questionsMap = buildQuestionMap(assessment.questions);
  const answersMap = buildAnswerMap(assessment.answers);

  const multipleChoiceAnswers = Object.keys(answers)
    .filter((key) => key.startsWith("question-"))
    .map((key): MultipleChoiceAnswer => {
      const questionIndex = extractNumber(key);
      if (questionIndex === null) {
        return {
          userAnswer: Number(key),
          isAnswerCorrect: false,
        };
      }

      const question = questionsMap.get(questionIndex);
      const correctAnswer = answersMap.get(questionIndex);

      if (question === null || correctAnswer === null) {
        return {
          userAnswer: questionIndex,
          isAnswerCorrect: false,
        };
      }

      const userAnswer = Number(answers[key]);
      const isAnswerCorrect = correctAnswer?.answerIndex === userAnswer;

      const result: MultipleChoiceAnswer = {
        question,
        userAnswer,
        isAnswerCorrect,
        correctAnswer: correctAnswer,
      };

      return result;
    });

  return multipleChoiceAnswers;
}

async function markWrittenQuestion(
  assessment: Assessment,
  answers: SubmissionAnswer
) {
  const blob = await getFileBlob(assessment.path);
  const content = await getPdfDocument(blob);

  const markAnswerChain = await getChain(
    markWrittenAnswerPrompt,
    new JsonOutputParser()
  );
  const result = await markAnswerChain.invoke({
    article: content,
    question: assessment.writtenQuestion,
    answer: answers["writtenAnswer"],
  });
  return result as WrittenAnswer;
}

async function generateOverallFeedback(
  multipleChoiceAnswers: MultipleChoiceAnswer[],
  writtenAnswer: WrittenAnswer
) {
  const numberOfQuestions = String(multipleChoiceAnswers.length);
  const numberOfCorrect = String(multipleChoiceAnswers.filter((answer) => answer.isAnswerCorrect).length);
  const feedback = writtenAnswer.feedback
  const rating = String(writtenAnswer.rating);

  const overallFeedbackChain = await getChain(
    overallFeedbackPrompt
  );

  const result = await overallFeedbackChain.invoke({
    numberOfQuestions,
    numberOfCorrect,
    feedback,
    rating,
  });
  return result as string;
}

function extractNumber(str: string) {
  const parts = str.split("-");
  return parts.length > 1 ? parseInt(parts[parts.length - 1]) : null;
}

function buildQuestionMap(questions: Question[]): Map<number, Question> {
  return questions.reduce((map, question) => {
    map.set(question.index, question);
    return map;
  }, new Map<number, Question>());
}

function buildAnswerMap(answers: Answer[]): Map<number, Answer> {
  return answers.reduce((map, answer) => {
    map.set(answer.questionIndex, answer);
    return map;
  }, new Map<number, Answer>());
}
