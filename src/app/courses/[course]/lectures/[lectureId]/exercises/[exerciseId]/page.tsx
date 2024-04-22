import React from "react";
import Resizable from "@/components/codeSpace/Resizable";

export default async function page({
  params,
}: {
  params: { exerciseId: string };
}) {
  return (
    <div className="m-1 h-screen w-screen">
      <Resizable exerciseId={Number(params.exerciseId)} />
    </div>
  );
}
