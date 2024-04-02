import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ClickableCard from "../ui/clickableCard";

const CourseCreatorCard = () => {
  return (
    <ClickableCard href={"/courses/add"}>
      <Card className="flex h-[140px] cursor-pointer items-center justify-center rounded-md p-4 shadow-md hover:bg-slate-600">
        <div className="plus-sign h-16 w-16 items-center justify-center rounded-full bg-slate-500 p-3 text-center text-white">
          <span className="text-3xl font-bold">+</span>
        </div>
      </Card>
    </ClickableCard>
  );
};

export default CourseCreatorCard;
