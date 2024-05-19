import { Course, Exercise, Lecture } from "@prisma/client";
import { randomInt } from "crypto";
import { test, expect } from "tests/fixtures/base.fixtures";
import prisma from "tests/helpers/prisma";
import { LoginPage } from "tests/pages/login.page";

test.describe("Collaborative coding area", () => {
  test("Coding area single user", async ({
    page,
    loginPage,
    user,
    testData,
  }) => {
    await loginPage.goto();
    await loginPage.populateLoginForm(user.username, user.password);
    await loginPage.clickSubmit();
    const course = testData.courses[0] as Course;
    await page.locator("text=" + course?.name).click();

    const lecture = testData.lectures[course?.id]?.[0] as Lecture;
    await page.locator("text=" + lecture?.name).click();

    const exercise = testData.exercises[lecture?.id]?.[0];
    await page.locator("text=" + exercise?.name).click();
    await page.locator("text=Loading").isHidden({ timeout: 70000 }); // wait for the textbox to appear, since it is hidden by default
    await page.getByRole("textbox").locator("div").click();

    await page
      .getByRole("textbox")
      .fill(
        '#include <stdio.h>\nint main() {\n    int num1 = 10;\n\n int num2=32;\n\n int sum = num1 + num2;\n    printf("%d\\n", sum);\n    return 0;\n}',
      );

    await page.getByRole("button").nth(2).click(); // click the run button

    // Wait for the output to appear and verify it
    await page.getByTestId("test").waitFor({ state: "visible" });
    await expect(page.getByTestId("test")).toHaveText("42");
  });

  test("Collaborative coding area 2 users", async ({ browser, testData }) => {
    const context1 = await browser.newContext();
    const context2 = await browser.newContext();

    const page1 = await context1.newPage();
    const page2 = await context2.newPage();

    const loginPage1 = new LoginPage(page1);
    const loginPage2 = new LoginPage(page2);

    await loginPage1.goto();
    await loginPage1.populateLoginForm(
      testData.users[0]?.username ?? "",
      testData.users[0]?.password ?? "",
    );
    await loginPage1.clickSubmit();

    await loginPage2.goto();
    await loginPage2.populateLoginForm(
      testData.users[1]?.username ?? "",
      testData.users[1]?.password ?? "",
    );
    await loginPage2.clickSubmit();

    const course = testData.courses[0] as Course;
    const lecture = testData.lectures[course.id]?.[0] as Lecture;
    const exercise = testData.exercises[lecture.id]?.[0] as Exercise;
    // User 1 navigates to the exercise page
    await page1.locator("text=" + course.name).click();
    await page1.locator("text=" + lecture.name).click();
    await page1.locator("text=" + exercise.name).click();
    await page1.locator("text=Loading").isHidden({ timeout: 70000 }); // wait for the textbox to appear, since it is hidden by default

    // User 2 navigates to the exercise page
    await page2.locator("text=" + course.name).click();
    await page2.locator("text=" + lecture.name).click();
    await page2.locator("text=" + exercise.name).click();
    await page2.locator("text=Loading").isHidden({ timeout: 70000 }); // wait for the textbox to appear, since it is hidden by default

    // User 1 types in the code edito
    await page1
      .getByRole("textbox")
      .fill(
        '#include <stdio.h>\nint main() {\n    int num1 = 10;\n\n int num2=32;\n\n    printf("%d\\n", sum);\n    return 0;\n}',
      );

    await page2.locator("text=32;").click();
    await page2.keyboard.press("Enter");
    await page2.keyboard.press("Enter");
    await page2.keyboard.insertText("int sum = num1 + num2;\n");

    await page1.getByRole("button").nth(2).click(); // click the run button

    await page1.locator("text=42;").isVisible();

    // Close contexts
    await context1.close();
    await context2.close();
  });

  test("Verify test execution results", async ({
    page,
    user,
    loginPage,
    testData,
  }) => {
    await loginPage.goto();
    await loginPage.populateLoginForm(user.username, user.password);
    await loginPage.clickSubmit();
    const course = testData.courses[0] as Course;
    const lecture = testData.lectures[course?.id]?.[0] as Lecture;
    const exercise = testData.exercises[lecture?.id]?.[0];

    // Create a test for the exercise with random integers as input and output
    const randomNumberOfIntegers = randomInt(4, 15);
    const randomIntegers = Array.from({ length: randomNumberOfIntegers }, () =>
      randomInt(1, 100),
    );
    const input = randomIntegers.join(" ");
    const output = randomIntegers.reduce((a, b) => a + b, 0);

    const test = await prisma.test.create({
      data: {
        name: "Summation test",
        exerciseId: exercise?.id ?? 0,
        input: input,
        output: output.toString(),
      },
    });
    // go to exercise page
    await page.locator("text=" + course?.name).click();
    await page.locator("text=" + lecture?.name).click();
    await page.locator("text=" + exercise?.name).click();
    await page.locator("text=Loading").isHidden({ timeout: 70000 }); // wait for the textbox to appear, since it is hidden by default
    await page.getByRole("textbox").locator("div").click();

    await page
      .getByRole("textbox")
      .fill(
        '#include <stdio.h>\nint main() {\n    int x, sum = 0, temp;\n    scanf("%d", &x);\n    for (int i = 0; i < x; i++) {\n        scanf("%d", &temp);\n        sum += temp;\n    }\n    printf("%d\\n", sum);\n    return 0;\n}',
      );
    // run test
    await page
      .getByTestId(test.id.toString())
      .getByTestId("test-button")
      .click();
    // wait for the test to finish
    // check if the output is correct
    await page.locator("text=" + output.toString()).isVisible();
  });
});
