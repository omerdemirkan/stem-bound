import { Types } from "mongoose";
import config from "../config";
import {
    hydrateCoursePublishedHtmlTemplate,
    hydrateSignUpHtmlTemplate,
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
        emailHtml = await hydrateSignUpHtmlTemplate({
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
    const course = await courseService.findCourseById(courseId),
        school = await schoolService.findSchoolByNcesId(course.meta.school),
        schoolOfficials = await userService.findUsers({
            filter: {
                role: EUserRoles.SCHOOL_OFFICIAL,
                "meta.school": school.ncesid,
            },
        });

    await emailService.send({
        html: await hydrateCoursePublishedHtmlTemplate({
            courseName: course.title,
            schoolName: school.name,
            url: `https://${config.clientDomain}/app/courses/${course._id}`,
        }),
        subject: "New course published!",
        to: schoolOfficials.map((user) => user.email),
        inline: require.resolve("../../public/assets/stem-bound-logo.png"),
    });
}
