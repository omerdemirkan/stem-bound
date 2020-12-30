import { Types } from "mongoose";
import {
    EUserRoles,
    ICourse,
    IStudent,
    IUser,
    IInstructor,
    IChat,
    IMetadataService,
    ICourseService,
    IUserService,
    IChatService,
} from "../types";
import { inject, injectable } from "inversify";
import { SERVICE } from "../constants/service.constants";

@injectable()
class MetadataService implements IMetadataService {
    constructor(
        @inject(SERVICE.COURSE_SERVICE) protected courseService: ICourseService,
        @inject(SERVICE.USER_SERVICE) protected userService: IUserService,
        @inject(SERVICE.CHAT_SERVICE) protected chatService: IChatService
    ) {}

    async handleDeletedUserMetadataUpdate(deletedUser: IUser) {
        let promises: Promise<any>[] = [];
        promises.push(
            this.chatService.removeUserMetadata({
                userIds: [deletedUser._id],
                chatIds: deletedUser.meta.chats,
            })
        );
        if (
            deletedUser.role === EUserRoles.STUDENT &&
            (deletedUser as IStudent).meta.courses.length
        )
            promises.push(
                this.courseService.removeStudentMetadata({
                    studentIds: [deletedUser._id],
                    courseIds: (deletedUser as IStudent).meta.courses,
                })
            );
        else if (
            deletedUser.role === EUserRoles.INSTRUCTOR &&
            (deletedUser as IInstructor).meta.courses.length
        )
            promises.push(
                this.courseService.removeInstructorMetadata({
                    instructorIds: [deletedUser._id],
                    courseIds: (deletedUser as IInstructor).meta.courses,
                })
            );
        await Promise.all(promises);
    }

    async handleNewCourseMetadataUpdate(newCourse: ICourse) {
        await this.userService.addCourseMetadata({
            userIds: newCourse.meta.instructors,
            courseIds: [newCourse._id],
            roles: [EUserRoles.INSTRUCTOR],
        });
    }

    async handleDeletedCourseMetadataUpdate(deletedCourse: ICourse) {
        await this.userService.removeCourseMetadata({
            userIds: [
                ...deletedCourse.meta.instructors,
                ...deletedCourse.meta.students,
            ],
            courseIds: [deletedCourse._id],
            roles: [EUserRoles.INSTRUCTOR, EUserRoles.STUDENT],
        });
    }

    async handleCourseEnrollmentMetadataUpdate({
        courseId,
        studentId,
    }: {
        courseId: Types.ObjectId;
        studentId: Types.ObjectId;
    }) {
        await Promise.all([
            this.userService.addCourseMetadata({
                userIds: [studentId],
                courseIds: [courseId],
                roles: [EUserRoles.STUDENT],
            }),
            this.courseService.addStudentMetadata({
                studentIds: [studentId],
                courseIds: [courseId],
            }),
        ]);
    }

    async handleCourseDropMetadataUpdate({
        courseId,
        studentId,
    }: {
        courseId: Types.ObjectId;
        studentId: Types.ObjectId;
    }) {
        await Promise.all([
            this.userService.removeCourseMetadata({
                userIds: [studentId],
                courseIds: [courseId],
                roles: [EUserRoles.STUDENT],
            }),
            this.courseService.removeStudentMetadata({
                studentIds: [studentId],
                courseIds: [courseId],
            }),
        ]);
    }

    async handleNewChatMetadataUpdate(newChat: IChat) {
        const userIds = newChat.meta.users;
        await this.userService.addChatMetadata({
            chatIds: [newChat._id],
            userIds,
        });
    }

    async handleDeletedChatMetadataUpdate(deletedChat: IChat) {
        const userIds = deletedChat.meta.users;
        await this.userService.removeChatMetadata({
            chatIds: [deletedChat._id],
            userIds,
        });
    }
}

export default MetadataService;
