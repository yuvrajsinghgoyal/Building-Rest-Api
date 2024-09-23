const express = require('express');//express ko import kiya
const fs=require("fs")
const usersData=require("./MOCK_DATA.json") //fake data jo humne banaya hai usee import kiya
const app=express();//app banaya
const PORT=8000;
app.use(express.urlencoded({extended:false}));//this is middleware of plugin, isse body undifined nahi ayega
//one more middleware
app.use((req,res,next)=>{
    console.log("middleware 2")
    req.myName="Yuvraj"
    next();// ise call karne se middleware execute ho jayega 
})
app.use((req,res,next)=>{
   /* console.log("middleware 3",req.myName)//myName humne middleawre 2 me store kiya tha lekin hum middleware 3 OR routes me bhi access kar sakte hai 

    next();//hume code ko aage badane ke liye middleware me next function ko call krna padega
    // return res.end('hey') */
    fs.appendFile('log.txt',`${Date.now()} : ${req.method} : ${req.path}\n`,(err,data)=>{
        next()
    })
})


//Routes
app.get("/users",(req,res)=>{ //ek rout banaya jisme html me ul ke ander map method lagaya jo user me store hoga then li me first_name  show karaya or join method use karke sabhi ko join kiya 
    const html=`<ul>
                    ${usersData.map(user=>`<li>${user.first_name}</li>`).join("")}
                </ul>`;
                res.send(html)//then humne brower to html send kar diya 
})


app.get("/api/users",(req,res)=>{
    res.setHeader("myName","YuvrajGoyal")//this is use to create a header
    return res.json(usersData)//sara data user dekh sakta hai
})


app //humne user id se find karne wale route ko same route bana kar usme hi likh diya ise hum alag alag bhi likh sakte hai

    .route("/api/users/:userId")
    .get((req,res)=>{
    const Id=Number(req.params.userId/*kuch bhi name de sakte hai userId ki jagah route me bhi same hona chahiye , sath hi ise number me covert kiya*/);
    const user=usersData.find((user)=>user.id===Id);//yaha se humare banaye huye json data me se id match kar find karega
   if(!user) return res.status(404).json({error:"user not fount"})
    return res.json(user);
})
.patch((req,res)=>{
    //edit user with id
     return res.json({status:"pending"})
})
.delete((req,res)=>{
    //delete user with id
     return res.json({status:"pending"})
})
 


app.post('/api/users',(req,res)=>{//yaha pr hum postman ke through post requist banayenge
    //todo: create new user
    const body =req.body;
    if(!body||!body.first_name ||!body.last_name ||!body.email|| !body.gender){
        return res.status(400).json({msg:"All field are req..."})
    }

    usersData.push({...body,id:usersData.length+1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(usersData),(err,data)=>{
        return res.status(201)/* status(201) se hum status code update kar rahe hai */.json({status:"success",id:usersData.length})
    });
    // console.log("body",body)//ager direct postman ke through data send karenge toh undefined ayega isiliye hum middleware kause karenge
    
});


/*
//agar hum common route nahi rakhte toh hume ye code apply karna padta!
app.patch('/api/users',(req,res)=>{
    //edit user with id
    res.json({status:"pending"})
})
app.delete('/api/users',(req,res)=>{
    //delete user with id
    res.json({status:"pending"})
})
    */

app.listen(PORT,()=>console.log(`server started at port ${PORT}`))