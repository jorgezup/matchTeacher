module.exports = {
    age: function(timestamp) {
        const today = new Date()
        const birthDate = new Date(timestamp)

        let age = today.getFullYear() - birthDate.getFullYear()
        const month = today.getMonth() - birthDate.getMonth()

        if (month < 0 || month == 0 && today.getDate() <= birthDate.getDate()) {
            age = age - 1
        }

        return age
    },
    date: function(timestamp) {
        const date = new Date(timestamp)

        // yyyy
        const year = date.getUTCFullYear()

        // mm - mes é de 0 a 11 , por isso o +1
        const month = `0${date.getUTCMonth() + 1}`.slice(-2)

        // dd slice(-2) pega os dois ultimos numeros
        const day = `0${date.getUTCDate()}`.slice(-2) 

        // return yyyy-mm-dd
        return {
            day,
            month,
            year,
            iso : `${year}-${month}-${day}`,
            birthDay: `${day}/${month}`
        }
    }
}