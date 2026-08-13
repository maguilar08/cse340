// Import any needed model functions
import {
    getAllCategories 
} from '../models/categories.js';
// Added Asignment3
import { 
    getCategoryDetails, 
    getProjectsByCategoryId 
} from '../models/categories.js';
import {
    getCategoriesByProjectId,
    updateCategoryAssignments,
    createCategory,
    updateCategory
} from '../models/categories.js';
import { 
    getProjectDetails 
} from '../models/projects.js';
import { body, validationResult } from 'express-validator';

// W04 Assignment - Category validation rules
const categoryValidation = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage('Category name is required')
        .isLength({ min: 3, max: 100 })
        .withMessage('Category name must be between 3 and 100 characters')
];


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


// W04 Assignment - Display new category form
const showNewCategoryForm = async (req, res) => {
    const title = 'Add New Category';

    res.render('new-category', { title });
};

// W04 Assignment - Process new category form
const processNewCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect('/new-category');
    }

    const { name } = req.body;

    const categoryId = await createCategory(name);

    req.flash('success', 'Category created successfully!');

    res.redirect(`/category/${categoryId}`);
};

// W04 Assignment - Display edit category form
const showEditCategoryForm = async (req, res) => {
    const categoryId = req.params.id;

    const categoryDetails = await getCategoryDetails(categoryId);

    const title = 'Edit Category';

    res.render('edit-category', {
        title,
        categoryDetails
    });
};

// W04 Assignment - Process edit category form
const processEditCategoryForm = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        errors.array().forEach((error) => {
            req.flash('error', error.msg);
        });

        return res.redirect(`/edit-category/${req.params.id}`);
    }

    const categoryId = req.params.id;
    const { name } = req.body;

    await updateCategory(categoryId, name);

    req.flash('success', 'Category updated successfully!');

    res.redirect(`/category/${categoryId}`);
};

// Export any controller functions
export { 
    showCategoriesPage, 
    showCategoryDetailsPage,
    showAssignCategoriesForm,
    processAssignCategoriesForm,
    categoryValidation,
    showNewCategoryForm,
    processNewCategoryForm,
    showEditCategoryForm,
    processEditCategoryForm

};

