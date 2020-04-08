const { date } = require('../../lib/utils')

const Student = require('../models/Student')

module.exports = {    
    //index
    index(req, res){
        Student.all(function(students){
            return res.render('students/index', { students }) 
        })
    },
    //create
    create(req, res) {

        Student.teachersSelectOptions(function(options) {
            return res.render('students/create', {teacherOptions: options})
        })

    },
    // post
    post(req, res) {
        const keys = Object.keys(req.body)

        //valida se os campos estão vazios
        for (let key of keys) {
            if (req.body[key] == "")
                return res.send(`Todos os campos devem ser preenchidos. Campo ${key} está vazio`)
        }
        
        Student.create(req.body, function(student) {
            return res.redirect(`students/${student.id}`)
        })
    },

    //show
    show(req, res) {
        Student.find(req.params.id, function(student) {
            if (!student) return res.send("Student not Found")

            student.birth = date(student.birth).birthDay

            return res.render('students/show', { student })
        })
    },

    // edit
    edit(req, res) {
        Student.find(req.params.id, function(student) {
            if (!student) return res.send("Student not Found")

            student.birth = date(student.birth).iso
            
            return res.render('students/edit', { student })
        })
    
    },
    //put
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                return res.send("Please fill all fields")
            }
        }

        Student.update(req.body, function() {
            return res.redirect(`/students/${req.body.id}`)
        })
    },
    // delete
    delete(req, res) {

        Student.delete(req.body.id, function() {
            return res.redirect(`/students`)
        })
    }
}