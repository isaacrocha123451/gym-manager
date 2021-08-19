const fs = require('fs')
const data = require('../data.json')
const {age, date, blooded} = require('../utils')



exports.index = function(req,res){

    


    return res.render("members/index",{members:data.members})

   

}
exports.create = function(req,res){
    
    return res.render("members/create")

}
exports.post = function(req,res){
    
    const keys = Object.keys(req.body)

    for(key of keys){ 
        if(req.body[key] == ""){
            
            return res.send("Preencha todos os campos")
            
        }
    }

    let { avatar_url,name,birth,gender,services} = req.body

    
    birth = Date.parse(birth)
    let id = 1 
    const lastMembers = data.members[data.members.length-1]
    if(lastMembers){
        id = lastMembers.id + 1
    }

    data.members.push({
        ...req.body,
        id,
        birth
        

    })
    

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err){
            return res.send("Write file error")
        }

        return res.redirect(`/members/${id}` )

    })
   
    



    

}
exports.show = function(req,res){
    const {id} = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember){
        
        return res.send("Member not found") 

    } 

    const member = {
        ...foundMember,
        birth: date(foundMember.birth).birthDay,
        blood: blooded(foundMember.blood)
        
        
    }

    



    return res.render("members/show",{member})

}
exports.edit = function(req,res){
    
    const {id} = req.params

    const foundMember = data.members.find(function(member){
        return member.id == id
    })

    if(!foundMember){
        
        return res.send("Member not found") 

    }     

    member = {
        ...foundMember,
        birth:date(foundMember.birth).iso

    }

    return res.render("members/edit",{member})
}
exports.put = function(req, res){

    const {id} = req.body

    let index = 0 

    const foundMember = data.members.find(function(member,foundIndex){
        if(member.id == id ){
            foundIndex = index
            return true 
        }
    })

    if(!foundMember) return res.send("Not found member")

    member = {
        ...foundMember,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id:Number(req.body.id)


    }

    data.members[index] = member

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/members/${id}`)
    })



}
exports.delete = function(req,res){

    const {id} = req.body

    const filteredMember = data.members.filter(function(member){
        return member.id != id
    })

    data.members = filteredMember

    fs.writeFile("data.json",JSON.stringify(data,null,2 ),function(err){
        if(err) return res.send("Write error !")

        return res.redirect("/members")

    })

}







