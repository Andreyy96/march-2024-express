const path = require('node:path');
const fsPromises = require('node:fs/promises');
const fs = require('node:fs');

const mainFolder = path.join(__dirname, "main-folder")


const writer = async () => {
    for (let i = 1; i <= 5; i++) {
        await fsPromises.mkdir(path.join(__dirname, "main-folder", `folder${i}`), {recursive: true})
        for (let j = 1; j <= 5; j++) {
            const pathToFile = path.join(process.cwd(), "main-folder", `folder${i}`, `text${j}.txt`)
            await fsPromises.writeFile(pathToFile, `folder${i} file${j}.txt`)
        }
    }
    reader()
}

const reader = async () => {
    for (let i = 1; i <= 5; i++) {
        for (let j = 1; j <= 5; j++) {
            const pathToFile = path.join(process.cwd(), "main-folder", `folder${i}`, `text${j}.txt`)
            const data = await fsPromises.readFile(pathToFile, 'utf-8')
            console.log(data);
        }
    }


    const folders = await fsPromises.readdir(mainFolder)
    for (const folder of folders) {
        const folderPath = path.join(mainFolder, folder)
        const stat = await fsPromises.stat(folderPath)
        console.log("----------------------------------")
        console.log(folder, "Directory", stat.isDirectory())
        console.log(folder, "File", stat.isFile())


        const files = await fsPromises.readdir(folderPath)
        for (const file of files) {
            const filerPath = path.join(mainFolder, folder, file)
            const stat = await fsPromises.stat(filerPath)
            console.log(file, "Directory", stat.isDirectory())
            console.log(file, "File", stat.isFile())

        }


    }
}


writer()
