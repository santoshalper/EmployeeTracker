import inquirer from 'inquirer';
import { pool, connectToDb } from './connection.js';
let exit = false;
await connectToDb();
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
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
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
        }
        else if (answers.action === 'Update Employee Role') {
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
        else if (answers.action === 'Add Roles') {
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
        }
        else if (answers.action === 'Quit') {
            exit = true;
        }
        if (exit === false) {
            main();
        }
        else {
            process.exit(0);
        }
    });
}
main();
