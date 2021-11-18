const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const session=require('express-session');
const passport=require('passport');
const plm=require('passport-local-mongoose');
const app=express();
require('dotenv').config();

app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}))
app.use('/css',express.static('css'))
app.use(session({
    secret:'system',
    resave:false,
    saveUninitialized:false,
}))

app.use(passport.initialize());
app.use(passport.session());
mongoose.connect(process.env.DB_URL);
const LoginSchima=new mongoose.Schema({
    email:String,
    password:String
});
const PatientSchima={
    patientId:Number,
    patientName:String,
    patientAge:Number,
    patientNumber:Number,
    patientAddress:String,
    patientDisease:String,

}
LoginSchima.plugin(plm);
const Login=new mongoose.model('manage',LoginSchima);
const Patient=new mongoose.model('details',PatientSchima);
passport.use(Login.createStrategy());
passport.serializeUser(Login.serializeUser());
passport.deserializeUser(Login.deserializeUser());

app.get('/',(req,res)=>{
    res.render('index')
})
app.get('/admin',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('index')
    }else{
        res.redirect('/')
    }
})
app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/')
})
app.get('/register',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('register')
    }
    else{
        res.redirect('/')
    }
})
app.get('/update',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('search',{
            option:'Update',
            buttonName:'Update',
            url:'update'
        })
    }
})
app.get('/delete',(req,res)=>{
    if(req.isAuthenticated()){
        res.render('search',{
            option:'Delete',
            buttonName:"Delete",
            url:'delete'
        })
    }
})

app.get('/search',(req,res)=>{
   if(req.isAuthenticated()){
       res.render('search',{
           option:'Search',
           buttonName:'Search',
           url:'search'
       })
   }
})


app.post('/',(req,res)=>{


    // Login.register({username:req.body.username},req.body.password).then(()=>{
    //     passport.authenticate('local'),(req,res)=>{
    //         res.redirect('/admin')
    //     }
    // })
    const user=new Login({
        username:req.body.username,
        password:req.body.password
    })
    req.login(user,(err)=>{

    if(err){
        console.log(err);
    }else{
        res.redirect('/')
    }
    })

   
  
})
app.post('/register',(req,res)=>{
    const patient=new Patient(req.body)
    patient.save().then(()=>{
        res.render('result',{
            success:'done'
        })
    })
})
app.post('/update',(req,res)=>{
    Patient.findOne({patientId:req.body.patientId}).then((user)=>{
        if(user){
            res.render('updatePage',{
                patientId:user.patientId,
                patientAge:user.patientAge,
                patientName:user.patientName,
                patientNumber:user.patientNumber,
                patientDisease:user.patientDisease,
                patientAddress:user.patientAddress,
            })
        }
        else{
            res.render('result',{
                success:'Fount'
            })
        }
    })
})
app.post('/updated',(req,res)=>{
    
    Patient.findOneAndUpdate({patientId:req.body.patientId},req.body).then(()=>{
        res.render('result',{
            success:'Updated'
        })
    
    })
   
})
app.post('/delete',(req,res)=>{
    Patient.findOneAndRemove({patientId:req.body.patientId}).then(()=>{
        res.render('result',{
            success:'Deleted'
        })
    }).catch((err)=>{
        res.send(err)
    })
})
app.post('/search',(req,res)=>{
    Patient.findOne({patientId:req.body.patientId}).then((user)=>{
        if(user){
            res.render('show',{
                patientId:user.patientId,
                patientAge:user.patientAge,
                patientName:user.patientName,
                patientNumber:user.patientNumber,
                patientDisease:user.patientDisease,
                patientAddress:user.patientAddress,
            })
        }
        else{
            res.render('result',{
                success:'Fount'
            })
        }
    })

})
app.listen(process.env.PORT ||5000,()=>{
    console.log('running');
})