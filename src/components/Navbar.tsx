"use client";
import * as React from "react";
import { cn } from "@/lib/utils";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

const menuComponents: { title: string; href: string; description: string }[] = [
  {
    title: "Main Page / Login",
    href: "/",
    description: "",
  },
  {
    title: "Sign Out",
    href: "/signout",
    description: "",
  },
];

export interface GroupInfo {
  id: number;
  name: string;
  href: string;
}

export function NavigationMenuDemo({ groups }: { groups: GroupInfo[] }) {
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem className="w-22 h-11">
            <NavigationMenuTrigger className="h-full w-full select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              Menu
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[600px] ">
                {menuComponents.map((component) => (
                  <ListItem
                    key={component.title}
                    title={component.title}
                    href={component.href}
                  ></ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-25 h-11">
            <NavigationMenuTrigger className="h-full w-full select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              Courses
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                      href="/courses"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">
                        Your Courses
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Have fun 😎
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <ListItem href="/courses/IMPR" title="IMPR">
                  Imperative Programming
                </ListItem>
                <ListItem href="/docs/installation" title="ALG">
                  Algorithms and Data Structures
                </ListItem>
                <ListItem href="/docs/primitives/typography" title="SLIAL">
                  hell
                </ListItem>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>

          <NavigationMenuItem className="w-25 h-11">
            <NavigationMenuTrigger className="h-full w-full select-none justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md">
              Groups
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[300px] gap-3 p-4 md:w-[400px] md:grid-cols-2 lg:w-[600px] ">
                {groups.map((group) => (
                  <ListItem
                    key={group.id}
                    title={group.name}
                    href={group.href}
                  ></ListItem>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";

export default NavigationMenuDemo;
