import { Service } from 'typedi';
import InstructorService from '../user/instructor/instructor.services';
import SchoolOfficialService from '../user/school-official/school-official.services';
import { UserRolesEnum } from '../../config/types.config';
import StudentService from '../user/student/student.services';
import { JwtService } from '../../services';

@Service()
export default class AuthService {
    constructor(
        private studentService: StudentService,
        private instructorService: InstructorService,
        private schoolOfficialService: SchoolOfficialService,
        private jwtService: JwtService
    ) { }

    async userSignUp({ role, userData }: {
        role: UserRolesEnum,
        userData: object
    }): Promise<{ accessToken: string, user: any }> {
        let user;
        switch (role) {
            case UserRolesEnum.INSTRUCTOR:
                user = await this.instructorService.createInstructor(userData);
                break;
            case UserRolesEnum.SCHOOL_OFFICIAL:
                user = await this.schoolOfficialService.createSchoolOfficial(userData);
                break;
            case UserRolesEnum.STUDENT:
                user = await this.studentService.createStudent(userData);
                break;
            default:
                throw new Error('Invalid role.')
        }

        const accessToken = this.jwtService.sign({
            role,
            user
        })

        return {
            accessToken,
            user
        }
    }
}