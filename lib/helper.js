"use strict";
exports.__esModule = true;
exports.createPlayer = exports.scriptTagToJson = void 0;
var scriptTagToJson = function (context) {
    var parsedObject;
    context('script').each(function () {
        var scriptTagContents = context(this).html();
        var regex = /(?<=window\[.*?\=).*$/gm;
        if (scriptTagContents.match(regex)) {
            parsedObject = JSON.parse(scriptTagContents.match(regex)[0].replace(/;/g, '')).page.content; // remove trailing semi colon
        }
    });
    return parsedObject;
};
exports.scriptTagToJson = scriptTagToJson;
var createPlayer = function (player) { 
    return {
        id: player.id,
        uid: player.uid,
        guid: player.guid,
        displayName: player.displayName,
        url: player.link.web,
        team: player.subtitle
    };
};
exports.createPlayer = createPlayer;
