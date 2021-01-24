require('./models/db');
const path = require('path'); 
const express = require('express');
const fileUpload = require('express-fileupload');
const bodyparser = require('body-parser');
const passport = require('passport');
// const expressValidator = require('express-validator');
// const flash = require('connect-flash');
const session = require('express-session');

var exphbs = require('express-handlebars');

const orderController = require('./controllers/orderController');
const productController = require('./controllers/productController');
const userController = require('./controllers/userController');

var app = express();
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, '/public')));
app.set('views',path.join(__dirname,'views'));
app.use(fileUpload());

//Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// //Express Messages Middleware
// app.use(require('connect-flash')());
// app.use(function(req, res, next){
//     res.locals.messages = require('express-messages')(req, res);
// });

// //Express Validator Middleware
// app.use(expressValidator({
//     errorFormatter: function(param, msg, value) {
//         var namespace = param.split('.')
//         , root = namespace.shift()
//         , formParam = root;

//         while(namespace.length){
//             formParam += '[' + namespace.shift() + ']';
//         }
//         return {
//             param: formParam,
//             msg: msg,
//             value: value
//         };
//     }
// }));
 
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'mainLayout',
    layoutDir: __dirname + '/views',

    //custom helpers
    helpers: {
        ifeq: function (a, b, options) {
            if (a == b) { return options.fn(this); }
            return options.inverse(this);
        },
        range: function(from, to, options) {
            var accum = '';
            for(var i = from; i <= to; i += 1)
                accum += options.fn(i);
            return accum;
        }
    }
});

// Passport Config and Middleware
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs'); 

app.listen(3000, ()=>{
    console.log('Server on port: 3000');
});

app.get('*', (req, res, next)=>{
    res.locals.user = req.user || null;
    console.log(req.user);
    next();
});
app.use('/',orderController);
app.use('/',productController);
app.use('/users',userController);
