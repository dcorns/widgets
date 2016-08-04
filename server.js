/**
 * Created by dcorns on 8/4/16.
 */
///<reference path="typings/index.d.ts" />
'use strict';
var http = require('http');
var currentId = 1;
var widgets = [];
var makeWidget = function (ary, nextId) {
    return {
        id: nextId,
        name: ary[2],
        description: ary[3],
        price: parseFloat(ary[4])
    };
};
var getOneWidget = function (id, ary) {
    return ary[getWidgetIndex(id, ary)];
};
var getWidgetIndex = function (id, ary) {
    for (var i = 0; i < ary.length; i++) {
        if (ary[i].id === id)
            return i;
    }
};
var updateWidget = function (widg, ary) {
    var idx = getWidgetIndex(widg.id, ary);
    ary[idx] = widg;
    return ary;
};
var deleteWidget = function (id, ary) {
    ary.splice(getWidgetIndex(id, ary), 1);
    return ary;
};
var storeWidget = function (widg, ary) {
    ary.push(widg);
    return ary;
};
var runCommand = function (ary) {
    switch (ary[1]) {
        case 'Create':
            return storeWidget(makeWidget(ary, currentId++), widgets);
        case 'Read':
            return getOneWidget(parseInt(ary[2], 10), widgets);
        case 'List':
            return widgets;
        case 'Update':
            return updateWidget({
                id: parseInt(ary[2]),
                name: ary[3],
                description: ary[4],
                price: parseFloat(ary[5])
            }, widgets);
        case 'Delete':
            return deleteWidget(parseInt(ary[2], 10), widgets);
    }
};
http.createServer(function (req, res) {
    var input = req.url.split('/');
    var result = runCommand(input);
    console.dir(result);
    if (result !== 'err') {
        res.statusCode = 200;
        res.end('' + result);
    }
    else {
        res.statusCode = 400;
        res.end('error');
    }
}).listen(process.env.PORT || 5000, '127.0.0.1');
console.log('Server up, localhost:5000');
//# sourceMappingURL=server.js.map