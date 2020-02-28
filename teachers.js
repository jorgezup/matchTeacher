const fs = require('fs')
const data = require('./data.json')

// create
exports.post = function(req, res) {
    // req.query
    // req.body
    
    const keys = Object.keys(req.body)

    //valida se os campos estão vazios
    for (key of keys) {
        if (req.body[key] == "")
            return res.send(`Todos os campos devem ser preenchidos. Campo ${key} está vazio`)
    }

    req.body.birth = Date.parse(req.body.birth) //converte a data em timestamp
    req.body.created_at = Date.now() //desde, em timestamp
    req.body.id = Number(data.teachers.length + 1) //criando um id

    data.teachers.push(req.body)

    fs.writeFile("data.json", JSON.stringify(data, null, 2), (err) => {
        if(err) return res.send("Erro na escrita do arquivo")

        return res.redirect('/teachers')
    })

    // return res.send(keys)
}



// update



// delete