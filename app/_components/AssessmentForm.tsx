"use client";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { AssessmentQuestion, SubmissionAnswer } from "@/model/dto";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { buildQuestionIndex, useHandleAssessmentForm } from "../hooks/AssessmentFormHooks";

type AssessmentFormProps = {
  assessmentQuestion: AssessmentQuestion;
  onQuestionSubmit: (submittedAnswer: SubmissionAnswer) => void;
  disabled?: boolean;
};

export default function AssessmentForm({
  assessmentQuestion,
  onQuestionSubmit,
  disabled,
}: AssessmentFormProps) {
  const { formKey, form, onSubmit } = useHandleAssessmentForm({
    assessmentQuestion,
    onQuestionSubmit,
  });

  return (
    <div className="flex flex-col justify-center items-center w-full px-5 lg:px-80">
      <div className="">📋 {assessmentQuestion.instruction}</div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 py-5 mt-7 flex flex-col justify-center items-start max-w-[600px]"
        >
          {assessmentQuestion.questions.map((question, index) => (
            <FormField
              key={`question-${question.index}-${formKey}`}
              control={form.control}
              // @ts-ignore
              name={buildQuestionIndex(index)}
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>
                    <span className="font-bold">{index + 1}.</span>{" "}
                    {question.question}
                  </FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                      disabled={disabled}
                    >
                      {question.choices.map((choice) => (
                        <FormItem
                          className="flex items-center space-x-3 space-y-0"
                          key={choice.index}
                        >
                          <FormControl>
                            <RadioGroupItem value={choice.index.toString()} />
                          </FormControl>
                          <FormLabel className="font-normal">
                            {choice.choice}
                          </FormLabel>
                        </FormItem>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}

          <FormField
            control={form.control}
            // @ts-ignore
            name="writingAnswer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{assessmentQuestion.writingQuestion} 📝</FormLabel>
                <FormControl>
                  <Textarea
                    rows={10}
                    placeholder="Type your answer here"
                    {...field}
                    disabled={disabled}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={disabled} className="text-base mt-10 self-center">
            Submit Answer ➡️
          </Button>
        </form>
      </Form>
    </div>
  );
}
