/**
 * Created by dcorns on 8/4/16.
 */
///<reference path="typings/index.d.ts" />
'use strict';
import http = require('http');
import url = require('url');
import fs = require('fs');
import readLine = require('readline');
import path = require('path');

interface widget{
  id: number,
  name: string,
  description: string,
  price: number
}

let rl = readLine.createInterface({
  input: fs.createReadStream('widgetData.db'),
  terminal: false
});
let currentId: number = -1;
let widgets: widget[] = [];
let lineIn: string[] = [];
//Get Data
rl.on('line', (ln): void =>{
  if(currentId < 0){
    currentId = parseInt(ln, 10) + 1;
  }
  else{
    lineIn = ln.trim.split(':');
    widgets.push({
      id: parseInt(lineIn[0],10),
      name: lineIn[1],
      description: lineIn[2],
      price: parseFloat(lineIn[3])
    });
  }
});

let makeWidget = (obj: {name: string, description: string, price: string}, nextId: number): widget =>{
  return {
    id: nextId,
    name: obj.name,
    description: obj.description,
    price: parseFloat(obj.price)
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

let runCommand = (method: string, obj: {id:string, name:string, description:string, price:string}): any =>{
  switch (method){
    case 'POST':
      return storeWidget(makeWidget(obj, currentId++), widgets);
    case 'GET':
      if(parseInt(obj.id, 10) > 0) return getOneWidget(parseInt(obj.id, 10), widgets);
      return widgets;
    case 'PUT':
      return updateWidget({
        id: parseInt(obj.id, 10),
        name: obj.name,
        description: obj.description,
        price: parseFloat(obj.price)
      }, widgets);
    case 'DELETE':
      if(parseInt(obj.id, 10) > 0) return deleteWidget(parseInt(obj.id, 10), widgets);
      return widgets;
  }
};

http.createServer(function(req, res){
  //console.log(req.url, req.method, req.headers);
  let result;
  let input = url.parse(req.url,true).query;
  if(!(input.id)) input.id = 0;
  if(req.method === 'GET' || req.method === 'DELETE'){
    let testUrl: string[] = req.url.split('/');
    testUrl[1] ? result = runCommand(req.method, {id: testUrl[1]}) : result = runCommand(req.method, {id: '0'});
  }
  else{
    result = runCommand(req.method, input);
  }

  console.dir(result);

  if (result){
    res.statusCode = 200;
    res.end(JSON.stringify(result));
  }
  else{
    res.statusCode = 400;
    res.end('error');
  }

}).listen(process.env.PORT || 5000, '127.0.0.1');

console.log('Server up, localhost:5000');