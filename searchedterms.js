

const fs = require('fs')
const path = require("path")
// create a file to store the terms that are searched
let dirname = path.join(__dirname, "/search")
let filename = "searchedTerms.txt"


fs.mkdir(dirname)

fs.opendir(dirname)
fs.readdir(dirname,(error, files)=>{
    if(error) throw new Error("trying to reading directory for searched terms")
    files.forEach(file=>{
        if(file === filename){
            
        }
    })
})
fs.createWriteStream()

const createFile =() =>{
    //
    if(file is available){
        append
    }else{
        create new file
    }
}
