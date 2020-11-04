const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dotenv = require('dotenv');
const { UserRoutes, AuthRoutes } = require('ngcsusers');
const { AdminRoutes, initAdminDB } = require('ngcsadmin');
const { GroupRoutes } = require('ngcsgroups');
const { ToolRoutes, ModuleRoutes, EnvironmentRoutes, initToolsDB } = require('ngcstools');

dotenv.config();
const app = express();

const PORT = process.env.PORT || 5000;
const DB_CONNECTION = process.env.DB_CONNECTION;

console.log(DB_CONNECTION);
app.use(bodyparser.json());

app.use('/admin', AdminRoutes());
app.use(UserRoutes());
app.use(AuthRoutes());
app.use(GroupRoutes());
app.use(ToolRoutes());
app.use(ModuleRoutes());
app.use(EnvironmentRoutes());

app.get('/', (req, res) => res.sendFile(path.join(__dirname, './public', 'index.html')));

app.use((req, res, next) => {
    res.status(404).render('404', { pageTitle: 'Page Not Found', path: '/404' });
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
        app.listen(PORT, () => console.log(`Listening on ${PORT}`));
    })
    .catch(err => {
        console.log(err);
    });


