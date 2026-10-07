# School Database Design

## Students table

The `students` table stores information about each student. It has a `student_id` as the primary key, a student's name, and a unique email address. The email is required and cannot be duplicated.

## Courses table

The `courses` table stores the courses offered by the school. It has a `course_id` as the primary key and a required `course_name`.

## Enrolments table

The `enrolments` table records which students are enrolled in which courses. It also stores the student's grade. The `enrolment_id` is the primary key, while `student_id` and `course_id` are foreign keys linking to the students and courses tables. A UNIQUE constraint on `student_id` and `course_id` prevents the same student from enrolling in the same course twice.

## Relationships

A student can have many enrolments, so the relationship between students and enrolments is one-to-many. A course can also have many enrolments, so the relationship between courses and enrolments is one-to-many.

Students and courses have a many-to-many relationship because one student can take many courses and one course can have many students. The `enrolments` table is needed as a join table to connect students and courses. It also stores additional information about the relationship, such as the student's grade.

## Index

I would add an index on `enrolments.course_id` because courses are frequently used to find all students enrolled in a particular course. An index would make these searches faster as the database grows.

## SQL or NoSQL

I would choose SQL for this school system because the data has clear relationships between students, courses and enrolments. SQL databases provide primary keys, foreign keys, unique constraints and JOIN queries, which are useful for maintaining data integrity and retrieving related information. The structured nature of the system makes a relational SQL database a better choice than NoSQL.