import db from './db.js';

const getAllCategories = async () => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.category
        ORDER BY name;
    `;

    const result = await db.query(query);

    return result.rows;
}
// Added Asignment3
const getCategoryDetails = async (id) => {
    const query = `
        SELECT
            category_id,
            name
        FROM public.category
        WHERE category_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};
// Added Asignment3
const getCategoriesByProjectId = async (projectId) => {
    const query = `
        SELECT
            c.category_id,
            c.name
        FROM public.project_category pc
        JOIN public.category c
            ON pc.category_id = c.category_id
        WHERE pc.project_id = $1
        ORDER BY c.name;
    `;

    const queryParams = [projectId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// Added Asignment3
const getProjectsByCategoryId = async (categoryId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.project_date
        FROM public.project_category pc
        JOIN public.service_project sp
            ON pc.project_id = sp.project_id
        WHERE pc.category_id = $1
        ORDER BY sp.project_date;
    `;

    const queryParams = [categoryId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

//W04 add 6 topic
const assignCategoryToProject = async (projectId, categoryId) => {
    const query = `
        INSERT INTO project_category (project_id, category_id)
        VALUES ($1, $2);
    `;

    await db.query(query, [projectId, categoryId]);
};

const updateCategoryAssignments = async (projectId, categoryIds) => {
    // Remove all existing category assignments
    const deleteQuery = `
        DELETE FROM project_category
        WHERE project_id = $1;
    `;

    await db.query(deleteQuery, [projectId]);

    // Add the new assignments
    for (const categoryId of categoryIds) {
        await assignCategoryToProject(projectId, categoryId);
    }
};


// W04 Assignment - Create a new category
const createCategory = async (name) => {
    const query = `
        INSERT INTO category (name)
        VALUES ($1)
        RETURNING category_id;
    `;

    const queryParams = [name];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create category');
    }

    return result.rows[0].category_id;
};

// W04 Assignment - Update an existing category
const updateCategory = async (categoryId, name) => {
    const query = `
        UPDATE category
        SET name = $1
        WHERE category_id = $2
        RETURNING category_id;
    `;

    const queryParams = [name, categoryId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Category not found');
    }

    return result.rows[0].category_id;
};





export { 
    getAllCategories, 
    getCategoryDetails, 
    getCategoriesByProjectId, 
    getProjectsByCategoryId,
    updateCategoryAssignments, 
    createCategory,
    updateCategory
};