import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dayjs from "dayjs";
import { backendEndpoint } from "../../../../types/endpoints";
import type { AnalysedResult } from "../../../../types/Quiz/Result";
import {
  type Skill,
  type Subject,
  type SubTopic,
  type Topic,
} from "../../../../types/Subject/Subject";
import { PageHeader } from "../../components/kiseki/PageHeader";
import { generateStudyPlan } from "./GenerateStudyPlan";
import StudyCard from "./StudyCard";

const dateFormat = "DD MMM YYYY";
const today = dayjs();

export type ToStudy = {
  subject: Subject;
  topic: Topic;
  subtopic: SubTopic;
  skill: Skill;
};

function StudyPlan() {
  const maxTopicPerDay = 2;

  const {
    data: results,
    isError,
    isPending,
  } = useQuery({
    queryKey: ["results"],
    queryFn: async () => {
      const response = await axios.get(`${backendEndpoint.getStudentResult}`);
      return response.data as AnalysedResult[];
    },
  });

  const toStudys: ToStudy[] | undefined = results && generateStudyPlan(results);

  return (
    <>
      <PageHeader className="pb-4">Study Plan</PageHeader>
      {isError && <>Failed to get your results. Please reload the page :)</>}

      {!toStudys && !isPending && <p>There is nothing for you to study!</p>}

      {isPending && <p>Loading your results...</p>}

      {toStudys && (
        <div key={today.format(dateFormat)} className="w-fit">
          <h3></h3>
          <div className="flex flex-col gap-4">
            {toStudys.slice(0, maxTopicPerDay).map((toStudy) => {
              return (
                <StudyCard
                  subject={toStudy.subject}
                  topic={toStudy.topic}
                  subtopic={toStudy.subtopic}
                  skill={toStudy.skill}
                />
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default StudyPlan;
