import { AuthService } from './auth.service';
import { IStudentDetails, ICourse, IDepartment, IInstructor, IInstructorDetails, IInstructorEdit, IApplicationUser } from './../interfaces';
import { Injectable } from '@angular/core';
import { Http, Response, Headers } from '@angular/http';
//Grab everything with import 'rxjs/Rx';
import { Observable } from 'rxjs/Observable';
import { Observer } from 'rxjs/Observer';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import { IStudent, Pagination, PaginatedResult } from '../interfaces';
import { ItemsService } from '../utils/items.service';
import { ConfigService } from '../utils/config.service';

@Injectable()
export class DataService {

    _baseUrl: string = '';

    constructor(private http: Http,
                private itemsService: ItemsService,
                private configService: ConfigService,
                private authService: AuthService) 
    {
        this._baseUrl = configService.getApiURI();
    }

    // Admin
    getApplicationUsers(): Observable<IApplicationUser[]> {
        return this.http.get(this._baseUrl + 'admin/', { headers: this.authService.authJsonHeaders() })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }   

    enableLockOut(userName: string): Observable<string> {
        return this.http.post(this._baseUrl + 'admin/EnableLockOut', JSON.stringify(userName), 
        { 
            headers: this.authService.authJsonHeaders() 
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    disableLockOut(userName: string): Observable<string> {
        return this.http.post(this._baseUrl + 'admin/DisableLockOut', JSON.stringify(userName), 
        { 
            headers: this.authService.authJsonHeaders() 
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    // User
    getUserProfile(userName: string): Observable<IApplicationUser> {
        return this.http.get(this._baseUrl + 'user/' + userName, { headers: this.authService.authJsonHeaders() })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }  

    updateUserProfile(userId: string, userProfile: IApplicationUser): Observable<void> {
        return this.http.put(this._baseUrl + 'user/' + userId, JSON.stringify(userProfile), {
            headers: this.authService.authJsonHeaders()
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    // Students
    getStudents(page?: number, itemsPerPage?: number): Observable<PaginatedResult<IStudent[]>> {
        var peginatedResult: PaginatedResult<IStudent[]> = new PaginatedResult<IStudent[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'students', {
            headers: headers
        })
            .map((res: Response) => {
                console.log(res.headers.keys());
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));
                    console.log(paginationHeader);
                        peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    getStudentDetails(id: number): Observable<IStudentDetails> {
        return this.http.get(this._baseUrl + 'students/' + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }   

    createStudent(student: IStudent): Observable<IStudent> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'students/', JSON.stringify(student), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getSchedule(id: number): Observable<IStudent> {
        return this.http.get(this._baseUrl + 'schedules/' + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    } 

    updateStudent(student: IStudent): Observable<void> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'students/' + student.id, JSON.stringify(student), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteStudent(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'students/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    // Courses
    getCourses(page?: number, itemsPerPage?: number): Observable<PaginatedResult<ICourse[]>> {
        var peginatedResult: PaginatedResult<ICourse[]> = new PaginatedResult<ICourse[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'courses', {
            headers: headers
        })
            .map((res: Response) => {
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));                  
                    peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    getAllCourses(): Observable<ICourse[]> {
        return this.http.get(this._baseUrl + 'courses/all')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    } 

    getCourse(id: number): Observable<ICourse> {
        return this.http.get(this._baseUrl + 'courses/' + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }   

    createCourse(course: ICourse): Observable<ICourse> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'courses/', JSON.stringify(course), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    updateCourse(course: ICourse): Observable<void> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'courses/' + course.courseID, JSON.stringify(course), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteCourse(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'courses/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    getDepartments(): Observable<IDepartment[]> {
        return this.http.get(this._baseUrl + 'courses/departments')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }   

    //Instructors
    getInstructors(page?: number, itemsPerPage?: number): Observable<PaginatedResult<IInstructor[]>> {
        var peginatedResult: PaginatedResult<IInstructor[]> = new PaginatedResult<IInstructor[]>();

        let headers = new Headers();
        if (page != null && itemsPerPage != null) {
            headers.append('Pagination', page + ',' + itemsPerPage);
        }

        return this.http.get(this._baseUrl + 'instructors', {
            headers: headers
        })
            .map((res: Response) => {
                peginatedResult.result = res.json();

                if (res.headers.get("Pagination") != null) {
                    //var pagination = JSON.parse(res.headers.get("Pagination"));
                    var paginationHeader: Pagination = this.itemsService.getSerialized<Pagination>(JSON.parse(res.headers.get("Pagination")));                   
                        peginatedResult.pagination = paginationHeader;
                }
                return peginatedResult;
            })
            .catch(this.handleError);
    }

    createInstructor(instructor: IInstructor): Observable<IInstructor> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post(this._baseUrl + 'instructors/', JSON.stringify(instructor), {
            headers: headers
        })
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }

    getInstructorCourseDetails(id: number): Observable<IInstructorDetails> {
        return this.http.get(this._baseUrl + 'instructors/' + id + '/courses')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }   

    getInstructorCourseStudentDetails(id: number): Observable<IInstructorDetails> {       
        return this.http.get(this._baseUrl + 'instructors/' + id + '/students')
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    }  

    getInstructor(id: number): Observable<IInstructorEdit> {
        return this.http.get(this._baseUrl + 'instructors/' + id)
            .map((res: Response) => {
                return res.json();
            })
            .catch(this.handleError);
    } 

    updateInstructor(instructor: IInstructor): Observable<void> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.put(this._baseUrl + 'instructors/' + instructor.id, JSON.stringify(instructor), {
            headers: headers
        })
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    deleteInstructor(id: number): Observable<void> {
        return this.http.delete(this._baseUrl + 'instructors/' + id)
            .map((res: Response) => {
                return;
            })
            .catch(this.handleError);
    }

    private handleError(error: any) {
        var applicationError = error.headers.get('Application-Error');
        var serverError = error.json();
        var modelStateErrors: string = '';

        if (!serverError.type) {
            console.log(serverError);
            for (var key in serverError) {
                if (serverError[key])
                    modelStateErrors += serverError[key] + '\n';
            }
        }

        modelStateErrors = modelStateErrors = '' ? null : modelStateErrors;

        return Observable.throw(applicationError || modelStateErrors || 'Server error');
    }
}