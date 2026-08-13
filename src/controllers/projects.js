// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { 
    getUpcomingProjects, 
    getProjectDetails, 
    createProject, 
    updateProject,
    isUserVolunteeringForProject,
    addVolunteerToProject,
    removeVolunteerFromProject
} from '../models/projects.js';
//Added assignment w3---
import { getCategoriesByProjectId } from '../models/categories.js';
import { getAllOrganizations } from '../models/organizations.js';
import { body, validationResult } from 'express-validator';


// added by w3 goup activity
const NUMBER_OF_UPCOMING_PROJECTS = 5;


// W04 - Project validation rules
const projectValidation = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required')
        .isLength({ max: 200 })
        .withMessage('Location must be less than 200 characters'),

    body('date')
        .notEmpty()
        .withMessage('Date is required')
        .isISO8601()
        .withMessage('Date must be a valid date format'),

    body('organizationId')
        .notEmpty()
        .withMessage('Organization is required')
        .isInt()
        .withMessage('Organization must be a valid integer')
];

// Define any controller functions
const showProjectsPage = async (req, res) => {
    // const projects = await getAllProjects();
    // const title = 'Service Projects';
    const projects = await getUpcomingProjects(NUMBER_OF_UPCOMING_PROJECTS);
    const title = 'Upcoming Service Projects';

    res.render('projects', { title, projects });
};  


// added by w3 goup activity
const showProjectDetailsPage = async (req, res) => {
    const id = req.params.id;

    const project = await getProjectDetails(id);
    // const title = project.title;
    // res.render('project', { title, project });

    // added by w3 assignment
    const categories = await getCategoriesByProjectId(id);

    let isVolunteering = false;

    //W06
    if (req.session && req.session.user) {
        isVolunteering = await isUserVolunteeringForProject(
            req.session.user.user_id,
            id
        );
    }


    const title = `${project.title} Details`;

    res.render('project', {
        title,
        project,
        categories,
        isVolunteering
    });
};


// W04 - Display the new project form
const showNewProjectForm = async (req, res) => {
    const organizations = await getAllOrganizations();
    const title = 'Add New Service Project';

    res.render('new-project', { title, organizations });
};

// W04 - Process new project form submission
const processNewProjectForm = async (req, res) => {
        // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // Loop through validation errors and flash them
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Redirect back to the new project form
        return res.redirect('/new-project');
    }


     // Extract form data from req.body
    const { title, description, location, date, organizationId } = req.body;

    try {
        // Create the new project in the database
        const newProjectId = await createProject(
            title,
            description,
            location,
            date,
            organizationId
        );

        req.flash('success', 'New service project created successfully!');

        res.redirect(`/project/${newProjectId}`);
    } catch (error) {
        console.error('Error creating new project:', error);

        req.flash(
            'error',
            'There was an error creating the service project.'
        );

        res.redirect('/new-project');
    }
};


// W04 Team Activity - Display edit project form
const showEditProjectForm = async (req, res) => {
    const projectId = req.params.id;

    const projectDetails = await getProjectDetails(projectId);
    const organizations = await getAllOrganizations();

    const title = 'Edit Service Project';

    res.render('edit-project', {
        title,
        projectDetails,
        organizations
    });
};

// W04 Team Activity - Process edit project form
const processEditProjectForm = async (req, res) => {
        // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        // Return to the edit form
        return res.redirect(`/edit-project/${req.params.id}`);
    }

    const projectId = req.params.id;

    const {
        title,
        description,
        location,
        date,
        organizationId
    } = req.body;

    await updateProject(
        projectId,
        title,
        description,
        location,
        date,
        organizationId
    );

    req.flash('success', 'Service project updated successfully!');

    res.redirect(`/project/${projectId}`);
};


// W06 - Add logged-in user as volunteer
const processVolunteerForProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await addVolunteerToProject(userId, projectId);

    req.flash('success', 'You are now volunteering for this project!');

    res.redirect(`/project/${projectId}`);
};


// W06 - Remove logged-in user as volunteer
const processRemoveVolunteerFromProject = async (req, res) => {
    const projectId = req.params.id;
    const userId = req.session.user.user_id;

    await removeVolunteerFromProject(userId, projectId);

    req.flash('success', 'You are no longer volunteering for this project.');

    res.redirect(`/project/${projectId}`);
};



// Export any controller functions
export { 
    showProjectsPage, 
    showProjectDetailsPage,
    showNewProjectForm,
    processNewProjectForm,
    projectValidation,
    showEditProjectForm,
    processEditProjectForm,
    processVolunteerForProject,
    processRemoveVolunteerFromProject
 };