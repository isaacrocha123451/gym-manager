const fs = require('fs')
const data = require('../data.json')
const {age, date} = require('../utils')



exports.index = function(req,res){

    let instructors = data.instructors.map(function(instructor){
        const newInstructor = {
            ...instructor,
            services:instructor.services.split(',')
        }
        return newInstructor
    })


    return res.render("instructors/index",{instructors})

   

}
exports.create = function(req,res){
    
        return res.render("instructors/create")
    
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
    created_at = Date.now()
    id = Number(data.instructors.length + 1)

    data.instructors.push({
        id,
        name,
        avatar_url,
        birth,
        gender,
        services,
        created_at

    })
    

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err){
            return res.send("Write file error")
        }

        return res.redirect("/instructors")

    })
   
    



    

}
exports.show = function(req,res){
    const {id} = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor){
        
        return res.send("Instructor not found") 

    } 

    const instructor = {
        ...foundInstructor,
        age: age(foundInstructor.birth),
        services : foundInstructor.services.split(",") ,
        created_at : new Intl.DateTimeFormat('pt-BR').format(foundInstructor.created_at)
        
    }



    return res.render("instructors/show",{instructor})

}
exports.edit = function(req,res){
    
    const {id} = req.params

    const foundInstructor = data.instructors.find(function(instructor){
        return instructor.id == id
    })

    if(!foundInstructor){
        
        return res.send("Instructor not found") 

    }     

    instructor = {
        ...foundInstructor,
        birth:date(foundInstructor.birth).iso

    }

    return res.render("instructors/edit",{instructor})

}
exports.put = function(req, res){

    const {id} = req.body

    let index = 0 

    const foundInstructor = data.instructors.find(function(instructor,foundIndex){
        if(instructor.id == id ){
            foundIndex = index
            return true 
        }
    })

    if(!foundInstructor) return res.send("Not found instructor")

    instructor = {
        ...foundInstructor,
        ...req.body,
        birth: Date.parse(req.body.birth),
        id:Number(req.body.id)


    }

    data.instructors[index] = instructor

    fs.writeFile("data.json",JSON.stringify(data,null,2),function(err){
        if(err) return res.send("Write error!")

        return res.redirect(`/instructors/${id}`)
    })



}
exports.delete = function(req,res){

    const {id} = req.body

    const filteredInstructor = data.instructors.filter(function(instructor){
        return instructor.id != id
    })

    data.instructors = filteredInstructor

    fs.writeFile("data.json",JSON.stringify(data,null,2 ),function(err){
        if(err) return res.send("Write error !")

        return res.redirect("/instructors")

    })

}







