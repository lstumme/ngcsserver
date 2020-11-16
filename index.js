const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const { UserRoutes, AuthRoutes, initUsersDB } = require('ngcsusers');
const { AdminRoutes, initAdminDB } = require('ngcsadmin');
const { ToolRoutes, ModuleRoutes, EnvironmentRoutes, initToolsDB } = require('ngcstools');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

console.log(DB_CONNECTION);
console.log(process.env.SECRET_KEY);
app.use(cors());
app.use(bodyparser.json());

app.use('/admin', AdminRoutes());
app.use(UserRoutes());
app.use(AuthRoutes());
app.use(ToolRoutes());
app.use(ModuleRoutes());
app.use(EnvironmentRoutes());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public', 'index.html')));

app.use((req, res, next) => {
    next({ statusCode: 404, message: 'Page Not Found' });
});

app.use((err, req, res, next) => {
    res.status(err.statusCode).json({ message: err.message });
});

mongoose.connect(DB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
})
    .then(result => {
        return initAdminDB();
    })
    .then(result => {
        return initToolsDB();
    })
    .then(result => {
        return initUsersDB();
    })
    .then(result => {
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch(err => {
        console.log(err);
    });


