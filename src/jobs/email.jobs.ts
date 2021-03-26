import { Types } from "mongoose";
import config from "../config";
import { stemBoundTeamEmails } from "../constants";
import {
    hydrateCourseDismissedTemplate,
    hydrateCourseInstructorInvitationTemplate,
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
import {
    EUserRoles,
    IInstructorInvitationTokenPayload,
    IUser,
    IContactData,
} from "../types";

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

export async function sendCourseDismissedEmails(courseId: Types.ObjectId) {
    const course = await courseService.findCourseById(courseId);
    const [school, instructors] = await Promise.all([
        schoolService.findSchoolByNcesId(course.meta.school),
        userService.findUsersByIds(course.meta.instructors),
    ]);

    await emailService.send({
        html: await hydrateCourseDismissedTemplate({
            courseName: course.title,
            schoolName: school.name,
            url: `https://${config.clientDomain}/app/courses/${course._id}`,
        }),
        subject: "Your Course was Dismissed.",
        to: instructors.map((user) => user.email),
        inline: require.resolve("../../public/assets/stem-bound-logo.png"),
    });
}

export async function sendCourseInstructorInvitationEmail({
    invitedId,
    inviterId,
    courseId,
    schoolId,
}: {
    invitedId: Types.ObjectId;
    inviterId: Types.ObjectId;
    courseId: Types.ObjectId;
    schoolId: string;
}) {
    const [course, school, users] = await Promise.all([
        courseService.findCourseById(courseId),
        schoolService.findSchoolByNcesId(schoolId),
        userService.findUsersByIds([invitedId, inviterId]),
    ]);
    const inviter = users.find((u) => inviterId.equals(u._id)),
        invited = users.find((u) => invitedId.equals(u._id));

    const invitationTokenPayload: IInstructorInvitationTokenPayload = {
        from: inviterId.toHexString(),
        to: invitedId.toHexString(),
    };
    const invitationToken = jwtService.sign(invitationTokenPayload);

    await emailService.send({
        html: await hydrateCourseInstructorInvitationTemplate({
            courseName: course.title,
            inviterName: `${inviter.firstName} ${inviter.lastName}`,
            schoolName: school.name,
            url: `https://${config.clientDomain}/app/courses/${
                course._id
            }/instructor-invitation?invitation_token=${invitationToken}&inviter_id=${inviterId.toHexString()}`,
        }),
        subject: "Course instructor invitation!",
        to: invited.email,
        inline: require.resolve("../../public/assets/stem-bound-logo.png"),
    });
}

export async function sendContactUsEmails(
    contactData: IContactData,
    emails = stemBoundTeamEmails
) {
    await emailService.send({
        subject: "STEM-bound contact",
        text: `From: ${contactData.email}\n\nMessage: ${contactData.message}`,
        to: emails,
    });
}
