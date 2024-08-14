import { getAssessmentById } from "@/actions/assessment-actions";
import AssessmentAndResult from "@/app/_components/AssessmentAndResult";
import React from "react";

export default async function Page({ params: { id } }: { params: { id: string } }) {
  const assessmentQuestion = await getAssessmentById(id);

  return (
    <div className="flex justify-center items-center mt-5">
      <AssessmentAndResult assessmentQuestion={assessmentQuestion} articleId={id}/>
    </div>
  );
}
