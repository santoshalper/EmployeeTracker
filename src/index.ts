import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js'; 

let exit: boolean = false;

await connectToDb();

function addDepartment(): void{
    inquirer
        .prompt([
            {
                type:'input',
                name:'depName',
                message:'What is the name of the Department? '
            }
        ])
        .then((answers) => {
            pool.query(`INSERT INTO department (name) VALUES ($1);`, [answers.depName], (err:Error, result: QueryResult) => {
                if(err) {
                    console.log(err);
                }else{
                    console.log(`Added ${answers.depName} to deparment`);
                }
                main();
            })
        })
}

function addRole(): void {
    let departments: any = [];
    pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        } else if(result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {  
        inquirer
        .prompt([
            {
                type:'input',
                name:'title',
                message:'What is the name of the role? '
            },
            {
                type: 'input',
                name:'salary',
                message:'What is the salary of the role? '
            },
            {
                type: 'list',
                name: 'department',
                message: 'Which department does the role belong to? ',
                choices: departments.map((department: any) => {
                    return {
                        name: department.name,
                        value: department.id
                    }
                })
            }
        ])
        .then((answers) => {
            pool.query(`INSERT INTO role (title,salary,department_id) VALUES ($1,$2,$3);`,[answers.title, answers.salary, answers.department],(err: Error, result: QueryResult) => {
                if(err) {
                    console.log(err);
                }else{
                    console.log(`Added ${answers.title} to roles`);
                }
                main(); 
            })  
        }) 
    }, 200);
}

function addEmployee(): void{
    let roles: any = [];
    let employees: any = [];
    pool.query('SELECT * FROM role', (err: Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        } else if(result) {
            roles = result.rows;
        }
    });
    pool.query('SELECT * FROM employee', (err: Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        } else if(result) {
            employees = result.rows;
            employees.unshift({
                id: 0,
                first_name: 'None',
                last_name: '',
                role_id: 0,
                manager_id: null
            })
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'input',
                    name:'first_name',
                    message:'What is the employee\'s first name? '
                },
                {
                    type:'input',
                    name:'last_name',
                    message:'What is the employee\'s last name? '
                },
                {
                    type:'list',
                    name:'role',
                    message:'What is the employee\'s role',
                    choices: roles.map((role: any) => {
                        return {
                            name: role.title,
                            value: role.id
                        };
                    })
                },
                {
                    type:'list',
                    name:'manager',
                    message:'Who is the employee\'s manager',
                    choices: employees.map((employee: any) => {
                        return {
                            name: employee.first_name + ' ' + employee.last_name,
                            value: employee.id
                        };
                    })
                }
            ])
            .then((answers) => {
                let managerID:any = 0; 
                employees.forEach((emp:any) => {
                    if(emp.id === answers.manager){
                        if(answers.manager === 0){
                            managerID = null;
                        }
                        else{
                            managerID = answers.manager;
                        }
                    }
                })
                pool.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ($1,$2,$3,$4);`,[answers.first_name, answers.last_name, answers.role, managerID],(err: Error, result: QueryResult) => {
                    if(err) {
                        console.log(err);
                    }else{
                        console.log(`Added ${answers.first_name} ${answers.last_name} to employees`);
                    }
                    main(); 
                })                 
            })
    },200);
}

function updateEmployeeRole(): void{
    let roles: any = [];
    let employees: any = [];
    pool.query('SELECT * FROM role', (err: Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        } else if(result) {
            roles = result.rows;
        }
    });
    pool.query('SELECT * FROM employee', (err: Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        } else if(result) {
            employees = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'employee',
                    message:'Which employee\'s role do you want to update? ',
                    choices: employees.map((emp:any) => {
                        return {
                            name: emp.first_name+ ' '+ emp.last_name,
                            value: emp.id
                        }
                    })
                },
                {
                    type:'list',
                    name:'role',
                    message:'What is the employee\'s new role',
                    choices: roles.map((role: any) => {
                        return {
                            name: role.title,
                            value: role.id
                        };
                    })  
                }
            ])
            .then((answers) =>{
                pool.query(`UPDATE employee SET role_id = $1 where id = $2;`,[answers.role,answers.employee],(err:Error, result: QueryResult) => {
                    if(err) {
                        console.log(err);
                    }else{
                        console.log('Updated employees Role');
                    }
                    main();
                })
            })
    },200); 
}

function updateEmployeeManager(): void{
    let managers: any = [];
    let employees: any = [];
    pool.query('SELECT * FROM employee', (err: Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        } else if(result) {
            employees = result.rows;
            managers = [...employees];
            managers.unshift({
                id: 0,
                first_name: 'None',
                last_name: '',
                role_id: 0,
                manager_id: null
            })
            
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'employee',
                    message:'Which employee\'s manager do you want to update? ',
                    choices: employees.map((emp:any) => {
                        return {
                            name: emp.first_name+ ' '+ emp.last_name,
                            value: emp.id
                        }
                    })
                },
                {
                    type:'list',
                    name:'manager',
                    message:'Who is the employee\'s new manager',
                    choices: managers.map((man:any) => {
                        return {
                            name: man.first_name+ ' '+ man.last_name,
                            value: man.id
                        }
                    })
                }
            ])
            .then((answers) => {
                let managerID:any = 0;
                managers.forEach((man:any) => {
                    if(man.id === answers.manager){
                        if(answers.manager === 0){
                            managerID = null;
                        }
                        else{
                            managerID = answers.manager;
                        }
                    }
                })
                if(answers.employee === answers.manager){
                    console.log("Employee can't manage themself");
                    main();
                }else{
                    pool.query(`UPDATE employee SET manager_id = $1 where id = $2`,[managerID,answers.employee],(err:Error, result: QueryResult) =>{
                        if(err){
                            console.log(err);
                        }else{
                            console.log('Updated employees Manager');
                        }
                        main();
                    })
                }
            })
    },200);
}

function deleteDepartment(): void{
    let departments: any = [];
    pool.query('SELECT * FROM department',(err:Error, result: QueryResult) =>{
        if(err){
            console.log(err);
            main();
        }else if(result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'department',
                    message:'Which department do you want to delete? ',
                    choices:departments.map((dep:any) => {
                        return {
                            name:dep.name,
                            value: dep.id
                        }
                    })
                }
            ])
            .then((answers) => {
                pool.query(`DELETE FROM employee USING role WHERE employee.role_id = role.id AND role.department_id = $1`,[answers.department],(err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    }
                })
                pool.query(`DELETE FROM role WHERE department_id = $1`,[answers.department],(err:Error,result:QueryResult) => {
                    if(err){
                        console.log(err);
                    }
                })
                pool.query(`DELETE FROM department WHERE id = $1`,[answers.department],(err:Error,result:QueryResult) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Department deleted');
                    }
                    main();
                })
            })
    },200);
}

function deleteRole(): void{
    let roles:any = [];
    pool.query('SELECT * FROM role',(err:Error, result:QueryResult) => {
        if(err){
            console.log(err);
            main();
        }else if(result){
            roles = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'role',
                    message:'Which role do you want to delete? ',
                    choices:roles.map((role:any) => {
                        return {
                            name: role.title,
                            value: role.id
                        }
                    })
                }
            ])
            .then((answers) => {
                pool.query(`DELETE FROM employee WHERE role_id = $1`,[answers.role],(err:Error, result:QueryResult) => {
                    if(err){
                        console.log(err);
                    }
                })
                pool.query(`DELETE FROM role WHERE id = $1`,[answers.role], (err:Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Role deleted');
                    }
                    main();
                })
            })
    },200)
}

function deleteEmployee(): void{
    let employees: any = [];
    pool.query('SELECT * FROM employee',(err:Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        }else if(result){
            employees = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'employee',
                    message:'Which employee do you want to delete? ',
                    choices:employees.map((emp:any) => {
                        return {
                            name: emp.first_name + ' ' + emp.last_name,
                            value: emp.id
                        }
                    })
                }
            ])
            .then((answers) => {
                pool.query(`DELETE FROM employee WHERE id = $1`,[answers.employee],(err:Error, result:QueryResult) => {
                    if(err){
                        console.log(err);
                    }else{
                        console.log('Employee deleted');
                    }
                    main();
                })
            })
    },200)
}

function viewEmployeeByDepartment(): void{
    let departments: any = [];
    pool.query('SELECT * FROM department',(err:Error, result: QueryResult) =>{
        if(err){
            console.log(err);
            main();
        }else if(result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'department',
                    message:'Which department\'s employees do you want to see? ',
                    choices:departments.map((dep:any) => {
                        return {
                            name:dep.name,
                            value: dep.id
                        }
                    })
                }
            ])
            .then((answers) => {
                pool.query(`SELECT CONCAT(employee.first_name, \' \', employee.last_name) AS employee, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = $1`,[answers.department],(err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    }else if(result){
                        console.log();
                        console.table(result.rows);
                    }
                    setTimeout(() => {
                        main();
                    }, 200)
                })
            })
    }, 200);
}

function viewEmployeeByManager(): void {
    let managers: any = [];
    pool.query('SELECT * FROM employee',(err:Error, result: QueryResult) => {
        if(err){
            console.log(err);
            main();
        }else if(result){
            managers = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type: 'list',
                    name:'manager',
                    message:'Which manager\'s employees do you want to see? ',
                    choices: managers.map((man:any) => {
                        return {
                            name: man.first_name+ ' '+man.last_name,
                            value: man.id
                        }
                    })
                }
            ])
            .then((answers) => {
                pool.query('SELECT CONCAT(employee.first_name,\' \',employee.last_name) AS employee, CONCAT(m.first_name, \' \', m.last_name) AS manager FROM employee JOIN employee m ON employee.manager_id = m.id WHERE m.id = $1',[answers.manager],(err:Error, result:QueryResult) => {
                    if(err){
                        console.log(err);
                    }else if(result){
                        if(result.rows.length === 0){
                            console.log('Does not manage any employees');
                        }else{
                            console.table(result.rows);
                        }
                    }
                    setTimeout(() =>{
                        main();
                    },200);
                })
            })
    },200)
}

function totalBudgetByDepartment(): void{
    let departments: any = [];
    pool.query('SELECT * FROM department',(err:Error, result: QueryResult) =>{
        if(err){
            console.log(err);
            main();
        }else if(result) {
            departments = result.rows;
        }
    });
    setTimeout(() => {
        inquirer
            .prompt([
                {
                    type:'list',
                    name:'department',
                    message:'Which department\'s budget do you want to see? ',
                    choices:departments.map((dep:any) => {
                        return {
                            name:dep.name,
                            value: dep.id
                        }
                    })
                }
            ])
            .then((answers) => {
                pool.query(`SELECT SUM(role.salary) AS budget, department.name AS department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id WHERE department.id = $1 GROUP BY department`,[answers.department],(err:Error, result:QueryResult) => {
                    if(err){
                        console.log(err);
                    }else if (result){
                        console.log(`The budget for the ${result.rows[0].department} department is $${result.rows[0].budget}`);
                    }
                    setTimeout(() => {
                        main();
                    },200)
                })
            })
    },200)
}
function main(): void {
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
                    'View Budget for Department',
                    'Delete Employee',
                    'Delete Role',
                    'Delete Department',
                    'Quit'
                ]
            }
        ])
        .then((answers) => {
            if(answers.action === 'View All Employees'){
                pool.query('SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name as department, role.salary, CONCAT(m.first_name,\' \', m.last_name) as manager FROM employee LEFT JOIN employee m ON employee.manager_id = m.id OR NULL JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id', (err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    } else if(result) {
                        console.log();
                        console.table(result.rows);
                    }
                });
            }
            else if(answers.action === 'Add Employee') {
                addEmployee();
                return;
            }
            else if(answers.action === 'Update Employee Role'){
                updateEmployeeRole();
                return;
            }
            else if(answers.action === 'Update Employee Manager'){
                updateEmployeeManager();
                return;
            }
            else if(answers.action === 'View All Roles'){
                pool.query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id', (err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    } else if(result) {
                        console.log();
                        console.table(result.rows);
                    }
                });
            }
            else if(answers.action === 'Add Role'){
                addRole();
                return;
            }
            else if(answers.action === 'View All Departments'){
                pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    } else if(result) {
                        console.log();
                        console.table(result.rows);
                    }
                });
            }
            else if(answers.action === 'Add Department'){
                addDepartment();
                return;
            }
            else if(answers.action === 'View Employees by Department'){
                viewEmployeeByDepartment();
                return;
            }
            else if(answers.action === 'View Employees by Manager'){
                viewEmployeeByManager();
                return;
            }
            else if(answers.action === 'View Budget for Department'){
                totalBudgetByDepartment();
                return;
            }
            else if(answers.action === 'Delete Employee'){
                deleteEmployee();
                return;
            }
            else if(answers.action === 'Delete Role'){
                deleteRole();
                return;
            }
            else if(answers.action === 'Delete Department'){
                deleteDepartment();
                return;
            }
            else if(answers.action === 'Quit'){
                exit = true;
            }
            if(exit){
                process.exit(0);
            }
            setTimeout(() => {
                main();    
            }, 200);
            
        })
}

main();
