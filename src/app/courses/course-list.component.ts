import { Component, OnInit, ViewChild, ViewContainerRef, trigger, state, style, transition, animate } from '@angular/core';
import { IStudent, IStudentDetails, Pagination, PaginatedResult, ICourse, IDepartment } from './../shared/interfaces';
import { ConfigService } from './../shared/utils/config.service';
import { NotificationService } from './../shared/utils/notification.service';
import { ItemsService } from './../shared/utils/items.service';
import { DataService } from './../shared/services/data.service';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-course-list',
  templateUrl: './course-list.component.html',
  animations: [    
    trigger('flyInOut', [
      transition(':enter', [
        style({transform: 'translateX(-100%)'}),
        animate(500, style({transform: 'translateX(0)'}))
      ]),
      transition(':leave', [
        style({transform: 'translateX(0)'}),
        animate(500, style({transform: 'translateX(100%)'}))
      ])
    ])
  ]
})

export class CourseListComponent implements OnInit {
  public itemsPerPage: number = 8;
  public totalItems: number = 0;
  public currentPage: number = 1;
  courses: ICourse[];
  departments: IDepartment[];
  apiHost: string; 
  course: ICourse;

  constructor(
    private dataService: DataService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadCourses();
    this.initializeCreateCourse();
  }

  loadCourses() {
    this.dataService.getCourses(this.currentPage, this.itemsPerPage)
        .subscribe((res: PaginatedResult<ICourse[]>) => {
            this.courses = res.result;
            this.totalItems = res.pagination.TotalItems;         
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load courses. ' + error);
        });
  }

  initializeCreateCourse() {    
    const obj = { courseID: '', title: '', credits: '' };
    this.course = this.itemsService.getSerialized<ICourse>(obj);
    this.loadDepartments();  
  }  

  removeCourse(course: ICourse) {
    this.notificationService.openConfirmationDialog('Are you sure you want to delete this course?',
        () => {           
            this.dataService.deleteCourse(course.courseID)
                .subscribe(() => {
                    this.itemsService.removeItemFromArray<ICourse>(this.courses, course);
                    this.notificationService.printSuccessMessage(course.title + ' has been deleted.');                  
                },
                error => {                  
                    this.notificationService.printErrorMessage('Failed to delete ' + course.title + ' '  + error);
                });
        });
  }

  loadDepartments() {
    this.dataService.getDepartments()
      .subscribe((department: IDepartment[]) => {
            this.departments = department;   
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load users. ' + error);
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.loadCourses();
  };
}