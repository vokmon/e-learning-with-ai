import * as z from "zod";
import {
  AssessmentQuestion,
  AssessmentResult,
  SubmissionAnswer,
} from "@/model/dto";
import { zodResolver } from "@hookform/resolvers/zod";
import { useActionState, useState } from "react";
import { useForm } from "react-hook-form";
import { markAssignment } from "@/actions/mark-assignment-actions";

export const useHandleAssessmentForm = ({
  assessmentQuestion,
  onQuestionSubmit,
}: {
  assessmentQuestion: AssessmentQuestion;
  onQuestionSubmit: (submittedAnswer: SubmissionAnswer) => void;
}) => {
  const [formKey, setFormKey] = useState(0);
  const assessmentQuestionSchema = createQuizSchema(assessmentQuestion);

  const form = useForm({
    resolver: zodResolver(assessmentQuestionSchema),
    // defaultValues: getDefaultValues(assessmentQuestion),
  });

  const onSubmit = async (data: SubmissionAnswer) => {
    const result = await onQuestionSubmit(data);
    form.reset(getDefaultValues(assessmentQuestion));

    // Need to reset the ui rendering of the radio buttons.
    // The data is reset but the ui does not, so use the key technic to forch the component to rerender
    setFormKey((p) => p + 1);

    return result;
  };

  return {
    formKey,
    form,
    onSubmit,
  };
};

export const useAssignmentSubmission = (articleId: string) => {
  const [pending, setPending] = useState(false);

  const onQuestionSubmit = async (data: SubmissionAnswer): Promise<void> => {
    setPending(true);
    const result = await markAssignment(articleId, data);
    setAssessmentResults((previsouState) => [result, ...previsouState]);
    setPending(false);
  };

  const [assessmentResults, setAssessmentResults] = useState<
    AssessmentResult[]
  >([]);

  

  return {
    assessmentResults,
    onQuestionSubmit,
    pending,
  };
};

// Create a dynamic Zod schema based on the quiz data
const createQuizSchema = (assessmentQuestion: AssessmentQuestion) => {
  const schemaFields: { [key: string]: ReturnType<typeof z.string> } = {};

  assessmentQuestion.questions.forEach((_, index) => {
    schemaFields[buildQuestionIndex(index)] = z.string({
      required_error: "Please select an answer for this question.",
    });
  });

  schemaFields.writtenAnswer = z
    .string({
      required_error: "Please provide an answer for the written question.",
    })
    .min(1, "Your answer cannot be empty.");

  return z.object(schemaFields);
};

export const buildQuestionIndex = (index: number) => `question-${index}`

function getDefaultValues(assessmentQuestion: AssessmentQuestion) {
  return assessmentQuestion.questions.reduce(
    (acc, _, index) => {
      //@ts-ignore
      acc[buildQuestionIndex(index)] = undefined;
      return acc;
    },
    { writtenAnswer: "" }
  );
}
