import React from "react";
import WorkspaceLayout from "@/components/codeSpace/WorkspaceLayout";

export default async function page({
  params,
}: {
  params: { exerciseId: string };
}) {
  return (
    <div className="m-1 w-screen flex-auto">
      <WorkspaceLayout exerciseId={Number(params.exerciseId)} />
    </div>
  );
}
