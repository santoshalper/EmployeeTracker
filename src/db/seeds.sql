INSERT INTO department (name)
VALUES  ('Sales'),
        ('Legal'),
        ('Finance'),
        ('Engineering');

INSERT INTO role (title, salary, department_id)
VALUES  ('Sales Lead', 100000, 1),
        ('Salesperson', 80000, 1),
        ('Lead Engineer', 150000, 4),
        ('Software Engineer', 120000, 4),
        ('Account Manager', 160000, 3),
        ('Accountant', 125000, 3),
        ('Legal Team Lead', 250000, 2),
        ('Lawyer', 190000, 2);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Man', 'Ager', 1, null),
        ('John', 'Doe', 2, 1),
        ('Man', 'Ager2', 3, null),
        ('John', 'Doe2', 4, 3),
        ('Man', 'Ager3', 5, null),
        ('John', 'Doe3', 6, 5),
        ('Man', 'Ager4', 7, null),
        ('John', 'Doe4', 8, 7);