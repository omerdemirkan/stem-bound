import { Request, Response } from 'express';
import { Container } from 'typedi';
import { InstructorService } from './instructor.services';
import { Types } from 'mongoose';

const { ObjectId } = Types

const instructorService = Container.get(InstructorService);

export async function getInstructors(req: Request, res: Response) {
    try {
        const data = await instructorService.findInstructors()
        res.json({
            data
        });
    } catch (e) {
        res.status(400).json({
            message: 'an error occured'
        })
    }
}

export async function getInstructorById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await instructorService.findInstructorById(id)
        res.json({
            data
        });
    } catch (e) {
        res.status(400).json({
            message: 'an error occured'
        })
    }
}

export async function updateInstructorById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const newInstructor = req.body;
        const data = await instructorService.updateInstructorById(id, newInstructor);

        res.json({
            data
        })
    } catch (e) {
        res.status(400).json({
            message: 'an error occured'
        })
    }
}

export async function deleteInstructorExpenseById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await instructorService.deleteInstructorById(id);
        res.json({
            data
        });
    } catch (e) {
        res.status(400).json({
            message: 'an error occured'
        })
    }
}