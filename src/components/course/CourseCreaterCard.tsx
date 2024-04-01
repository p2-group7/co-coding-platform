import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ClickableCard from "../ui/clickableCard";

const CourseCreatorCard = () => {
  return (
    <ClickableCard href={"/courses/add"}>
        <Card className="h-[140px] p-4 shadow-md rounded-md cursor-pointer hover:bg-slate-600 flex items-center justify-center">
          <div className="plus-sign bg-slate-500 text-white rounded-full w-16 h-16 items-center text-center justify-center p-2">
            <span className="text-3xl font-bold">+</span>
          </div>
        </Card>
    </ClickableCard>
  )
}

export default CourseCreatorCard
