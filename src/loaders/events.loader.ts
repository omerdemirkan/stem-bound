import * as subscribers from "../subscribers/index";

export default function () {
    Object.values(subscribers).forEach(function (subscriber) {
        subscriber.initialize();
    });
}
