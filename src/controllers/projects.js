// Import any needed model functions
import { getAllProjects } from '../models/projects.js';
import { getUpcomingProjects, getProjectDetails } from '../models/projects.js';
//Added assignment w3---
import { getCategoriesByProjectId } from '../models/categories.js';


// added by w3 goup activity
const NUMBER_OF_UPCOMING_PROJECTS = 5;

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
    const title = `${project.title} Details`;

    res.render('project', {
        title,
        project,
        categories
    });
};

// Export any controller functions
export { showProjectsPage, showProjectDetailsPage };