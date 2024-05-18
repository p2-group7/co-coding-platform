import { test as base } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

import prisma from "../helpers/prisma";
import { faker } from "@faker-js/faker";
import { Course, Exercise, Lecture, UsersOnCourses } from "@prisma/client";
import { randomInt } from "crypto";

type TestData = {
  courses: Course[];
  //users: User[];
  lectures: Record<number, Lecture[]>;
  exercises: Record<number, Exercise[]>;
  usersOnCourses: UsersOnCourses[];
};

type BaseFixtures = {
  loginPage: LoginPage;
  user: User;
  testData: TestData;
};

type User = {
  id: number;
  username: string;
  password: string;
  groupId: number;
};

let baseUser: User;

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

    const id = user.id;

    baseUser = user;

    await use({ id, username, password, groupId });
  },
  testData: async ({ user }, use) => {
    const courseNumber = randomInt(1, 10);
    let courses: Course[] = [];

    for (let i = 0; i < courseNumber; i++) {
      const course = await prisma.course.create({
        data: { name: faker.string.alpha(8), abrev: faker.string.alpha(2) },
      });
      courses.push(course);
    }

    let courseLecturers: Record<number, Lecture[]> = {};
    let lecturesExercises: Record<number, Exercise[]> = {};
    for (const course of courses) {
      const lectureNumber = randomInt(1, 10); // random number of lectures per course
      let lectures: Lecture[] = [];

      for (let j = 0; j < lectureNumber; j++) {
        const lecture = await prisma.lecture.create({
          data: {
            name: "lecture-" + faker.string.alpha(4),
            courseId: course.id,
            description: faker.lorem.paragraph(3),
          },
        });
        lectures.push(lecture);
      }
      courseLecturers[course.id] = lectures;

      for (const lecture of lectures) {
        const exerciseNumber = randomInt(1, 10); // random number of exercises per course
        let exercises: Exercise[] = [];

        for (let j = 0; j < exerciseNumber; j++) {
          const exercise = await prisma.exercise.create({
            data: {
              name: "exercise-" + faker.string.alpha(4),
              lectureId: lecture.id,
            },
          });
          exercises.push(exercise);
        }
        lecturesExercises[lecture.id] = exercises;
      }
    }

    let usersOnCourses: UsersOnCourses[] = [];
    for (const course of courses) {
      // assign users to courses
      const usersOnCourse = await prisma.usersOnCourses.create({
        data: { userId: user.id, courseId: course.id },
      });
      usersOnCourses.push(usersOnCourse);
    }

    // TODO possibly add random users and assign them to courses

    await use({
      courses,
      lectures: courseLecturers,
      exercises: lecturesExercises,
      usersOnCourses,
    });
  },
});

const modelNames = Object.keys(prisma).filter(
  (key) => !["_", "$"].includes(key[0] as string),
);

/*
// Delete all records in the database before tests start
test.beforeAll(async () => {
  console.log("Deleting all records in the database...");
  for (const modelName of modelNames) {
    try {
      // @ts-expect-error https://github.com/prisma/docs/issues/451
      await prisma[modelName].deleteMany();
    } catch (error) {
      console.log("Error deleting all " + modelName + " records:", error);
    }
  }
});*/

export { expect } from "@playwright/test";
