import { gradeWrittenCard } from "./utilities";

test("gradeCard - prefect sentence'", () => {
  const sentence = `I am a sentence.`;
  const inputText = `I am a sentence.`;

  const { data } = gradeWrittenCard({ sentence, inputText });

  expect(data.grade).toBe(5);
})


test("gradeCard - one new extra word '", () => {
  const sentence = `I am a sentence.`;
  const inputText = `I am a sentence two.`;

  const { data } = gradeWrittenCard({ sentence, inputText });

  expect(data.grade).toBe(4);
})

test("gradeCard - one new extra word '", () => {
  const sentence = `I am a sentence two with two words.`;
  const inputText = `I am a sentence two two`;

  const { data } = gradeWrittenCard({ sentence, inputText });

  expect(data.grade).toBe(3);
})

test("gradeCard - spelling mistake but perfect score", () => {
  const sentence = `He ran after the thief`;
  const inputText = `He ran adter the thief`;

  const { data } = gradeWrittenCard({ sentence, inputText });

  expect(data.grade).toBe(5);
})

test("gradeCard - completely wrong", () => {
  const sentence = `ramon barked ans chased the thief burglar out of the backyard and down the street making sure he would not return`;
  const inputText = `ramon barked ans chased the thief out of the backyard and down the street making sure that he would not return`;

  const { data } = gradeWrittenCard({ sentence, inputText });

  expect(data.grade).toBe(3);
})


