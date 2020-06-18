import { EUserRoles } from '../types';
import { 
    JwtService, 
    BcryptService, 
    SchoolService ,
    SchoolOfficialService,
    StudentService,
    InstructorService
} from '.';
import { Types } from 'mongoose';

const { ObjectId } = Types;

export default class AuthService {
    constructor(
        private jwtService: JwtService,
        private bcryptService: BcryptService,
        private studentService: StudentService,
        private instructorService: InstructorService,
        private schoolOfficialService: SchoolOfficialService,
        private schoolService: SchoolService
    ) { }

    async userSignUp({ role, userData }: {
        role: EUserRoles,
        userData: object
    }): Promise<{ accessToken: string, user: any }> {

        await this.bcryptService.removePasswordAndInsertHash(userData);

        let user: any;
        switch (role) {
            case EUserRoles.INSTRUCTOR:

                user = await this.instructorService.createInstructor(userData);
                break;
            case EUserRoles.SCHOOL_OFFICIAL:

                user = await this.schoolOfficialService.createSchoolOfficial(userData);
                await this.schoolService.addSchoolOfficialMetadata({
                    schoolId: user.meta.school,
                    schoolOfficialId: user._id
                })
                break;
            case EUserRoles.STUDENT:

                user = await this.studentService.createStudent(userData);
                await this.schoolService.addStudentMetadata({
                    studentId: user._id,
                    schoolId: user.meta.school
                })
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

    async userLogin({ role, email, password }: {
        role: EUserRoles,
        email: string,
        password: string
    }): Promise<{ accessToken: string, user: any } | undefined> {

        let user: any = await this.getUserByEmail({ email, role });

        if (await this.bcryptService.compare(password, user.hash)) {
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

    async getUserById({ id, role }: {
        id: Types.ObjectId,
        role: EUserRoles
    }) {
        let user;

        switch (role) {
            case EUserRoles.INSTRUCTOR:
                user = await this.instructorService.findInstructorById(id);
                break;
            case EUserRoles.SCHOOL_OFFICIAL:
                user = await this.schoolOfficialService.findSchoolOfficialById(id);
                break;
            case EUserRoles.STUDENT:
                user = await this.studentService.findStudentById(id);
                break;
            default:
                throw new Error('Invalid role.')
        }
        return user;
    }

    async getUserByEmail({ email, role }: {
        email: string,
        role: EUserRoles
    }) {
        let user;

        switch (role) {
            case EUserRoles.INSTRUCTOR:
                user = await this.instructorService.findInstructorByEmail(email);
                break;
            case EUserRoles.SCHOOL_OFFICIAL:
                user = await this.schoolOfficialService.findSchoolOfficialByEmail(email);
                break;
            case EUserRoles.STUDENT:
                user = await this.studentService.findStudentByEmail(email);
                break;
            default:
                throw new Error('Invalid role.')
        }
        return user;
    }
}