import { Types } from "mongoose";
import config from "../config";
import {
    hydrateCoursePublishedTemplate,
    hydrateCourseVerifiedInstructorTemplate,
    hydrateCourseVerifiedStudentTemplate,
    hydrateSignUpTemplate,
} from "../helpers";
import {
    courseService,
    emailService,
    jwtService,
    schoolService,
    userService,
} from "../services";
import { EUserRoles, IUser } from "../types";

export async function sendSignUpEmail(userData: Partial<IUser>) {
    const signUpToken = jwtService.sign(userData),
        signUpUrl = `https://${config.clientDomain}/sign-up?sign_up_token=${signUpToken}`,
        emailHtml = await hydrateSignUpTemplate({
            firstName: userData.firstName,
            url: signUpUrl,
        });
    await emailService.send({
        to: userData.email,
        html: emailHtml,
        subject: "Verify your email",
        inline: require.resolve("../../public/assets/stem-bound-logo.png"),
    });
}

export async function sendCoursePublishedEmails(courseId: Types.ObjectId) {
    const course = await courseService.findCourseById(courseId);
    const [school, schoolOfficials] = await Promise.all([
        schoolService.findSchoolByNcesId(course.meta.school),
        userService.findUsersBySchoolNcesId(course.meta.school, {
            role: EUserRoles.SCHOOL_OFFICIAL,
        }),
    ]);

    await emailService.send({
        html: await hydrateCoursePublishedTemplate({
            courseName: course.title,
            schoolName: school.name,
            url: `https://${config.clientDomain}/app/courses/${course._id}`,
        }),
        subject: "New course published!",
        to: schoolOfficials.map((user) => user.email),
        inline: require.resolve("../../public/assets/stem-bound-logo.png"),
    });
}

export async function sendCourseVerifiedEmails(courseId: Types.ObjectId) {
    const course = await courseService.findCourseById(courseId);
    const [school, students, instructors] = await Promise.all([
        schoolService.findSchoolByNcesId(course.meta.school),
        userService.findUsersBySchoolNcesId(course.meta.school, {
            role: EUserRoles.STUDENT,
        }),
        userService.findUsersByIds(course.meta.instructors),
    ]);

    const [studentHtml, instructorHtml] = await Promise.all([
        hydrateCourseVerifiedStudentTemplate({
            courseName: course.title,
            schoolName: school.name,
            url: `https://${config.clientDomain}/app/my-school`,
        }),
        hydrateCourseVerifiedInstructorTemplate({
            courseName: course.title,
            schoolName: school.name,
            url: `https://${config.clientDomain}/app/courses/${course._id}`,
        }),
    ]);

    await Promise.all([
        emailService.send({
            html: studentHtml,
            subject: "New Course Available!",
            to: students.map((student) => student.email),
            inline: require.resolve("../../public/assets/stem-bound-logo.png"),
        }),
        emailService.send({
            html: instructorHtml,
            subject: "Your Course was Verified!",
            to: instructors.map((student) => student.email),
            inline: require.resolve("../../public/assets/stem-bound-logo.png"),
        }),
    ]);
}
