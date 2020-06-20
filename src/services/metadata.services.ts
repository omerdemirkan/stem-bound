import { SchoolService, CourseService, UserService } from ".";
import { Types } from "mongoose";
import { EUserRoles } from "../types";

export default class MetadataService {
    constructor(
        private schoolService: SchoolService,
        private courseService: CourseService,
        private userService: UserService
    ) {}

    async handleNewUserMetadataUpdate(newUser: any) {
        switch (newUser.role) {
            case EUserRoles.SCHOOL_OFFICIAL:
                await this.schoolService.addSchoolOfficialMetadata({
                    schoolOfficialId: newUser._id,
                    schoolId: newUser.meta.school,
                });
                break;
            case EUserRoles.STUDENT:
                await this.schoolService.addStudentMetadata({
                    studentId: newUser._id,
                    schoolId: newUser.meta.school,
                });
                break;
        }
    }

    async handleDeletedUserMetadataChange(deletedUser: any) {
        const { courses: courseIds, school: schoolId } = deletedUser.meta;
        switch (deletedUser.role) {
            case EUserRoles.SCHOOL_OFFICIAL:
                await this.schoolService.removeSchoolOfficialMetadata({
                    schoolOfficialId: deletedUser._id,
                    schoolId,
                });
                break;
            case EUserRoles.STUDENT:
                await this.schoolService.removeStudentMetadata({
                    studentId: deletedUser._id,
                    schoolId,
                });
                if (courseIds.length) {
                    await this.courseService.removeStudentMetadataFromMany({
                        studentId: deletedUser._id,
                        courseIds,
                    });
                }
                break;
            case EUserRoles.INSTRUCTOR:
                if (courseIds.length) {
                    await this.courseService.removeInstructorMetadataFromMany({
                        instructorId: deletedUser._id,
                        courseIds,
                    });
                }
                break;
        }
    }
}
