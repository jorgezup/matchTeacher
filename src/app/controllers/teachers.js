const { age, date } = require('../../lib/utils')

const Teacher = require('../models/Teacher')

module.exports = {
    //index
    index(req, res) {

        let { filter, page, limit } = req.query

        page = page || 1
        limit = limit || 2 /* quantos registros devem aparecer por página */
        let offset = limit * (page -1) /* é o pulo, de quanto em quanto */

        const params = {
            filter,
            page,
            limit,
            offset,
            callback(teachers) {
                const pagination = {
                    total: Math.ceil(teachers[0].total / limit),
                    page
                }
                return res.render('teachers/index', { teachers,  pagination, filter}) 
            }
        }

        Teacher.paginate(params)

    },
    //create
    create(req, res) {        
        return res.render('teachers/create')
    },    
    // post
    post(req, res) {
        const keys = Object.keys(req.body)
        
        //valida se os campos estão vazios
        for (let key of keys) {
            if (req.body[key] == "")
            return res.send(`Todos os campos devem ser preenchidos. Campo ${key} está vazio`)
        }
        
        Teacher.create(req.body, function(teacher) {
            return res.redirect(`/teachers/${teacher.id}`)
        })
    },    
    // show
    show(req, res) {
        Teacher.find(req.params.id, function(teacher) {
            if (!teacher) return res.send("Teacher not found!")

            teacher.age = age(teacher.birth)
            teacher.services = teacher.services.split(",")

            teacher.created_at = date(teacher.created_at).format
            
            return res.render('teachers/show', { teacher })
        })
    },
    
    // edit
    edit(req, res) {
        Teacher.find(req.params.id, function(teacher) {
            if (!teacher) return res.send("Teacher not found!")

            teacher.birth = date(teacher.birth).iso
            
            return res.render('teachers/edit', { teacher })
        })
    },
    
    //put
    put(req, res) {
        const keys = Object.keys(req.body)

        for (key of keys) {
            if (req.body[key] == "") {
                console.log(key)
                return res.send("Preencha todos os campos")
            }
        }

        Teacher.update(req.body, function() {
            return res.redirect(`/teachers/${req.body.id}`)
        })
    },
    
    // delete
    delete(req, res) {
        
        Teacher.delete(req.body.id, function() {
            return res.redirect(`/teachers/`)
        })
    }
}