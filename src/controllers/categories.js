// Import any needed model functions
import { getAllCategories } from '../models/categories.js';
// Added Asignment3
import { getCategoryDetails, getProjectsByCategoryId } from '../models/categories.js';


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

// Export any controller functions
export { showCategoriesPage, showCategoryDetailsPage };