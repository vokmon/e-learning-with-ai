"use server";

import { AssessmentData, AssessmentQuestion, AssessmentResult } from "@/model/dto";
import { getData, getDataById } from "@/utils/firebase.ts/firestore";
import { getFileUrl } from "@/utils/firebase.ts/storage";

const collection = process.env.FIREBASE_ARTICLE_ASSESSMENT_COLLECTION!;

export async function getAssessmentData(): Promise<AssessmentData[]> {
  const list = await getData(collection);
  const result = list.map((data) => ({
    id: data.id,
    title: data.title,
    summary: data.summary,
    createdAt: data.createdAt,
  }));
  return result;
}

export async function getAssessmentPdfLink(id: string): Promise<string> {
  const assessment = await getDataById(collection, id);
  const url = await getFileUrl(assessment.path);
  return url;
}

export async function getAssessmentById(id: string): Promise<AssessmentQuestion> {
  const assessment = await getDataById(collection, id);
  const result: AssessmentQuestion = {
    id: assessment.id,
    title: assessment.title,
    questions: assessment.questions,
    instruction: assessment.instruction,
    writingQuestion: assessment.writingQuestion,
  }
  return result;
}