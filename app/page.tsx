import Spinner from "@/components/ui/spinner";
import AssessmentList from "./_components/AssessmentList";
import { Suspense } from "react";
import Header from "@/components/ui/nav/header";

export default function Home({
  assessmentlist,
}: Readonly<{
  assessmentlist: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-5 gap-2">
      <Header />
      <section className="px-0 lg:px-52 flex flex-col gap-10 my-10">
        <Suspense fallback={<Spinner />}>
          <AssessmentList />
        </Suspense>
      </section>
    </main>
  );
}
