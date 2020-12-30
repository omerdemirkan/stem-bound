import * as models from "../models";
import { EModels } from "../types";

const modelsByKey = {
    [EModels.CHAT]: models.Chat,
    [EModels.COURSE]: models.Course,
    [EModels.INSTRUCTOR]: models.Instructor,
    [EModels.LOCATION]: models.Location,
    [EModels.MAILING_LIST_SUBSCRIBER]: models.MailingListSubscriber,
    [EModels.SCHOOL]: models.School,
    [EModels.SCHOOL_OFFICIAL]: models.SchoolOfficial,
    [EModels.STUDENT]: models.Student,
    [EModels.USER]: models.User,
    [EModels.MESSAGE]: models.Message,
};

export function model(modelKey: EModels) {
    return function (target: any, key: string | symbol) {
        Object.defineProperty(target, key, {
            value: modelsByKey[modelKey],
        });
    };
}
