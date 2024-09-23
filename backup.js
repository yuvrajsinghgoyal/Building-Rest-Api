const express = require('express');//express ko import kiya
const fs=require("fs")
const usersData=require("./MOCK_DATA.json") //fake data jo humne banaya hai usee import kiya
const app=express();//app banaya
const PORT=8000;
app.use(express.urlencoded({extended:false}));//this is middleware of plugin, isse body undifined nahi ayega


//Routes
app.get("/users",(req,res)=>{ //ek rout banaya jisme html me ul ke ander map method lagaya jo user me store hoga then li me first_name  show karaya or join method use karke sabhi ko join kiya 
    const html=`<ul>
                    ${usersData.map(user=>`<li>${user.first_name}</li>`).join("")}
                </ul>`;
                res.send(html)//then humne brower to html send kar diya 
})


app.get("/api/users",(req,res)=>{
    return res.json(usersData)//sara data user dekh sakta hai
})


app //humne user id se find karne wale route ko same route bana kar usme hi likh diya ise hum alag alag bhi likh sakte hai

    .route("/api/users/:userId")
    .get((req,res)=>{
    const Id=Number(req.params.userId/*kuch bhi name de sakte hai userId ki jagah route me bhi same hona chahiye , sath hi ise number me covert kiya*/);
    const user=usersData.find((user)=>user.id===Id);//yaha se humare banaye huye json data me se id match kar find karega
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
    usersData.push({...body,id:usersData.length+1});
    fs.writeFile("./MOCK_DATA.json",JSON.stringify(usersData),(err,data)=>{
        return res.json({status:"success",id:usersData.length})
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