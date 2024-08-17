import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AssessmentResult, MultipleChoiceAnswer } from "@/model/dto";
import React, { forwardRef } from "react";

type AssessmentSubmissionResultProps = {
  assessmentResults: AssessmentResult[];
};

const getAnswerChoice = (answer: MultipleChoiceAnswer, choiceIndex: number) => {
  const selectedAnswer = answer.question?.choices.find(
    (choice) => choice.index === choiceIndex
  );
  return selectedAnswer?.choice;
};

const AssessmentSubmissionResult = forwardRef<HTMLDivElement, AssessmentSubmissionResultProps>(({assessmentResults}, ref) => {
  if (!assessmentResults || assessmentResults.length === 0) {
    return null;
  }

  return (
    <div ref={ref} className="w-full max-w-3xl mx-auto space-y-6">
      {assessmentResults.map((result, index) => (
        <Accordion type="single" collapsible key={index} defaultValue={`item-${assessmentResults.length - 1}`}>
          <AccordionItem value={`item-${index}`}>
            <AccordionTrigger>
              {assessmentResults.length - index}. Assessment Result for Article {result.articleTitle}
            </AccordionTrigger>
            <AccordionContent>
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Multiple Choice Questions
                        <span className="ml-2 text-indigo-900">{result.multipleChoiceAnswers.filter((answer) => answer.isAnswerCorrect).length }/{result.multipleChoiceAnswers.length}</span>
                      </h3>
                      {result.multipleChoiceAnswers.map(
                        (answer, answerIndex) => (
                          <div key={answerIndex} className="mb-4">
                            <p className="font-medium">
                              {answerIndex + 1}. {answer.question?.question}
                            </p>
                            <div className="flex items-center mt-1">
                              <span className="mr-2 font-semibold">
                                Your answer:
                              </span>
                              <span>
                                {answer.isAnswerCorrect ? "✅" : "❌"}
                                &nbsp;&nbsp;
                                {getAnswerChoice(answer, answer.userAnswer)}
                              </span>
                            </div>
                            {!answer.isAnswerCorrect &&
                              answer.correctAnswer && (
                                <p className="text-md text-foreground mt-1">
                                  <span className="mr-2 font-semibold">
                                    Correct answer:
                                  </span>
                                  {getAnswerChoice(answer, answer.correctAnswer.answerIndex)}
                                </p>
                              )}

                            <p className="text-md text-foreground mt-1">
                              <span className="mr-2 font-semibold">
                                Explanation:
                              </span>
                              {answer.correctAnswer?.reference}
                            </p>
                          </div>
                        )
                      )}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Written Question
                      </h3>
                      <p className="mb-2">{result.writtenQuestion}</p>
                      <div className="bg-muted p-3 rounded-md">
                        <p className="font-medium">Your Answer:</p>
                        <p className="mt-1">{result.writtenAnswer.userAnswer}</p>
                      </div>
                      <div className="mt-2">
                        <p className="font-medium">
                          Score: <span className="text-lg text-indigo-900">{result.writtenAnswer.rating}/10</span>
                        </p>
                        <p className="text-md mt-1 text-foreground">
                          {result.writtenAnswer.feedback}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    <div>
                      <h3 className="text-lg font-semibold mb-2">
                        Overall Feedback
                      </h3>
                      <p>{result.overallFeedback}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ))}
    </div>
  );;
});

AssessmentSubmissionResult.displayName = 'AssessmentSubmissionResult';
export default AssessmentSubmissionResult;
