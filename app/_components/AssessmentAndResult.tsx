"use client";
import { AssessmentQuestion, SubmissionAnswer } from "@/model/dto";
import AssessmentForm from "./AssessmentForm";
import AssessmentSubmissionResult from "./AssessmentSubmissionResult";
import { useAssignmentSubmission } from "../hooks/AssessmentFormHooks";
import { useRef } from "react";

type AssessmentAndResultProps = {
  assessmentQuestion: AssessmentQuestion;
  articleId: string;
};

export default function AssessmentAndResult({
  assessmentQuestion,
  articleId,
}: AssessmentAndResultProps) {
  const assessmentSubmissionResultRef = useRef<HTMLDivElement>(null);

  const { assessmentResults, onQuestionSubmit, pending } =
    useAssignmentSubmission(articleId);

  const handleOnQuestionSubmit = async (data: SubmissionAnswer) => {
    await onQuestionSubmit(data);
    setTimeout(() => {
      if (assessmentSubmissionResultRef.current) {
        assessmentSubmissionResultRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };
  return (
    <div className="flex flex-col justify-center items-center mt-5">
      <AssessmentForm
        assessmentQuestion={assessmentQuestion}
        onQuestionSubmit={handleOnQuestionSubmit}
        disabled={pending}
      />
      {pending && <div className="mt-5">Checking your answers ...</div>}

      <AssessmentSubmissionResult
        ref={assessmentSubmissionResultRef}
        assessmentResults={assessmentResults}
      />
    </div>
  );
}
