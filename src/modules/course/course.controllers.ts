import { Container } from 'typedi';
import { Request, Response } from "express";
import { ErrorParserService } from '../../services';
import CourseService from './course.services';
import { Types } from 'mongoose';
import InstructorService from '../user/instructor/instructor.services';
import StudentService from '../user/student/student.services';

const errorParser = Container.get(ErrorParserService);
const courseService = Container.get(CourseService);
const instructorService = Container.get(InstructorService);
const studentService = Container.get(StudentService);
const { ObjectId } = Types;

export async function createCourse(req: Request, res: Response) {
    try {
        const courseData = req.body;
        const instructorId = (req as any).payload.user._id;

        if (!courseData.meta.instructors?.includes(instructorId)) {
            // To ensure that the instructor creating the course is and instructor for the course.
            throw new Error(`Payload user id isn't included in course instructors metadata.`);
        }

        const newCourse = await courseService.createCourse(courseData);

        await instructorService.addCourseMetadata({
            instructorId,
            courseId: newCourse._id
        })

        res.json({
            message: 'Course successfully created',
            data: { 
                course: newCourse
            }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function enrollInCourseById(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);
        
        // Not using promise.all because I dont want to update the student metadata if the school id is invalid.
        await courseService.addStudentMetadata({
            studentId,
            courseId
        })
        await studentService.addCourseMetadata({
            courseId,
            studentIdData: studentId
        })

        res.json({
            message: 'Successfully enrolled in course.',
            data: { status: true }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}

export async function dropCourseById(req: Request, res: Response) {
    try {
        const studentId = ObjectId((req as any).payload.user._id);
        const courseId = ObjectId(req.params.id);
        
        // Not using promise.all because I dont want to update the student metadata if the school id is invalid.
        await courseService.removeStudentMetadata({
            studentId,
            courseId
        })
        await studentService.removeCourseMetadata({
            courseId,
            studentIdData: studentId
        })

        res.json({
            message: 'Successfully dropped course.',
            data: { status: true }
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
            message: 'Courses successfully fetched',
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
            message: 'Course successfully fetched',
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
        const id = ObjectId(req.params.id);
        const newCourseData = req.body;

        const data = await courseService.updateCourseById(id, newCourseData);

        res.json({
            message: 'Course successfully updated',
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
        const instructorId = (req as any).payload.user._id;

        const deletedCourse: any = await courseService.deleteCourseById(id);

        await Promise.all([
            instructorService.removeCourseMetadata({
                courseId: deletedCourse._id,
                instructorId: instructorId
            }),
            studentService.removeCourseMetadata({
                studentIdData: deletedCourse.meta.students,
                courseId: deletedCourse._id
            })
        ]);
        
        res.json({
            message: 'Course successfully deleted',
            data: {
                course: deletedCourse
            }
        })
    } catch (e) {
        res
        .status(errorParser.status(e))
        .json(errorParser.json(e));
    }
}