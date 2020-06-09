import { Request, Response } from 'express';
import { Container } from 'typedi';
import { InstructorService } from './instructor.services';

const instructorService = Container.get(InstructorService);

export async function getInstructors(req: Request, res: Response) {
    try {
        res.json({
            data: await instructorService.findInstructors()
        });
    } catch (e) {
        res.json({
            message: 'an error occured'
        })
    }
}