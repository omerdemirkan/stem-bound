import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { 
    studentService,
    errorParser,
    schoolService
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