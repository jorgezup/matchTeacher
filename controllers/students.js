const fs = require('fs')
const data = require('../data.json')
const { age } = require('../utils')
const { date } = require('../utils')

//index
exports.index = function(req, res) {
    return res.render('students/index', { students:data.students}) //data.students, pq tem um array dentro data.json
}

//create
exports.create = function(req, res) {
    return res.render('students/create')
}

//show
exports.show = function(req, res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent) return res.send("student not found")

    const student = {
        ...foundStudent,
        age: age(foundStudent.birth),
    }

    return res.render('students/show', { student })
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
      const id = Number(data.students.length + 1)
      data.students.push({
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

        return res.redirect('/students')
    })
}
// edit
exports.edit = function(req, res) {
    const { id } = req.params

    const foundStudent = data.students.find(function(student){
        return student.id == id
    })

    if (!foundStudent) return res.send("student not found")

    const students = {
        ...foundStudent,
        birth: date(foundStudent.birth)
    }

    return res.render('students/edit', { students })
}
//put
exports.put = function(req, res) {
    const { id } = req.body //dentro do req.body, é feito a desestruturação e é pegado o id

    let index = 0

    const foundStudent = data.students.find(function(student, foundIndex) {
        if (id == student.id) {
            index = foundIndex
            return true
        }
    }) 

    if (!foundStudent) return res.send("Professor não encontrado")

    const student = {
        ...foundStudent, //espalhando os dados
        ...req.body,
        birth: Date.parse(req.body.birth),
        id: Number(req.body.id) /* para salvar o id como número e não como string */
    }

    data.students[index] = student

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error!")

        return res.redirect(`/students/${id}`)
    })
}
// delete
exports.delete = function(req, res) {
    const { id } = req.body
    
    const filteredStudents = data.students.filter((student) => {
        return student.id !=  id
    })

    data.students =filteredStudents

    fs.writeFile("data.json", JSON.stringify(data, null, 2), function(err) {
        if (err) return res.send("Write error!")

        return res.redirect(`/students`)
    })
}