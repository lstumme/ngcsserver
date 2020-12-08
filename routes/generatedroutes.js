const express = require('express');
const isAuth = require('../middleware/is-auth');
const isToolManager = require('../middlewate/is-toolmanager');
const isAdmin = require('../middleware/is-admin');
const { RoleController } = require('ngcsroles');
const { UserController } = require('ngcsusers');
const { ToolController, ToolVersionController, ModuleController, ModuleVersionController, EnvironmentController } = require('ngcstools');

const initRouter = () => {
    const router = express.Router();

	router.post('/createRole', isAuth, isAdmin, RoleController.createRole);
	router.delete('/deleteRole', isAuth, isAdmin, RoleController.deleteRole);
	router.get('/getRoles', isAuth, isAdmin, RoleController.getRoles);
	router.get('/getRole', isAuth, isAdmin, RoleController.getRole);
	router.get('/findRoleByName', isAuth, isAdmin, RoleController.findRoleByName);
	router.get('/findRoleByLabel', isAuth, isAdmin, RoleController.findRoleByLabel);
	router.put('/addSubRoleToRole', isAuth, isAdmin, RoleController.addSubRoleToRole);
	router.put('/removeSubRoleFromRole', isAuth, isAdmin, RoleController.removeSubRoleFromRole);

	router.post('/createUser', isAuth, isAdmin, UserController.createUser);
	router.delete('/deleteUser', isAuth, isAdmin, UserController.deleteUser);
	router.get('/getUsers', isAuth, isAdmin, UserController.getUsers);
	router.get('/getUser', isAuth, isAdmin, UserController.getUser);
	router.put('/updateUser', isAuth, isAdmin, UserController.deleteUser);
	router.put('/updateUserPassword', isAuth, isAdmin, UserController.updateUserPassword);
	router.get('/findUserByLogin', isAuth, isAdmin, UserController.findUserByLogin);
	router.get('/findUserByEmail', isAuth, isAdmin, UserController.findUserByEmail);

	router.post('/createTool', isAuth, isToolManager, ToolController.createTool);
	router.delete('/deleteTool', isAuth, isToolManager, ToolController.deleteTool);
	router.get('/getTools', isAuth, isToolManager, ToolController.getTools);
	router.get('/getTool', isAuth, isToolManager, ToolController.getTool);
	router.put('/updateTool', isAuth, isToolManager, ToolController.deleteTool);
	router.get('/findToolByName', isAuth, isToolManager, ToolController.findToolByName);

	router.post('/createToolVersion', isAuth, isToolManager, ToolVersionController.createToolVersion);
	router.delete('/deleteToolVersion', isAuth, isToolManager, ToolVersionController.deleteToolVersion);
	router.get('/getToolVersions', isAuth, isToolManager, ToolVersionController.getToolVersions);
	router.get('/getToolVersion', isAuth, isToolManager, ToolVersionController.getToolVersion);
	router.put('/updateToolVersion', isAuth, isToolManager, ToolVersionController.deleteToolVersion);

	router.post('/createModule', isAuth, isToolManager, ModuleController.createModule);
	router.delete('/deleteModule', isAuth, isToolManager, ModuleController.deleteModule);
	router.get('/getModules', isAuth, isToolManager, ModuleController.getModules);
	router.get('/getModule', isAuth, isToolManager, ModuleController.getModule);
	router.put('/updateModule', isAuth, isToolManager, ModuleController.deleteModule);
	router.get('/findModuleByName', isAuth, isToolManager, ModuleController.findModuleByName);

	router.post('/createModuleVersion', isAuth, isToolManager, ModuleVersionController.createModuleVersion);
	router.delete('/deleteModuleVersion', isAuth, isToolManager, ModuleVersionController.deleteModuleVersion);
	router.get('/getModuleVersions', isAuth, isToolManager, ModuleVersionController.getModuleVersions);
	router.get('/getModuleVersion', isAuth, isToolManager, ModuleVersionController.getModuleVersion);
	router.put('/updateModuleVersion', isAuth, isToolManager, ModuleVersionController.deleteModuleVersion);

	router.post('/createEnvironment', isAuth, EnvironmentController.createEnvironment);
	router.delete('/deleteEnvironment', isAuth, EnvironmentController.deleteEnvironment);
	router.get('/getEnvironments', isAuth, EnvironmentController.getEnvironments);
	router.get('/getEnvironment', isAuth, EnvironmentController.getEnvironment);
	router.put('/updateEnvironment', isAuth, EnvironmentController.deleteEnvironment);
	router.get('/findEnvironmentByName', isAuth, EnvironmentController.findEnvironmentByName);
	router.put('/addModuleVersionToEnvironment', isAuth, EnvironmentController.addModuleVersionToEnvironment);
	router.put('/removeModuleVersionFromEnvironment', isAuth, EnvironmentController.removeModuleVersionFromEnvironment);
	router.put('/addToolVersionToEnvironment', isAuth, EnvironmentController.addToolVersionToEnvironment);
	router.put('/removeToolVersionFromEnvironment', isAuth, EnvironmentController.removeToolVersionFromEnvironment);

	return router;
};

module.exports = initRouter;
