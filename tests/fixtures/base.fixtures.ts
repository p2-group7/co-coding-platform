import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

import prisma from "../helpers/prisma";
import { faker } from "@faker-js/faker";
import { Course } from "@prisma/client";

type BaseFixtures = {
  loginPage: LoginPage;
  user: User;
};

type User = {
  username: string;
  password: string;
  groupId: number;
};

export const test = base.extend<BaseFixtures>({
  // TODO remove?
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },
  user: async ({}, use) => {
    const username = faker.internet.userName();
    const password = faker.internet.password();

    const group = await prisma.group.create({
      data: { name: "group1", roomId: "room1" },
    });
    const groupId = group.id;

    const user = await prisma.user.create({
      data: { username, password, groupId },
    });

    await use({ username, password, groupId });
  },
});

export { expect } from "@playwright/test";
