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

let currentId: number = -1;
let widgets: widget[] = [];

let getData = (dataFile: string, cb:Function): void =>{
  fs.readFile(dataFile, 'utf8', (err, data): void =>{
    if(err) console.log(err);
    cb(null, JSON.parse(data));
  });
};

let writeData = (idx: number, ary: widget[], dataFile: string): void =>{
  let allData = {idx: idx, widgets: ary};
  fs.writeFile(dataFile, JSON.stringify(allData), (err): void =>{
    if(err) console.log(err);
  });
};


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

let runCommand = (method: string, obj: {id:string, name?:string, description?:string, price?:string}): any =>{
  switch (method){
    case 'POST':
      let name: string = obj.name;
      let description: string = obj.description;
      let price = obj.price;
      return storeWidget(makeWidget({name: name, description: description, price: price}, currentId++), widgets);
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

getData('widgetData.db', (err, data: {idx: number, widgets: widget[]}): void => {
  if(err) console.log(err);
  currentId = data.idx;
  widgets = data.widgets;
});


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

  if(req.method === 'DELETE' || 'POST' || 'PUT') writeData(currentId, widgets, 'widgetData.db');

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