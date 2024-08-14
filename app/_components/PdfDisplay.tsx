import { getAssessmentPdfLink } from "@/actions/assessment-actions";
import React from "react";

type PdfDisplayProps = {
  assessmentId: string;
};

export default async function PdfDisplay({ assessmentId }: PdfDisplayProps) {
  const url = await getAssessmentPdfLink(assessmentId);
  return <iframe className="w-full h-full" src={url}></iframe>;
}
