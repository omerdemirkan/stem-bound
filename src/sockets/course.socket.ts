import {
    ISocketInitializer,
    ECourseEvents,
    IAnnouncement,
    ICourse,
    ESocketEvents,
} from "../types";

const courseSocketInitializer: ISocketInitializer = (
    socket,
    { io, eventEmitter }
) => {
    function newAnnouncementListener({
        announcement,
        course,
    }: {
        announcement: IAnnouncement;
        course: ICourse;
    }) {
        const userChatRooms = course.meta.students;
        if (!userChatRooms.length) return;

        let announcementEmitter = io.sockets;
        userChatRooms.forEach(function (chatRoom) {
            announcementEmitter = announcementEmitter.to(chatRoom.toString());
        });

        announcementEmitter.emit(ESocketEvents.COURSE_ANNOUNCEMENT_CREATED, {
            course,
            announcement,
        });
    }

    eventEmitter.addListener(
        ECourseEvents.COURSE_ANNOUNCEMENT_CREATED,
        newAnnouncementListener
    );

    socket.on("disconnect", function () {
        eventEmitter.removeListener(
            ECourseEvents.COURSE_ANNOUNCEMENT_CREATED,
            newAnnouncementListener
        );
    });
};

export default courseSocketInitializer;
