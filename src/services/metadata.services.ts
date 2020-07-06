import { SchoolService, CourseService, UserService, ChatService } from ".";
import { Types } from "mongoose";
import { EUserRoles } from "../types";

export default class MetadataService {
    constructor(
        private schoolService: SchoolService,
        private courseService: CourseService,
        private userService: UserService,
        private chatService: ChatService
    ) {}

    async handleNewUserMetadataUpdate(newUser: any) {
        switch (newUser.role) {
            case EUserRoles.SCHOOL_OFFICIAL:
                await this.schoolService.addSchoolOfficialMetadata({
                    schoolOfficialIds: [newUser._id],
                    schoolIds: [newUser.meta.school],
                });
                break;
            case EUserRoles.STUDENT:
                await this.schoolService.addStudentMetadata({
                    studentIds: [newUser._id],
                    schoolIds: [newUser.meta.school],
                });
                break;
        }
    }

    async handleDeletedUserMetadataUpdate(deletedUser: any) {
        const { courses: courseIds, school: schoolId } = deletedUser.meta as {
            courses: Types.ObjectId[];
            school: Types.ObjectId;
        };

        switch (deletedUser.role) {
            case EUserRoles.SCHOOL_OFFICIAL:
                await this.schoolService.removeSchoolOfficialMetadata({
                    schoolOfficialIds: [deletedUser._id],
                    schoolIds: [schoolId],
                });
                break;
            case EUserRoles.STUDENT:
                await this.schoolService.removeStudentMetadata({
                    studentIds: [deletedUser._id],
                    schoolIds: [schoolId],
                });
                if (courseIds.length) {
                    await this.courseService.removeStudentMetadata({
                        studentIds: [deletedUser._id],
                        courseIds,
                    });
                }
                break;
            case EUserRoles.INSTRUCTOR:
                await this.schoolService.removeStudentMetadata({
                    studentIds: [deletedUser._id],
                    schoolIds: [schoolId],
                });
                if (courseIds.length) {
                    await this.courseService.removeInstructorMetadata({
                        instructorIds: [deletedUser._id],
                        courseIds,
                    });
                }
                break;
        }
    }

    async handleNewCourseMetadataUpdate(newCourse: any) {
        const courseId = newCourse._id;
        const {
            instructors: instructorIds,
            school: schoolId,
            students: studentIds,
        } = newCourse.meta as {
            instructors: Types.ObjectId[];
            school: Types.ObjectId;
            students: Types.ObjectId[];
        };
        await Promise.all([
            this.userService.addCourseMetadata({
                userIds: [...instructorIds, ...studentIds],
                courseIds: [courseId],
                roles: [EUserRoles.INSTRUCTOR, EUserRoles.STUDENT],
            }),
            this.schoolService.addCourseMetadata({
                courseIds: [courseId],
                schoolIds: [schoolId],
            }),
        ]);
    }

    async handleDeletedCourseMetadataUpdate(deletedCourse: any) {
        const courseId = deletedCourse._id;
        const {
            instructors: instructorIds,
            school: schoolId,
            students: studentIds,
        } = deletedCourse.meta as {
            instructors: Types.ObjectId[];
            school: Types.ObjectId;
            students: Types.ObjectId[];
        };

        await Promise.all([
            this.userService.removeCourseMetadata({
                userIds: [...instructorIds, ...studentIds],
                courseIds: [courseId],
                roles: [EUserRoles.INSTRUCTOR, EUserRoles.STUDENT],
            }),
            this.schoolService.removeCourseMetadata({
                courseIds: [courseId],
                schoolIds: [schoolId],
            }),
        ]);
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
            roles: [
                EUserRoles.INSTRUCTOR,
                EUserRoles.SCHOOL_OFFICIAL,
                EUserRoles.STUDENT,
            ],
        });
    }

    async handleDeletedChatMetadataUpdate(deletedChat: any) {
        const userIds = deletedChat.meta.users;
        await this.userService.removeChatMetadata({
            chatIds: [deletedChat._id],
            userIds,
            roles: [
                EUserRoles.INSTRUCTOR,
                EUserRoles.SCHOOL_OFFICIAL,
                EUserRoles.STUDENT,
            ],
        });
    }
}
