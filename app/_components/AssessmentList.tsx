import { getAssessmentData } from "@/actions/assessment-actions";
import { Button } from "@/components/ui/button";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Timestamp } from "firebase/firestore";
import Link from "next/link";

export default async function AssessmentList() {
  const assesments = await getAssessmentData();

  return (
    <>
      {assesments.map((data) => (
        <Card key={data.id}>
          <CardHeader>
            <CardTitle>{data.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{data.summary}</p>
          </CardContent>
          <CardFooter className="flex flex-col justify-between items-start xl:flex-row ">
            <p>
              {(data.createdAt as unknown as Timestamp)
                .toDate()
                .toLocaleString()}
            </p>
            <Link href={`/articles/${data.id}`}><Button>Start Reading</Button></Link>
          </CardFooter>
        </Card>
      ))}
    </>
  );
}
