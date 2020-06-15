import { Container } from 'typedi';
import { Request, Response } from "express";
import { ErrorParserService } from '../../services';
import CourseService from './course.services';
import { Types } from 'mongoose';
import InstructorService from '../user/instructor/instructor.services';

const errorParser = Container.get(ErrorParserService);
const courseService = Container.get(CourseService);
const instructorService = Container.get(InstructorService)
const { ObjectId } = Types;

export async function createCourse(req: Request, res: Response) {
    try {
        const courseData = req.body;
        const data = await courseService.createCourse(courseData);

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function getCourses(req: Request, res: Response) {
    try {
        const data = await courseService.findCourses({});

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function getCourseById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);
        const data = await courseService.findCourseById(id);

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function updateCourseById(req: Request, res: Response) {
    try {
        if (req.body.meta) throw new Error('metadata cannot be updated from this route');
        const id = ObjectId(req.params.id);
        const newCourseData = req.body;

        const data = await courseService.updateCourseById(id, newCourseData);

        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function deleteCourseById(req: Request, res: Response) {
    try {
        const id = ObjectId(req.params.id);

        const data = await courseService.deleteCourseById(id);
        res.json({
            data
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}