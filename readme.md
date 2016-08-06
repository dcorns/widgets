#widgets
##Branch simple
This is an example of a restful CRUD API using node and typescript.
Their are no dependencies and only a get request is used for all operations.
The widgets are not persisted and will disappear when the server shuts down.
###Usage:
**Create:** http:/localhost:5000/Create/myWidgetName/my widget description/3.24 (price)<br>
**Read:** http:/localhost:5000/Read/1 (widget id)<br>
**List:** http:/localhost:5000/List<br>
**Update:** http:/localhost:5000/Update/1 (widget id)/myWidgetName/my widget description/3.24 (price)<br>
**Delete:** http:/localhost:5000/Delete/1 (widget id)<br>
##Branch node
This is also an example of a restful CRUD API using node and typescript.
But the data is persisted to a file and proper CRUD requests are required using a query string.
###Usage
**Create:** POST request to http:/localhost:5000/?name=myWidgetName&description=my widget description&price=3.24<br>
**Read:** GET request to http:/localhost:5000/1 (widget id)<br>
**List:** GET request to http:/localhost:5000/<br>
**Update:** PUT request to http:/localhost:5000/?id=1&name=myWidgetName&description=my widget description&price=3.24<br>
**Delete:** DELETE request to http:/localhost:5000/1 (widget id)<br>