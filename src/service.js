const fsPromise = require("node:fs/promises")
const path = require("node:path")

const pathToFile = path.join(process.cwd(), "src", "db.json")

const reader = async () => {
    return await fsPromise.readFile(pathToFile, "utf-8")
}

const writer = async (users) => {
     await fsPromise.writeFile(pathToFile, JSON.stringify(users))
}

module.exports = {reader, writer};