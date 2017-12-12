export interface IApplicationUser {
    userName: string;
    firstName: string;
    lastName: string;   
    lockoutEnd: Date;
}

export interface IStudent {
    id: number;
    lastName: string;
    firstMidName: string;
    enrollmentDate: Date;
}

export interface IStudentDetails {
    id: number;
    lastName: string;
    firstMidName: string;
    enrollmentDate: Date;
    enrollments: IEnrollment[];
}

export interface IEnrollment {
    title: string;
    grade: string;
    fullName: string;
}

export interface ICourse {
    courseID: number;
    title: string;
    credits: number;
    departmentID: number;
    department: string;
    assigned: boolean;
}

export interface IDepartment {
    departmentID: number;
    name: string;
}

export interface IInstructor {
    id: number;
    lastName: string;
    firstMidName: string;
    hireDate: Date;
    office: string;
    selectedCourses: string[];
    courses: ICourse[];
}

export interface IInstructorDetails {
    id: number;
    courses: ICourse[];
    enrollments: IEnrollment[];
}

export interface IInstructorEdit {
    id: number;
    lastName: string;
    firstMidName: string;
    hireDate: Date;
    office: string;  
    assignedCourses: ICourse[];
}

export interface Pagination {
    CurrentPage : number;
    ItemsPerPage : number;
    TotalItems : number;
    TotalPages: number;
}

export class PaginatedResult<T> {
    result :  T;
    pagination : Pagination;
}

export interface Predicate<T> {
    (item: T): boolean
}