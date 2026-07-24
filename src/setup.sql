-- ========================================
-- Organization Table
-- ========================================
CREATE TABLE organization (
    organization_id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    contact_email VARCHAR(255) NOT NULL,
    logo_filename VARCHAR(255) NOT NULL
);


-- ========================================
-- Insert sample data: Organizations
-- ========================================
INSERT INTO organization (name, description, contact_email, logo_filename)
VALUES
('BrightFuture Builders', 'A nonprofit focused on improving community infrastructure through sustainable construction projects.', 'info@brightfuturebuilders.org', 'brightfuture-logo.png'),
('GreenHarvest Growers', 'An urban farming collective promoting food sustainability and education in local neighborhoods.', 'contact@greenharvest.org', 'greenharvest-logo.png'),
('UnityServe Volunteers', 'A volunteer coordination group supporting local charities and service initiatives.', 'hello@unityserve.org', 'unityserve-logo.png');


SELECT * FROM organization;



-- ========================================
-- Service Project Table
-- ========================================
CREATE TABLE service_project (
    project_id SERIAL PRIMARY KEY,
    organization_id INT NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    location VARCHAR(150) NOT NULL,
    project_date DATE NOT NULL,

    CONSTRAINT fk_organization
        FOREIGN KEY (organization_id)
        REFERENCES organization (organization_id)
);

SELECT * FROM service_project;


-- ========================================
-- Insert sample data: Service Projects
-- ========================================

INSERT INTO service_project
(organization_id, title, description, location, project_date)
VALUES

-- BrightFuture Builders (organization_id = 1)
(1, 'Community Center Repair',
'Repair and repaint rooms in a neighborhood community center.',
'Downtown Community Center',
'2027-06-06'),

(1, 'Accessible Ramp Build',
'Build accessibility ramps for residents who need safer home entry.',
'Westside Neighborhood',
'2027-06-13'),

(1, 'School Playground Refresh',
'Install mulch, repaint equipment, and clean the school playground.',
'Lincoln Elementary School',
'2027-06-20'),

(1, 'Senior Home Safety Day',
'Help install handrails, replace bulbs, and complete minor safety fixes.',
'Maple Grove Senior Housing',
'2027-06-27'),

(1, 'Neighborhood Tool Library Setup',
'Organize donated tools and prepare shelves for a community tool library.',
'BrightFuture Workshop',
'2027-07-11'),

-- GreenHarvest Growers (organization_id = 2)
(2, 'Urban Garden Planting',
'Plant vegetables and herbs in raised garden beds for the community.',
'GreenHarvest Teaching Garden',
'2027-06-04'),

(2, 'Compost Education Day',
'Teach residents how to compost food scraps and reduce waste.',
'Riverside Farmers Market',
'2027-06-12'),

(2, 'Food Pantry Harvest',
'Harvest fresh produce and prepare donations for a local food pantry.',
'GreenHarvest Urban Farm',
'2027-06-18'),

(2, 'Community Orchard Cleanup',
'Prune trees, remove debris, and prepare the orchard for summer growth.',
'Eastside Community Orchard',
'2027-06-25'),

(2, 'Youth Gardening Workshop',
'Help children learn basic planting, watering, and harvesting skills.',
'Neighborhood Learning Center',
'2027-07-09'),

-- UnityServe Volunteers (organization_id = 3)
(3, 'Charity Supply Sorting',
'Sort donated clothing, hygiene kits, and household supplies.',
'UnityServe Donation Center',
'2027-06-05'),

(3, 'Park Cleanup Crew',
'Remove litter, clear walking paths, and beautify a local park.',
'Heritage Park',
'2027-06-14'),

(3, 'Community Tutoring Night',
'Support students with reading, math, and homework help.',
'UnityServe Learning Lab',
'2027-06-19'),

(3, 'Meal Kit Assembly',
'Assemble shelf-stable meal kits for families in need.',
'UnityServe Volunteer Hall',
'2027-06-26'),

(3, 'Back-to-School Drive Prep',
'Organize backpacks, notebooks, and supplies for distribution.',
'UnityServe Warehouse',
'2027-07-10');

SELECT * FROM service_project;


CREATE TABLE category (
    category_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE
);


CREATE TABLE project_category (
    project_id INT NOT NULL,
    category_id INT NOT NULL,

    PRIMARY KEY (project_id, category_id),

    FOREIGN KEY (project_id)
        REFERENCES service_project(project_id),

    FOREIGN KEY (category_id)
        REFERENCES category(category_id)
);


SELECT * FROM category;

SELECT * FROM project_category;


-- ========================================
-- Insert sample data: Categories
-- ========================================

INSERT INTO category (name)
VALUES
('Community Service'),
('Educational'),
('Environmental'),
('Health and Wellness');


SELECT * FROM category;


-- ========================================
-- Associate Projects with Categories
-- ========================================

INSERT INTO project_category (project_id, category_id)
VALUES
-- BrightFuture Builders
(1,1),
(2,1),
(3,1),
(4,4),
(5,1),

-- GreenHarvest Growers
(6,3),
(7,2),
(7,3),
(8,1),
(9,3),
(10,2),
(10,3),

-- UnityServe Volunteers
(11,1),
(12,1),
(12,3),
(13,2),
(14,1),
(15,2);


SELECT * FROM project_category;