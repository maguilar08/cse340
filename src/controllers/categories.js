// Import any needed model functions
import { getAllCategories } from '../models/categories.js';
// Added Asignment3
import { getCategoryDetails, getProjectsByCategoryId } from '../models/categories.js';
import {
    getCategoriesByProjectId,
    updateCategoryAssignments
} from '../models/categories.js';
import { getProjectDetails } from '../models/projects.js';


// Define any controller functions
const showCategoriesPage = async (req, res) => {
    const categories = await getAllCategories();
    const title = 'Service Categories';

    res.render('categories', { title, categories });
};  

// Added Asignment3
const showCategoryDetailsPage = async (req, res) => {
    const id = req.params.id;

    const category = await getCategoryDetails(id);
    const projects = await getProjectsByCategoryId(id);

    const title = category.name;

    res.render('category', {
        title,
        category,
        projects
    });
};


// W04 - Display the form to assign categories to a project
const showAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const projectDetails = await getProjectDetails(projectId);
    const categories = await getAllCategories();
    const assignedCategories = await getCategoriesByProjectId(projectId);

    const title = 'Assign Categories to Project';

    res.render('assign-categories', {
        title,
        projectId,
        projectDetails,
        categories,
        assignedCategories
    });
};
// W04 - Process category assignments for a project
const processAssignCategoriesForm = async (req, res) => {
    const projectId = req.params.projectId;

    const selectedCategoryIds = req.body.categoryIds || [];

    // Make sure selectedCategoryIds is always an array
    const categoryIdsArray = Array.isArray(selectedCategoryIds)
        ? selectedCategoryIds
        : [selectedCategoryIds];

    await updateCategoryAssignments(projectId, categoryIdsArray);

    req.flash('success', 'Categories updated successfully.');

    res.redirect(`/project/${projectId}`);
};

// Export any controller functions
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm
};