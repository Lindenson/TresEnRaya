var connect = require('connect');
var serveStatic = require('serve-static');
var path = require('path')

var app = connect()
app.use(serveStatic(path.join(__dirname, 'dist')))
app.use(serveStatic(path.join(__dirname)))
app.listen(8080, () => console.log('Server running on 8080...'));
