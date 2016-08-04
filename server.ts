/**
 * Created by dcorns on 8/4/16.
 */
///<reference path="typings/index.d.ts" />
'use strict';
const http = require('http');

interface widget{
  id: number,
  name: string,
  description: string,
  price: number
}

let currentId: number = 1;
let widgets: widget[] = [];

let makeWidget = (ary: [string], nextId: number): widget =>{
  return {
    id: nextId,
    name: ary[2],
    description: ary[3],
    price: parseFloat(ary[4])
  };
};

let getOneWidget = (id: number, ary: widget[]): widget =>{
  return ary[getWidgetIndex(id, ary)];
};

let getWidgetIndex = (id: number, ary: widget[]): number =>{
  for(var i = 0; i < ary.length; i++){
    if(ary[i].id === id) return i;
  }
};

let updateWidget = (widg: widget, ary: widget[]): widget[] =>{
  let idx: number = getWidgetIndex(widg.id, ary);
  ary[idx] = widg;
  return ary;
};

let deleteWidget = (id: number, ary: widget[]): widget[] =>{
  ary.splice(getWidgetIndex(id, ary), 1);
  return ary;
};

let storeWidget = (widg: widget, ary: widget[]): widget[] =>{
  ary.push(widg);
  return ary;
};

let runCommand = (ary: [string]): any =>{
  switch (ary[1]){
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

http.createServer(function(req, res){
  let input: [string] = req.url.split('/');
  let result = runCommand(input);
  console.dir(result);
  if (result !== 'err'){
    res.statusCode = 200;
    res.end(result);
  }
  else{
    res.statusCode = 400;
    res.end('error');
  }

}).listen(process.env.PORT || 5000, '127.0.0.1');

console.log('Server up, localhost:5000');