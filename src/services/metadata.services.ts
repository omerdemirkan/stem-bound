import { SchoolService, CourseService, UserService, ChatService } from ".";
import { Types } from "mongoose";
import { EUserRoles, ICourse, IStudent, IUser, IInstructor } from "../types";

export default class MetadataService {
    constructor(
        private schoolService: SchoolService,
        private courseService: CourseService,
        private userService: UserService,
        private chatService: ChatService
    ) {}

    async handleDeletedUserMetadataUpdate(deletedUser: IUser) {
        if (
            deletedUser.role === EUserRoles.STUDENT &&
            (deletedUser as IStudent).meta.courses.length
        )
            await this.courseService.removeStudentMetadata({
                studentIds: [deletedUser._id],
                courseIds: (deletedUser as IStudent).meta.courses,
            });
        else if (
            deletedUser.role === EUserRoles.INSTRUCTOR &&
            (deletedUser as IInstructor).meta.courses.length
        )
            await this.courseService.removeInstructorMetadata({
                instructorIds: [deletedUser._id],
                courseIds: (deletedUser as IInstructor).meta.courses,
            });
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

    async handleNewChatMetadataUpdate(newChat: any) {
        const userIds = newChat.meta.users;
        await this.userService.addChatMetadata({
            chatIds: [newChat._id],
            userIds,
        });
    }

    async handleDeletedChatMetadataUpdate(deletedChat: any) {
        const userIds = deletedChat.meta.users;
        await this.userService.removeChatMetadata({
            chatIds: [deletedChat._id],
            userIds,
        });
    }
}
