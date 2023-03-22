import { test } from "./test";

/* eslint-disable-next-line no-restricted-globals */
self.addEventListener("message", function (e) {
    console.log(e);
    // do something
    test();
});