const express = require("express");

const {reader, writer} = require("./src/service")

const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

const regEmail = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/
const regPassword = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%_*#?&])[A-Za-z\d@$_!%*#?&]{5,}$/


app.get('/users', async (req, res) => {
    try {
        const users = await reader()
        res.send(JSON.parse(users));
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.post('/users', async (req, res) => {
    try {
        const {name, email, password} = req.body;

        if(name.length <= 3) {
            return res.status(404).send('name min at 3 letters');
        }
        if(!regEmail.test(email)) {
            return res.status(404).send('wrong email');
        }

        if(!regPassword.test(password) ) {
            return res.status(404).send('wrong password');
        }

        const users = JSON.parse(await reader())

        const user = users.find(user => user.email === email);

        if(user) {
            return res.status(409).send('email is already');
        }

        const id = users[users.length - 1].id + 1;
        const newUser = {id, name, email, password};
        users.push(newUser);

        await writer(users)

        res.status(201).send(newUser);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.get('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = JSON.parse(await reader())
        const user = users.find(user => user.id === userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        res.send(user);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.put('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = JSON.parse(await reader())

        const userIndex = users.findIndex(user => user.id === userId);

        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }

        const {name, email, password} = req.body;
        const user = users.find(user => user.email === email);

        if(name.length >= 3) {
            users[userIndex].name = name;
        }

        if(regEmail.test(email) && ! user) {
            users[userIndex].email = email;
        }

        if(regPassword.test(password) ) {
            users[userIndex].password = password;
        }

        await writer(users)

        res.status(201).send(users[userIndex]);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.delete('/users/:userId', async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        const users = JSON.parse(await reader())
        const userIndex = users.findIndex(user => user.id === userId);
        if (userIndex === -1) {
            return res.status(404).send('User not found');
        }

        users.splice(userIndex, 1);
        await writer(users)

        res.sendStatus(204);
    } catch (e) {
        res.status(500).send(e.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});