import * as cheerio from "cheerio";
// import { EspnPlayer } from "./espn";

export const scriptTagToJson = (context: cheerio.Root): any => {
    let parsedObject: any
    context('script').each(function () {
        const scriptTagContents = context(this).html()
        const regex = /(?<=window\[.*?\=).*$/gm
        if (scriptTagContents.match(regex)) {
            parsedObject = JSON.parse(scriptTagContents.match(regex)[0].replace(/;/g, '')).page.content;    // remove trailing semi colon
        }
    })
    return parsedObject;
}

