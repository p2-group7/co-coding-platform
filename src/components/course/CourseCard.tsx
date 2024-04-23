import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ClickableCard from "../ui/clickableCard";

type InfoCardProps = {
  href: string;
  nameShort: string;
  name: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ href, nameShort, name }) => {
  return (
    <ClickableCard href={href}>
      <Card className="h-[140px] cursor-pointer rounded-md p-4 shadow-md hover:bg-secondary">
        <CardHeader>
          <CardTitle>{name}</CardTitle>
          <CardDescription className="truncate">{nameShort}</CardDescription>
        </CardHeader>
      </Card>
    </ClickableCard>
  );
};

export default InfoCard;
