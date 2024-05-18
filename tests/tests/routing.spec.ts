import { Course } from "@prisma/client";
import { randomInt } from "crypto";
import { test, expect } from "tests/fixtures/base.fixtures";
import prisma from "tests/helpers/prisma";
import { faker } from "@faker-js/faker";

test.describe("Routing and creation of courses, lectures and exercises", () => {
  test("Login and navigate to courses", async ({
    page,
    loginPage,
    user,
    testData,
  }) => {
    await loginPage.goto();
    await loginPage.populateLoginForm(user.username, user.password);
    await loginPage.clickSubmit();

    // check if user is logged in
    await page.waitForURL("/");

    for (const course of testData.courses) {
      await page.locator("text=" + course.name).click();
      await page.waitForURL("/courses/" + course.id.toString());
      await page.goBack();
    }

    await page.waitForURL("/");

    // create new course that should automatically be linked to user
    await page.locator("text=+").click();

    await page.getByLabel("Course name", { exact: true }).fill("New Course");
    await page
      .getByLabel("Course name abbreviated", { exact: true })
      .fill("NC");

    await page.pause();
    await page.locator("button[type='submit']").click();

    await page.locator("text=" + "New Course").click();
    await page.goBack();

    await page.pause();
  });

  test("Navigate to a course and check lecturer and exercises details", async ({
    page,
    loginPage,
    user,
    testData,
  }) => {
    await loginPage.goto();
    await loginPage.populateLoginForm(user.username, user.password);
    await loginPage.clickSubmit();

    // Get random course
    const randomCourse =
      testData.courses[randomInt(0, testData.courses.length)];
    if (!randomCourse) {
      throw new Error("No random course found");
    }
    await page.click("text=" + randomCourse.name);

    const lectures = testData.lectures[randomCourse.id];
    for (const lecture of !lectures ? [] : lectures) {
      await page.locator("text=" + lecture.name).click();
      await page.waitForURL(
        "/courses/" +
          randomCourse.id.toString() +
          "/lectures/" +
          lecture.id.toString(),
      );
      await page.locator("text=" + lecture.description).isVisible();

      const exercises = testData.exercises[lecture.id];
      for (const exercise of !exercises ? [] : exercises) {
        await page.locator("text=" + exercise.name).click();
        await page.waitForURL(
          "/courses/" +
            randomCourse.id.toString() +
            "/lectures/" +
            lecture.id.toString() +
            "/exercises/" +
            exercise.id.toString(),
        );
        await page.locator("text=" + exercise.description).isVisible();
        await page.goBack();
      }

      await page.goBack();
    }
  });

  test("Create course, lecture and exercise", async ({ page, loginPage }) => {
    // create new group
    const group = await prisma.group.create({
      data: { name: "group example", roomId: faker.string.uuid() },
    });

    const username = faker.internet.userName();
    // create random user that has no courses, lectures or exercises
    const user = await prisma.user.create({
      data: {
        username: faker.internet.userName(),
        password: "password123",
        groupId: group.id,
      },
    });

    await loginPage.goto();
    await loginPage.populateLoginForm(user.username, user.password);
    await loginPage.clickSubmit();

    // Create new course that should automatically be linked to user
    await page.locator("text=+").click();

    await page.getByLabel("Course name", { exact: true }).fill("New Course");
    await page
      .getByLabel("Course name abbreviated", { exact: true })
      .fill("NC");

    await page.pause();
    await page.locator("button[type='submit']").click();

    await page.locator("text=" + "New Course").click();

    await page.waitForURL("/courses/**");

    await page.locator("text=+").click();
    await page.getByLabel("Lecture name", { exact: true }).fill("New Lecture");
    await page
      .getByLabel("Lecture description", { exact: true })
      .fill("Lecture Description");

    await page.locator("button[type='submit']").click();

    await page.locator("text=" + "New Lecture").click();

    await page.waitForURL("/courses/**/lectures/**");

    await page.locator("text=Lecture Description").isVisible();

    await page.locator("text=+").click();

    await page
      .getByLabel("Exercise name", { exact: true })
      .fill("New Exercise");
    await page
      .getByLabel("Exercise description", { exact: true })
      .fill("New Exercise Description");

    await page.locator("button[type='submit']").click();

    await page.locator("text=" + "New Exercise").click();

    await page.waitForURL("/courses/**/lectures/**/exercises/**");
    await page.locator("text=New Exercise Description").isVisible();
  });
});
