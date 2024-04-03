import React from "react";

export default async function page({
  params,
}: {
  params: { lectureId: string };
}) {
  return (
    <div className="container mx-auto px-1">
      <span>Some lecture info here for {params.lectureId}</span>
    </div>
  );
}
