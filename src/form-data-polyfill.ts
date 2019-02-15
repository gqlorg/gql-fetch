import FormData from 'form-data';

// FormData polyfill
// @ts-ignore
if (!global.FormData) {
    // @ts-ignore
    global.FormData = FormData;
}
