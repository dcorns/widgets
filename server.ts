/**
 * Created by dcorns on 8/4/16.
 */
///<reference path="typings/index.d.ts" />
'use strict';
import http = require('http');
import queryString = require('querystring');
interface widget{
  id: number,
  name: string,
  description: string,
  price: number
}

let currentId: number = 1;
let widgets: widget[] = [];

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

let runCommand = (method: string, obj: {id?:string, name?:string, description?:string, price?:string}): any =>{
  switch (method){
    case 'POST':
      return storeWidget(makeWidget(obj, currentId++), widgets);
    case 'GET':
      if(parseInt(obj.id) > 0) return getOneWidget(parseInt(obj.id, 10), widgets);
      return widgets;
    case 'PUT':
      return updateWidget({
        id: parseInt(obj.id),
        name: obj.name,
        description: obj.description,
        price: parseFloat(obj.price)
      }, widgets);
    case 'DELETE':
      return deleteWidget(parseInt(obj.id, 10), widgets);
  }
};

http.createServer(function(req, res){
  //console.log(req.url, req.method, req.headers);
  let result;
  let input: Object = queryString.parse(req.url.slice(2,req.url.length - 1));
  if(req.method === 'GET'){
    let testUrl: string[] = req.url.split('/');
    testUrl[1] ? result = runCommand('GET', {id: testUrl[1]}) : result = runCommand('GET', {id: 0});
  }
  else result = runCommand(req.method, input);

  console.dir(result);

  if (result !== 'err'){
    res.statusCode = 200;
    res.end('' + result);
  }
  else{
    res.statusCode = 400;
    res.end('error');
  }

}).listen(process.env.PORT || 5000, '127.0.0.1');

console.log('Server up, localhost:5000');