import inquirer from 'inquirer';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js'; 

let exit: boolean = false;

await connectToDb();

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
                    'View All Roles',
                    'Add Role',
                    'View All Departments',
                    'Add Department',
                    'Quit'
                ]
            }
        ])
        .then((answers) => {
            if(answers.action === 'View All Employees'){

            }
            else if(answers.action === 'Add Employee') {

            }
            else if(answers.action === 'Update Employee Role'){

            }
            else if(answers.action === 'View All Roles'){
                pool.query('SELECT role.id, role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id', (err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    } else if(result) {
                        console.log();
                        console.table(result.rows);
                        for (let i = 0; i < result.rows.length; i++){
                            console.log();
                        }
                    }
                });
            }
            else if(answers.action === 'Add Roles'){
                
            }
            else if(answers.action === 'View All Departments'){
                pool.query('SELECT * FROM department', (err: Error, result: QueryResult) => {
                    if(err){
                        console.log(err);
                    } else if(result) {
                        console.log();
                        console.table(result.rows);
                        for (let i = 0; i < result.rows.length; i++){
                            console.log();
                        }
                    }
                });
            }
            else if(answers.action === 'Add Roles'){
                
            }
            else if(answers.action === 'Quit'){
                exit = true;
            }
            if(exit === false){
                main();
            }
            else{
                process.exit(0);
            }
        })
}

main();
