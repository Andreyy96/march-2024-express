import express, { NextFunction, Request, Response } from "express";

import { ApiError } from "./errors/api-error";
import { userRouter } from "./routers/user.router";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);

// app.put('/users/:userId', async (req, res) => {
//     try {
//         const userId = Number(req.params.userId);
//         const users = JSON.parse(await reader())
//
//         const userIndex = users.findIndex(user => user.id === userId);
//
//         if (userIndex === -1) {
//             return res.status(404).send('User not found');
//         }
//
//         const {name, email, password} = req.body;
//         const user = users.find(user => user.email === email);
//
//         if(name.length >= 3) {
//             users[userIndex].name = name;
//         }
//
//         if(regEmail.test(email) && ! user) {
//             users[userIndex].email = email;
//         }
//
//         if(regPassword.test(password) ) {
//             users[userIndex].password = password;
//         }
//
//         await writer(users)
//
//         res.status(201).send(users[userIndex]);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });
//
// app.delete('/users/:userId', async (req, res) => {
//     try {
//         const userId = Number(req.params.userId);
//         const users = JSON.parse(await reader())
//         const userIndex = users.findIndex(user => user.id === userId);
//         if (userIndex === -1) {
//             return res.status(404).send('User not found');
//         }
//
//         users.splice(userIndex, 1);
//         await writer(users)
//
//         res.sendStatus(204);
//     } catch (e) {
//         res.status(500).send(e.message);
//     }
// });

app.use(
  "*",
  (error: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).send(error.message);
  },
);

process.on("uncaughtException", (error) => {
  console.error("uncaughtException", error.message, error.stack);
  process.exit(1);
});

app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
