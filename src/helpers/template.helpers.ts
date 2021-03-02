import { promises } from "fs";
import inlineCSS from "inline-css";

const { readFile } = promises;

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

export async function hydrateSignUpHtmlTemplate(variables: {
    firstName: string;
    url: string;
}) {
    return await inlineCSS(
        await hydrateHTML(
            require.resolve("../../public/templates/sign-up-email.html"),
            variables
        ),
        { url: "https://stembound.education" }
    );
}

export async function hydrateCoursePublishedHtmlTemplate(variables: {
    courseName: string;
    schoolName: string;
    url: string;
}) {
    return await inlineCSS(
        await hydrateHTML(
            require.resolve("../../public/templates/course-published.html"),
            variables
        ),
        { url: "https://stembound.education" }
    );
}

export async function hydrateCourseVerifiedHtmlTemplate(variables: {
    courseName: string;
    schoolName: string;
    url: string;
}) {
    return await inlineCSS(
        await hydrateHTML(
            require.resolve("../../public/templates/course-published.html"),
            variables
        ),
        { url: "https://stembound.education" }
    );
}
