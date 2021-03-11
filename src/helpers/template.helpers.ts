import { promises } from "fs";
import inlineCSS from "inline-css";

const { readFile } = promises;

async function inlineStyles(html) {
    return await inlineCSS(html, { url: "https://stembound.education" });
}

export async function hydrateHTML(
    filepath: string,
    variables: { [key: string]: string }
) {
    const htmlString = (await readFile(filepath)).toString();
    let i = 0,
        j = htmlString.indexOf("{{"),
        stringBuilder = [];
    while (j !== -1) {
        stringBuilder.push(htmlString.substring(i, j));
        i = j + 2;
        j = htmlString.indexOf("}}", i);
        const variable = htmlString.substring(i, j).trim();
        stringBuilder.push(variables[variable]);
        i = j + 2;
        j = htmlString.indexOf("{{", i);
    }
    stringBuilder.push(htmlString.substring(i));

    return stringBuilder.join("");
}

export async function hydrateSignUpTemplate(variables: {
    firstName: string;
    url: string;
}) {
    return await inlineStyles(
        await hydrateHTML(
            require.resolve("../../public/templates/sign-up-email.html"),
            variables
        )
    );
}

export async function hydrateCoursePublishedTemplate(variables: {
    courseName: string;
    schoolName: string;
    url: string;
}) {
    return await inlineStyles(
        await hydrateHTML(
            require.resolve("../../public/templates/course-published.html"),
            variables
        )
    );
}

export async function hydrateCourseVerifiedStudentTemplate(variables: {
    courseName: string;
    schoolName: string;
    url: string;
}) {
    return await inlineStyles(
        await hydrateHTML(
            require.resolve(
                "../../public/templates/course-verified-student.html"
            ),
            variables
        )
    );
}

export async function hydrateCourseVerifiedInstructorTemplate(variables: {
    courseName: string;
    schoolName: string;
    url: string;
}) {
    return await inlineStyles(
        await hydrateHTML(
            require.resolve(
                "../../public/templates/course-verified-instructor.html"
            ),
            variables
        )
    );
}

export async function hydrateCourseDismissedTemplate(variables: {
    courseName: string;
    schoolName: string;
    url: string;
}) {
    return await inlineStyles(
        await hydrateHTML(
            require.resolve("../../public/templates/course-dismissed.html"),
            variables
        )
    );
}

export async function hydrateCourseInstructorInvitationTemplate(variables: {
    inviterName: string;
    schoolName: string;
    courseName: string;
    url: string;
}) {
    return await inlineStyles(
        await hydrateHTML(
            require.resolve("../../public/templates/course-dismissed.html"),
            variables
        )
    );
}
