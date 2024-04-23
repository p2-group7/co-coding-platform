import { AlertCircle } from "lucide-react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AlertDestructive({
  error,
  description,
}: {
  error: string;
  description: string;
}) {
  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{error}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}
