import PdfDisplay from "@/app/_components/PdfDisplay";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import Link from "next/link";
import { Suspense } from "react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  return (
    <Suspense fallback={<Spinner />}>
      <PdfDisplay assessmentId={id} />
      <br />
      <div className="flex justify-center py-5">
        <Link href={`${id}/assessment`}>
          <Button>Start Assessment</Button>
        </Link>
      </div>
    </Suspense>
  );
}
