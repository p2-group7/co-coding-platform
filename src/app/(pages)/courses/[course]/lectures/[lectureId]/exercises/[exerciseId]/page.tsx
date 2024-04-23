import React from "react";
import Resizable from "@/components/codeSpace/Resizable";

export default async function page({
  params,
}: {
  params: { exerciseId: string };
}) {
  return (
    <div className="m-1 w-screen flex-auto">
      <Resizable exerciseId={Number(params.exerciseId)} />
    </div>
  );
}
