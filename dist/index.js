import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
let exit = false;
await connectToDb();
function addDepartment() {
    inquirer
        .prompt([
        {
            type: 'input',
            name: 'depName',
            message: 'What is the name of the Department? '
        }
    ])
        .then((answers) => {
        pool.query(`INSERT INTO department (name) VALUES ($1);`, [answers.depName], (err, result) => {
            if (err) {
                console.log(err);
            }
            else {
                console.log(`Added ${answers.depName} to deparment`);
            }
            main();
        });
    });
}
function addRole() {
    let departments = [];
    pool.query('SELECT * FROM department', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'title',
                message: 'What is the name of the role? '
            },
            {
                type: 'input',
                name: 'salary',
                message: 'What is the salary of the role? '
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to? ',
                choices: departments.map((department) => {
                    return {
                        name: department.name,
                        value: department.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query(`INSERT INTO role (title,salary,department_id) VALUES ($1,$2,$3);`, [answers.title, answers.salary, answers.department], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`Added ${answers.title} to roles`);
                }
                main();
            });
        });
    }, 200);
}
function addEmployee() {
    let roles = [];
    let employees = [];
    pool.query('SELECT * FROM role', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            roles = result.rows;
        }
    });
    pool.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            employees = result.rows;
            employees.unshift({
                id: 0,
                first_name: 'None',
                last_name: '',
                role_id: 0,
                manager_id: null
            });
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'What is the employee\'s first name? '
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'What is the employee\'s last name? '
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s role',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    };
                })
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employee\'s manager',
                choices: employees.map((employee) => {
                    return {
                        name: employee.first_name + ' ' + employee.last_name,
                        value: employee.id
                    };
                })
            }
        ])
            .then((answers) => {
            let managerID = 0;
            employees.forEach((emp) => {
                if (emp.id === answers.manager) {
                    if (answers.manager === 0) {
                        managerID = null;
                    }
                    else {
                        managerID = answers.manager;
                    }
                }
            });
            pool.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ($1,$2,$3,$4);`, [answers.first_name, answers.last_name, answers.role, managerID], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log(`Added ${answers.first_name} ${answers.last_name} to employees`);
                }
                main();
            });
        });
    }, 200);
}
function updateEmployeeRole() {
    let roles = [];
    let employees = [];
    pool.query('SELECT * FROM role', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            roles = result.rows;
        }
    });
    pool.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            employees = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s role do you want to update? ',
                choices: employees.map((emp) => {
                    return {
                        name: emp.first_name + ' ' + emp.last_name,
                        value: emp.id
                    };
                })
            },
            {
                type: 'list',
                name: 'role',
                message: 'What is the employee\'s new role',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query(`UPDATE employee SET role_id = $1 where id = $2;`, [answers.role, answers.employee], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Updated employees Role');
                }
                main();
            });
        });
    }, 200);
}
function updateEmployeeManager() {
    let managers = [];
    let employees = [];
    pool.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            employees = result.rows;
            managers = [...employees];
            managers.unshift({
                id: 0,
                first_name: 'None',
                last_name: '',
                role_id: 0,
                manager_id: null
            });
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee\'s manager do you want to update? ',
                choices: employees.map((emp) => {
                    return {
                        name: emp.first_name + ' ' + emp.last_name,
                        value: emp.id
                    };
                })
            },
            {
                type: 'list',
                name: 'manager',
                message: 'Who is the employee\'s new manager',
                choices: managers.map((man) => {
                    return {
                        name: man.first_name + ' ' + man.last_name,
                        value: man.id
                    };
                })
            }
        ])
            .then((answers) => {
            let managerID = 0;
            managers.forEach((man) => {
                if (man.id === answers.manager) {
                    if (answers.manager === 0) {
                        managerID = null;
                    }
                    else {
                        managerID = answers.manager;
                    }
                }
            });
            if (answers.employee === answers.manager) {
                console.log("Employee can't manage themself");
                main();
            }
            else {
                pool.query(`UPDATE employee SET manager_id = $1 where id = $2`, [managerID, answers.employee], (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        console.log('Updated employees Manager');
                    }
                    main();
                });
            }
        });
    }, 200);
}
function deleteDepartment() {
    let departments = [];
    pool.query('SELECT * FROM department', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department do you want to delete? ',
                choices: departments.map((dep) => {
                    return {
                        name: dep.name,
                        value: dep.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query(`DELETE FROM employee USING role WHERE employee.role_id = role.id AND role.department_id = $1`, [answers.department], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            pool.query(`DELETE FROM role WHERE department_id = $1`, [answers.department], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            pool.query(`DELETE FROM department WHERE id = $1`, [answers.department], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Department deleted');
                }
                main();
            });
        });
    }, 200);
}
function deleteRole() {
    let roles = [];
    pool.query('SELECT * FROM role', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            roles = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'role',
                message: 'Which role do you want to delete? ',
                choices: roles.map((role) => {
                    return {
                        name: role.title,
                        value: role.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query(`DELETE FROM employee WHERE role_id = $1`, [answers.role], (err, result) => {
                if (err) {
                    console.log(err);
                }
            });
            pool.query(`DELETE FROM role WHERE id = $1`, [answers.role], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Role deleted');
                }
                main();
            });
        });
    }, 200);
}
function deleteEmployee() {
    let employees = [];
    pool.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            employees = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'employee',
                message: 'Which employee do you want to delete? ',
                choices: employees.map((emp) => {
                    return {
                        name: emp.first_name + ' ' + emp.last_name,
                        value: emp.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query(`DELETE FROM employee WHERE id = $1`, [answers.employee], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else {
                    console.log('Employee deleted');
                }
                main();
            });
        });
    }, 200);
}
function viewEmployeeByDepartment() {
    let departments = [];
    pool.query('SELECT * FROM department', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'department',
                message: 'Which department\'s employees do you want to see? ',
                choices: departments.map((dep) => {
                    return {
                        name: dep.name,
                        value: dep.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query(`SELECT CONCAT(employee.first_name, \' \', employee.last_name) AS employee, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = $1`, [answers.department], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    console.log();
                    console.table(result.rows);
                }
                setTimeout(() => {
                    main();
                }, 200);
            });
        });
    }, 200);
}
function viewEmployeeByManager() {
    let managers = [];
    pool.query('SELECT * FROM employee', (err, result) => {
        if (err) {
            console.log(err);
            main();
        }
        else if (result) {
            managers = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
            {
                type: 'list',
                name: 'manager',
                message: 'Which manager\'s employees do you want to see? ',
                choices: managers.map((man) => {
                    return {
                        name: man.first_name + ' ' + man.last_name,
                        value: man.id
                    };
                })
            }
        ])
            .then((answers) => {
            pool.query('SELECT CONCAT(employee.first_name,\' \',employee.last_name) AS employee, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee JOIN employee m ON employee.manager_id = m.id WHERE m.id = $1', [answers.manager], (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    if (result.rows.length === 0) {
                        console.log('Does not manage any employees');
                    }
                    else {
                        console.table(result.rows);
                    }
                }
                setTimeout(() => {
                    main();
                }, 200);
            });
        });
    }, 200);
}
function main() {
    inquirer
        .prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'Update Employee Manager',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'View Employees by Manager',
                'View Employees by Department',
                'Delete Employee',
                'Delete Role',
                'Delete Department',
                'Quit'
            ]
        }
    ])
        .then((answers) => {
        if (answers.action === 'View All Employees') {
            pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name,\' \', m.last_name) as manager FROM employee LEFT JOIN employee m ON employee.manager_id = m.id OR NULL JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    console.log();
                    console.table(result.rows);
                }
            });
        }
        else if (answers.action === 'Add Employee') {
            addEmployee();
            return;
        }
        else if (answers.action === 'Update Employee Role') {
            updateEmployeeRole();
            return;
        }
        else if (answers.action === 'Update Employee Manager') {
            updateEmployeeManager();
            return;
        }
        else if (answers.action === 'View All Roles') {
            pool.query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    console.log();
                    console.table(result.rows);
                }
            });
        }
        else if (answers.action === 'Add Role') {
            addRole();
            return;
        }
        else if (answers.action === 'View All Departments') {
            pool.query('SELECT * FROM department', (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result) {
                    console.log();
                    console.table(result.rows);
                }
            });
        }
        else if (answers.action === 'Add Department') {
            addDepartment();
            return;
        }
        else if (answers.action === 'View Employees by Department') {
            viewEmployeeByDepartment();
            return;
        }
        else if (answers.action === 'View Employees by Manager') {
            viewEmployeeByManager();
            return;
        }
        else if (answers.action === 'Delete Employee') {
            deleteEmployee();
            return;
        }
        else if (answers.action === 'Delete Role') {
            deleteRole();
            return;
        }
        else if (answers.action === 'Delete Department') {
            deleteDepartment();
            return;
        }
        else if (answers.action === 'Quit') {
            exit = true;
        }
        if (exit) {
            process.exit(0);
        }
        setTimeout(() => {
            main();
        }, 200);
    });
}
main();
