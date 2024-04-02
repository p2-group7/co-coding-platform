import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import ClickableCard from "../ui/clickableCard";

type CourseCardProps = {
  nameShort: string;
  name: string;
};

const CourseCard: React.FC<CourseCardProps> = ({nameShort, name}) => {
  return (
    <ClickableCard href={"/courses/" + nameShort}>
        <Card className="h-[140px] p-4 shadow-md rounded-md cursor-pointer hover:bg-secondary">
        <CardHeader>
            <CardTitle>{nameShort}</CardTitle>
            <CardDescription className="truncate">{name}</CardDescription>
        </CardHeader>
        </Card>
    </ClickableCard>
  )
}

export default CourseCard
