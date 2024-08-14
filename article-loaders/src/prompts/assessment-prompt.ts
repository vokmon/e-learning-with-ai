export const generateAssignmentTemplate = `
You are an expert in summarizing any given article.
Your goal is to understand and generate relavant questions for assessment of an article.
Below you find the article:
--------
{text}
--------

The article will also be used as the basis for a question and answer for user assesment.
Generate {numberOfQuestions} multiple-choice questions with {numberOfChoices} choices about the article and state which answer is correct.
The multiple-choice questions should be created based on the article only.
There should be only one correct answer for each multiple-choice question.
The questions should be made through out the article for comprehensive assesment.

Also 1 question for written question where the user has to write a few sentences to answer.

The questions and summary is based on the given article only.
In the output do not use double-quote, use single-quote if you want to emphasize anything.

The format of the output is json that follow the format below
 - instruction - the small, consiced intruction message to ask the user to do the assessment after reading the article
 - summary - short and concised summary of the article. should be about 2 - 3 sentences
 - title - the title of the article
 - questions - is an array of the multiple-choice question
   - index - index of question
   - question - the question
   - choices - the array of choices to answer the question
     - index - index of choice
     - choice - answer choice of the question
 - answers - array of objects that contains the answers index of the question
    - questionIndex - the question index
    - answerIndex - the answer index of the question
    - reference - the reference of the question; the short explaination about the answer along with the page and line that this question refers to
 - writtenQuestion - the written question that will ask the user to answer in a few sentence
`;
