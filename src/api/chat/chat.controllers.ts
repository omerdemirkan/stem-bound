import { Request, Response } from "express";
import { errorParser, chatService } from "../../services";
import { Types } from "mongoose";

const { ObjectId } = Types;

// export async function getChatById(req: Request, res: Response) {
//     try {
//         const id = ObjectId(req.params.id);
//         const chat = await chatService.findChatById(id);
//         res.json({
//             message: "Chat successfully fetched",
//             data: chat,
//         });
//     } catch (e) {
//         res.status(errorParser.status(e)).json(errorParser.json(e));
//     }
// }
