import type { MarkedQuestion } from "../../../../../types/Quiz/Question";
import type { MarkedQuiz } from "../../../../../types/Quiz/Quiz";
import type {
  AnalysedResult,
  AnalysedSkill,
  AnalysedSubtopics,
  AnalysedTopics,
} from "../../../../../types/Quiz/Result";
import type {
  Skill,
  SubTopic,
  Topic,
} from "../../../../../types/Subject/Subject";
import { uiSafeResult, type UISafeReturn } from "../../../common/safeReturn";

const analyseQuiz = (markedQuiz: MarkedQuiz): UISafeReturn<AnalysedResult> => {
  const topicsAnalysed = analyseResultsBasedOnTopic(markedQuiz.questions);

  const subtopicsAnalysed = analyseBasedOnSubTopics(markedQuiz.questions);

  const skillAnalysed = analyseBasedOnSkills(markedQuiz.questions);

  // TODO: multiple subjects?
  const subject = markedQuiz.questions[0].subject;

  return uiSafeResult({
    topics: topicsAnalysed,
    subtopics: subtopicsAnalysed,
    skills: skillAnalysed,
    totalNumberOfQuestions: markedQuiz.numberOfQuestions,
    totalNumberOfCorrectAnswers: markedQuiz.numberOfCorrectAnswers,
    subject: subject,
  } satisfies AnalysedResult);
};

const analyseResultsBasedOnTopic = (markedQuestionsList: MarkedQuestion[]) => {
  const numberOfQuestionsByTopic: Map<Topic, number> = new Map();
  const numberOfCorrectAnswersByTopic: Map<Topic, number> = new Map();

  markedQuestionsList.forEach((question) => {
    const topic = question.topic;

    numberOfQuestionsByTopic.set(
      topic,
      (numberOfQuestionsByTopic.get(topic) ?? 0) + 1
    );

    if (question.markedCorrect) {
      numberOfCorrectAnswersByTopic.set(
        topic,
        (numberOfCorrectAnswersByTopic.get(topic) ?? 0) + 1
      );
    } else {
      numberOfCorrectAnswersByTopic.set(
        topic,
        numberOfCorrectAnswersByTopic.get(topic) ?? 0
      );
    }
  });

  const topicsAnalysed: AnalysedTopics[] = [];

  for (const t of numberOfQuestionsByTopic.keys()) {
    const topic = t as Topic;

    topicsAnalysed.push({
      topic: topic as Topic,
      numberOfCorrectAnswers: numberOfCorrectAnswersByTopic.get(topic) ?? 0,
      numberOfQuestions: numberOfQuestionsByTopic.get(topic) ?? 0,
    } satisfies AnalysedTopics);
  }

  return topicsAnalysed;
};

const analyseBasedOnSubTopics = (markedQuestionsList: MarkedQuestion[]) => {
  const numberOfQuestionsBySubtopic: Map<SubTopic, number> = new Map();
  const numberOfCorrectAnswersBySubtopic: Map<SubTopic, number> = new Map();

  markedQuestionsList.forEach((question) => {
    question.subtopics?.forEach((subtopic) => {
      numberOfQuestionsBySubtopic.set(
        subtopic,
        (numberOfQuestionsBySubtopic.get(subtopic) ?? 0) + 1
      );

      if (question.markedCorrect) {
        numberOfCorrectAnswersBySubtopic.set(
          subtopic,
          (numberOfCorrectAnswersBySubtopic.get(subtopic) ?? 0) + 1
        );
      } else {
        numberOfCorrectAnswersBySubtopic.set(
          subtopic,
          numberOfCorrectAnswersBySubtopic.get(subtopic) ?? 0
        );
      }
    });
  });

  const subtopicsAnalysed: AnalysedSubtopics[] = [];
  for (const s of numberOfQuestionsBySubtopic.keys()) {
    const subtopic = s as SubTopic;

    subtopicsAnalysed.push({
      subtopic: subtopic as SubTopic,
      numberOfCorrectAnswers:
        numberOfCorrectAnswersBySubtopic.get(subtopic) ?? 0,
      numberOfQuestions: numberOfQuestionsBySubtopic.get(subtopic) ?? 0,
    } satisfies AnalysedSubtopics);
  }

  return subtopicsAnalysed;
};

const analyseBasedOnSkills = (markedQuestionsList: MarkedQuestion[]) => {
  const numberOfQuestionsBySkill: Map<Skill, number> = new Map();
  const numberOfCorrectAnswersBySkill: Map<Skill, number> = new Map();

  markedQuestionsList.forEach((question) => {
    question.skills?.forEach((skill) => {
      numberOfQuestionsBySkill.set(
        skill,
        (numberOfQuestionsBySkill.get(skill) ?? 0) + 1
      );

      if (question.markedCorrect) {
        numberOfCorrectAnswersBySkill.set(
          skill,
          (numberOfCorrectAnswersBySkill.get(skill) ?? 0) + 1
        );
      } else {
        numberOfCorrectAnswersBySkill.set(
          skill,
          numberOfCorrectAnswersBySkill.get(skill) ?? 0
        );
      }
    });
  });

  const analysedSkills: AnalysedSkill[] = [];
  for (const s of numberOfQuestionsBySkill.keys()) {
    const skill = s as Skill;

    analysedSkills.push({
      skill: skill as Skill,
      numberOfCorrectAnswers: numberOfCorrectAnswersBySkill.get(skill) ?? 0,
      numberOfQuestions: numberOfQuestionsBySkill.get(skill) ?? 0,
    } satisfies AnalysedSkill);
  }

  return analysedSkills;
};

export default analyseQuiz;
