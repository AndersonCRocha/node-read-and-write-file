import fs from 'fs'
import fetch from 'node-fetch'

const to = fn => fn
  .then(response => response.json())
  .then(result => [result])
  .catch(error => [null, error])

fs.readFile('codes.txt', async (error, file) => {
  if (error) return console.log(error)
  
  const codes = file.toString().split('\r\n')
    .map(code => code.trim())
    .filter(Boolean)

  for (const code of codes) {
    const [data, errors] = await to(fetch(`https://api.github.com/users/${code}`))

    if (errors) {
      fs.appendFile('errors.txt', JSON.stringify(errors, null, 2), function (error) {
        if (error) console.log(error)
      })
      
      continue
    } 

    fs.appendFile('success.txt', `${JSON.stringify(data, null, 2)}\n\n\n\n\n\n`, function (error) {
      if (error) console.log(error)
    })
  }
})