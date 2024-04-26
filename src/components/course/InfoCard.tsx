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

// Define props for the InfoCard component
type InfoCardProps = {
  href: string;
  cardDescription: string;
  cardTitle: string;
};

// CSS is not dynamic and breaks when description is too long, thefore we trunicate it to not break the design
const truncateDescription = (description: string) => {
  if (description.length > 11) {
    return description.slice(0, 11) + "...";
  }
  return description;
};

// Body of InfoCard component
const InfoCard: React.FC<InfoCardProps> = ({ href, cardDescription, cardTitle }) => {
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
              <CardTitle>{cardTitle}</CardTitle> {/* Title of the card */}
              <CardDescription className="truncate">
                {truncateDescription(cardDescription)} {/* (Trunicated) Description of the card */}
              </CardDescription>
            </div>
            <Button onClick={handleButtonClick}> {/* Button to edit the card */}
              <GearIcon />
            </Button>
          </div>
        </CardHeader>
      </Card>
    </ClickableCard>
  );
};

export default InfoCard;

