const fs = require('fs')
const data = require('../data.json')
const { age } = require('../utils')
const { date } = require('../utils')

//index
exports.index = function(req, res) {
    return res.render('teachers/index', { teachers:data.teachers}) //data.teachers, pq tem um array dentro data.json
}

//create
exports.create = function(req, res) {
    return res.render('teachers/create')
}

// post
exports.post = function(req, res) {
    
    const keys = Object.keys(req.body)

    //valida se os campos estão vazios
    for (let key of keys) {
        if (req.body[key] == "")
            return res.send(`Todos os campos devem ser preenchidos. Campo ${key} está vazio`)
    }
    let {
        name,
        birth,
        services,
        gender,
        escolaridade,
        tipo_aula,
        avatar_url,
      } = req.body
    
      birth = Date.parse(birth)
      const created_at = Date.now()
      const id = Number(data.teachers.length + 1)
      data.teachers.push({
        id,
        avatar_url,
        name,
        birth,
        gender,
        escolaridade,
        tipo_aula,
        services,
        created_at,
      })

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) {
            return res.send("Erro na escrita do arquivo")
        }

        return res.redirect('/teachers')
    })
}

//show
exports.show = function(req, res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher) return res.send("teacher not found")

    const teacher = {
        ...foundTeacher,
        age: age(foundTeacher.birth),
        services: foundTeacher.services.split(','),
        created_at: new Intl.DateTimeFormat('pt-BR').format(foundTeacher.created_at),
    }

    return res.render('teachers/show', { teacher })
}

// edit
exports.edit = function(req, res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher) return res.send("teacher not found")

    const teachers = {
        ...foundTeacher,
        birth: date(foundTeacher.birth).iso
    }

    return res.render('teachers/edit', { teachers })
}

//put
exports.put = function(req, res) {
    const { id } = req.body //dentro do req.body, é feito a desestruturação e é pegado o id

    let index = 0

    const foundTeacher = data.teachers.find(function(teacher, foundIndex) {
        if (id == teacher.id) {
            index = foundIndex
            return true
        }
    }) 

    if (!foundTeacher) return res.send("Professor não encontrado")

    const teacher = {
        ...foundTeacher, //espalhando os dados
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id) /* para salvar o id como número e não como string */
    }

    data.teachers[index] = teacher

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error!")

        return res.redirect(`/teachers/${id}`)
    })
}

// delete
exports.delete = function(req, res) {
    const { id } = req.body
    
    const filteredTeachers = data.teachers.filter((teacher) => {
        return teacher.id !=  id
    })

    data.teachers =filteredTeachers

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error!")

        return res.redirect(`/teachers`)
    })
}