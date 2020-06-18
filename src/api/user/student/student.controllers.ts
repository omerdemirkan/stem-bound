import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { 
    studentService,
    errorParser,
    schoolService,
    courseService
} from '../../../services';

const { ObjectId } = Types

export async function createStudent(req: Request, res: Response) {
    try {
        const newStudent = req.body;
        const user: any = await studentService.createStudent(newStudent);
        await schoolService.addStudentMetadata({
            studentId: user._id,
            schoolId: user.meta.school
        })
        
        res.json({
            message: '',
            data: { user }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function getStudents(req: Request, res: Response) {
    try {
        const data = await studentService.findStudents()
        res.json({
            message: '',
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function getStudentById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await studentService.findStudentById(id)
        res.json({
            message: '',
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function updateStudentById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newStudent = req.body;
        const data = await studentService.updateStudentById(id, newStudent);

        res.json({
            message: '',
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function deleteStudentById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const user: any = await studentService.deleteStudentById(id)
            
        await schoolService.removeStudentMetadata({
            studentId: id,
            schoolId: user.meta.school
        })

        res.json({
            message: 'User successfully deleted',
            data: { user }
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function getStudentCoursesById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const student: any = await studentService.findStudentById(id);

        const courseIds = student.meta.courses;

        const courses = await courseService.findCoursesByIds(courseIds);

        res.json({
            message: 'Student courses successfully fetched',
            data: courses
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}

export async function getStudentSchoolById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const student: any = await studentService.findStudentById(id);

        const schoolId = student.meta.school;

        const school = await schoolService.findSchoolById(schoolId);

        res.json({
            message: 'Student school successfully fetched',
            data: school
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}