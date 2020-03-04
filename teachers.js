const fs = require('fs')
const data = require('./data.json')
const { age } = require('./utils')
const { date } = require('./utils')

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

// create
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


// edit
exports.edit = function(req, res) {
    const { id } = req.params

    const foundTeacher = data.teachers.find(function(teacher){
        return teacher.id == id
    })

    if (!foundTeacher) return res.send("teacher not found")

    const teachers = {
        ...foundTeacher,
        birth: date(foundTeacher.birth)
    }

    return res.render('teachers/edit', { teachers })
}

//put
exports.put = function(req, res) {
    
}


// delete