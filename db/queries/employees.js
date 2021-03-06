const { dbConn } = require('../server');

class Connection {
    constructor(db) {
        this.db = db
    };
    // METHODS TO RETURN QUERY RESULTS FOR EMPLOYEES TABLE
    getAllEmployees = async () => {
        const query = `
        SELECT employees.id as ID, 
        CONCAT(employees.first_name, ' ', employees.last_name) AS Employee, 
        title AS Title, 
        salary AS Salary, 
        dept_name AS Department, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS Manager 
        FROM employees 
        INNER JOIN roles 
        ON employees.role_id = roles.id 
        INNER JOIN departments 
        ON roles.department_id = departments.id 
        LEFT JOIN employees manager 
        ON manager.id = employees.manager_id
        ORDER BY id;`
        const allEmployees = (await this.db).query(query);
        return allEmployees
    };

    getEmployeeIDbyFullName = async (fullName) => {
        const splitName = fullName.split(" ");
        const values = [splitName[0], splitName[1]];
        const query = 'SELECT id FROM employees WHERE first_name = ? AND last_name = ?;';
        const getEmployeeIDbyFullName = (await this.db).query(query, values);
        return getEmployeeIDbyFullName;
    };

    addEmployee = async (values) => {
        const query = 'INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?);';
        const addEmployee = (await this.db).query(query, values);
        return addEmployee;
    };

    getManagerFullName = async(manager_id) => {
        const query = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Manager FROM employees WHERE id = ?`;
        const getEmployeeFullName = (await this.db).query(query, manager_id);
        return getEmployeeFullName;
    }

    getEmployeesFullName = async () => {
        const query = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Employee FROM employees`;
        const getEmployeeFullName = (await this.db).query(query);
        return getEmployeeFullName;
    };

    updateEmpRole = async (values) => {
        const query = 'UPDATE employees SET role_id = ? WHERE id = ?';
        const updateEmpRole = (await this.db).query(query, values);
        return updateEmpRole;
    };

    deleteEmployee = async (empID) => {
        const query = 'DELETE FROM employees WHERE id = ?';
        const updateEmpRole = (await this.db).query(query, empID);
        return updateEmpRole;
    };

    getManagersByEmpID = async (empID) => {
        const query = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Manager FROM employees WHERE id <> ?`;
        const managers = (await this.db).query(query, empID);
        return managers;
    };

    getEmpManagers = async () => {
        const query = `SELECT DISTINCT CONCAT(e.first_name , ' ', e.last_name) AS name FROM employees e JOIN employees m ON e.id = m.manager_id; `;
        const managers = (await this.db).query(query);
        return managers;
    };

    updateEmpManager = async (values) => {
        const query = 'UPDATE employees SET manager_id =? where id = ?';
        const updateEmpManager = (await this.db).query(query, values);
        return updateEmpManager;
    };

    getEmployeesByManager = async (manager_id) => {
        const query = `SELECT CONCAT(first_name, ' ', last_name) AS Employee FROM employees WHERE manager_id = ?`;
        const getEmployeesByManager = (await this.db).query(query, manager_id);
        return getEmployeesByManager;
    };

    getEmployeesByDepartment = async(department_id) => {
        const query = `SELECT CONCAT(employees.first_name, ' ', employees.last_name) AS Employee FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON departments.id = roles.department_id AND departments.id = ?`;
        const getEmployeesByDepartment = (await this.db).query(query, department_id);
        return getEmployeesByDepartment;
    };
}

module.exports = new Connection(dbConn());

