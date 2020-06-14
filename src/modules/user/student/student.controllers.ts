import { Container } from 'typedi';
import { Request, Response } from 'express';
import StudentService from './student.services';
import { ErrorParserService } from '../../../services';
import { Types } from 'mongoose';

const studentService: StudentService = Container.get(StudentService);
const errorParser = Container.get(ErrorParserService);
const { ObjectId } = Types

export async function createStudent(req: Request, res: Response) {
    try {
        const newStudent = req.body;
        const data = await studentService.createStudent(newStudent);

        res.json({
            data
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
        const data = await studentService.deleteStudentById(id);
        res.json({
            data
        });
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e))
    }
}