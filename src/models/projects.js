import db from './db.js';

const getAllProjects = async () => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query);

    return result.rows;
}

//Group activity added
const getUpcomingProjects = async (number_of_projects) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_date >= CURRENT_DATE
        ORDER BY sp.project_date ASC
        LIMIT $1;
    `;

    const queryParams = [number_of_projects];
    const result = await db.query(query, queryParams);

    return result.rows;
};

//Group activity added
const getProjectDetails = async (id) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.project_date,
            sp.location,
            sp.organization_id,
            o.name AS organization_name
        FROM public.service_project sp
        JOIN public.organization o
            ON sp.organization_id = o.organization_id
        WHERE sp.project_id = $1;
    `;

    const queryParams = [id];
    const result = await db.query(query, queryParams);

    return result.rows[0];
};

// w03 added route and query parameters
// const getProjectsByOrganizationId = async (organizationId) => {
//     const query = `
//       SELECT
//         project_id,
//         organization_id,
//         title,
//         description,
//         location,
//         date
//       FROM project
//       WHERE organization_id = $1
//       ORDER BY date;
//     `;
    
//     const queryParams = [organizationId];
//     const result = await db.query(query, queryParams);

//     return result.rows;
// };
//to replacceeeeeeeeeeeeeeee
const getProjectsByOrganizationId = async (organizationId) => {
    const query = `
        SELECT
            project_id,
            organization_id,
            title,
            description,
            location,
            project_date
        FROM public.service_project
        WHERE organization_id = $1
        ORDER BY project_date;
    `;

    const queryParams = [organizationId];
    const result = await db.query(query, queryParams);

    return result.rows;
};

// W04 added Repeat the process: Inserting New Service Projects
const createProject = async (title, description, location, date, organizationId) => {
    // Always remember: the table is service_project
    // and the date column is project_date
    const query = `
      INSERT INTO service_project (title, description, location, project_date, organization_id)  
      VALUES ($1, $2, $3, $4, $5)
      RETURNING project_id;
    `;

    const queryParams = [title, description, location, date, organizationId];
    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Failed to create project');
    }

    if (process.env.ENABLE_SQL_LOGGING === 'true') {
        console.log('Created new project with ID:', result.rows[0].project_id);
    }

    return result.rows[0].project_id;
}


// W04 Team Activity - Update an existing service project
const updateProject = async (
    projectId,
    title,
    description,
    location,
    date,
    organizationId
) => {
    const query = `
        UPDATE service_project
        SET title = $1,
            description = $2,
            location = $3,
            project_date = $4,
            organization_id = $5
        WHERE project_id = $6
        RETURNING project_id;
    `;

    const queryParams = [
        title,
        description,
        location,
        date,
        organizationId,
        projectId
    ];

    const result = await db.query(query, queryParams);

    if (result.rows.length === 0) {
        throw new Error('Project not found');
    }

    return result.rows[0].project_id;
};


// W06 - Add a user as a volunteer for a project
const addVolunteerToProject = async (userId, projectId) => {
    const query = `
        INSERT INTO project_volunteer (user_id, project_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, project_id) DO NOTHING;
    `;

    await db.query(query, [userId, projectId]);
};


// W06 - Remove a user from a project
const removeVolunteerFromProject = async (userId, projectId) => {
    const query = `
        DELETE FROM project_volunteer
        WHERE user_id = $1
          AND project_id = $2;
    `;

    await db.query(query, [userId, projectId]);
};


// W06 - Get projects a user has volunteered for
const getVolunteerProjectsByUserId = async (userId) => {
    const query = `
        SELECT
            sp.project_id,
            sp.title,
            sp.description,
            sp.location,
            sp.project_date,
            sp.organization_id,
            o.name AS organization_name
        FROM project_volunteer pv
        JOIN service_project sp
            ON pv.project_id = sp.project_id
        JOIN organization o
            ON sp.organization_id = o.organization_id
        WHERE pv.user_id = $1
        ORDER BY sp.project_date;
    `;

    const result = await db.query(query, [userId]);

    return result.rows;
};

// W06 - Check whether a user is volunteering for a project
const isUserVolunteeringForProject = async (userId, projectId) => {
    const query = `
        SELECT 1
        FROM project_volunteer
        WHERE user_id = $1
          AND project_id = $2;
    `;

    const result = await db.query(query, [userId, projectId]);

    return result.rows.length > 0;
};


//export { getAllProjects };

// Export the model functions
export { 
    getAllProjects,
    getUpcomingProjects,
    getProjectDetails,
    getProjectsByOrganizationId,
    createProject,
    updateProject, 
    addVolunteerToProject,
    removeVolunteerFromProject,
    getVolunteerProjectsByUserId,
    isUserVolunteeringForProject
};
