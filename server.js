let express=require('express'),
path=require('path'),
mongoose=require('mongoose'),
cors=require('cors'),
bodyParser=require('body-parser'),
dbConfig=require('./Database/db');
const { truncate } = require('fs');

//connecting with mongodb
mongoose.Promise=global.Promise;
mongoose.connect(dbConfig.db,{
    useNewUrlParser:truncate
}).then(()=>{
console.log('successfully connected')
},
error=>{
    console.log('could not connect'+ error)
})

//setting up express
const employeeRoute=require('../backend/routes/employee.route');
const app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'dist/employee-app')));
app.use('/', express.static(path.join(__dirname, 'dist/employee-app')));
app.use('/api',employeeRoute)

const port=process.env.PORT || 3000;
const server=app.listen(port,()=>{
    console.log('connect to port' + port)
})
app.use((req,res,next)=>{
    next(createError(404));
});

app.use(function(err,req,res,next){
    console.error(err.message);
    if(!err.statusCode) err.statusCode=500;
    res.status(err.statusCode).send(err.message);
});
