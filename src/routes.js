import express from 'express';

import { showHomePage } from './controllers/index.js';

import { showOrganizationsPage } from './controllers/organizations.js';

import { 
    showProjectsPage,
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    processVolunteerForProject,
    processRemoveVolunteerFromProject
} from './controllers/projects.js';

import { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    showNewCategoryForm,
    processNewCategoryForm,
    categoryValidation,
    showEditCategoryForm,
    processEditCategoryForm
} from './controllers/categories.js';

import { testErrorPage } from './controllers/errors.js';

import { showOrganizationDetailsPage } from './controllers/organizations.js';

import { 
    showNewOrganizationForm,
    processNewOrganizationForm,
    organizationValidation, 
    showEditOrganizationForm,
    processEditOrganizationForm
} from './controllers/organizations.js';

import {
    showUserRegistrationForm,
    processUserRegistrationForm,
    showLoginForm,
    processLoginForm,
    processLogout,
    requireLogin,
    showDashboard,
    requireRole,
    showUsersPage
} from './controllers/users.js';


const router = express.Router();

router.get('/', showHomePage);
router.get('/organizations', showOrganizationsPage);
router.get('/projects', showProjectsPage);
router.get('/project/:id', showProjectDetailsPage);
router.get('/categories', showCategoriesPage);
router.get('/category/:id', showCategoryDetailsPage);
// Route for new organization page
router.get('/new-organization', requireRole('admin'), showNewOrganizationForm);
// Route to handle new organization form submission
router.post('/new-organization', requireRole('admin'), organizationValidation, processNewOrganizationForm);
// Route for organization details page
router.get('/organization/:id', showOrganizationDetailsPage);
// Route to display the edit organization form
router.get('/edit-organization/:id', requireRole('admin'), showEditOrganizationForm);
// Route to handle the edit organization form submission
router.post('/edit-organization/:id', requireRole('admin'), organizationValidation, processEditOrganizationForm);
// Route for new project page
router.get('/new-project', requireRole('admin'), showNewProjectForm);
// Route to handle new project form submission
router.post('/new-project', requireRole('admin'), projectValidation, processNewProjectForm);
// W04 - Routes to assign categories to a project
// Routes to handle the assign categories to project form
router.get('/assign-categories/:projectId',requireRole('admin'), showAssignCategoriesForm);
router.post('/assign-categories/:projectId', requireRole('admin'), processAssignCategoriesForm);
// W04 Team Activity - Edit Service Project
router.get('/edit-project/:id', requireRole('admin'), showEditProjectForm);
router.post('/edit-project/:id', requireRole('admin'), projectValidation, processEditProjectForm);
// W04 Assignment - Create Category
router.get('/new-category', requireRole('admin'), showNewCategoryForm);
router.post('/new-category', requireRole('admin'), categoryValidation, processNewCategoryForm);
// W04 Assignment - Edit Category
router.get('/edit-category/:id', requireRole('admin'), showEditCategoryForm);
router.post('/edit-category/:id', requireRole('admin'), categoryValidation, processEditCategoryForm);
// User registration routes
router.get('/register', showUserRegistrationForm);
router.post('/register', processUserRegistrationForm);
// W05 - User login routes
router.get('/login', showLoginForm);
router.post('/login', processLoginForm);
router.get('/logout', processLogout);
// W05 Assignment - Admin-only users page
router.get('/users', requireRole('admin'), showUsersPage);
// W06 - Volunteer routes
router.post('/project/:id/volunteer', requireLogin, processVolunteerForProject);
router.post('/project/:id/remove-volunteer', requireLogin, processRemoveVolunteerFromProject);


// error-handling routes
router.get('/test-error', testErrorPage);
// Protected dashboard route
router.get('/dashboard', requireLogin, showDashboard);

export default router;