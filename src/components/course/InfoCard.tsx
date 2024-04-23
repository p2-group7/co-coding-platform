"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ClickableCard from "../ui/clickableCard";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { GearIcon } from "@radix-ui/react-icons";

type InfoCardProps = {
  href: string;
  nameShort: string;
  name: string;
};

const InfoCard: React.FC<InfoCardProps> = ({ href, nameShort, name }) => {
  const router = useRouter();
  const handleButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    router.push(href + "/edit");
  };
  return (
    <ClickableCard href={href}>
      <Card className="h-[140px] cursor-pointer rounded-md p-4 shadow-md hover:bg-secondary">
        <CardHeader>
          <div className="flex flex-row">
            <div className="flex flex-1 flex-col">
              <CardTitle>{name}</CardTitle>
              <CardDescription className="truncate">
                {nameShort}
              </CardDescription>
            </div>
            <Button onClick={handleButtonClick}>
              <GearIcon />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </ClickableCard>
  );
};

export default InfoCard;
