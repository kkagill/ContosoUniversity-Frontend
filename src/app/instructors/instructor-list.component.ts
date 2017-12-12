import { Component, OnInit, ViewChild } from '@angular/core';
import { Pagination, PaginatedResult, IInstructor, ICourse, IInstructorDetails, IInstructorEdit } from './../shared/interfaces';
import { ConfigService } from './../shared/utils/config.service';
import { NotificationService } from './../shared/utils/notification.service';
import { ItemsService } from './../shared/utils/items.service';
import { DataService } from './../shared/services/data.service';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './instructor-list.component.html'
})
export class InstructorListComponent implements OnInit {
  public itemsPerPage: number = 8;
  public totalItems: number = 0;
  public currentPage: number = 1;
  instructors: IInstructor[];
  apiHost: string; 
  instructor: IInstructor;

  constructor(
    private dataService: DataService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadInstructors();
    this.initializeCreateInstructor();
  }

  loadInstructors() {
    this.dataService.getInstructors(this.currentPage, this.itemsPerPage)
        .subscribe((res: PaginatedResult<IInstructor[]>) => {
            this.instructors = res.result;
            this.totalItems = res.pagination.TotalItems;         
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load instructors. ' + error);
        });
  }

  initializeCreateInstructor() {    
    const obj = {}; // Initialization
    this.instructor = this.itemsService.getSerialized<IInstructor>(obj);
    this.loadAllCourses(); // Load all courses and add it to this.instructor.courses
  }

  loadAllCourses() {
    this.dataService.getAllCourses()
        .subscribe((courses: ICourse[]) => {
            this.instructor.courses = courses;       
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load all courses. ' + error);
        });
  }
  
  removeInstructor(instructor: IInstructor) {
    this.notificationService.openConfirmationDialog('Are you sure you want to delete this instructor?',
        () => {           
            this.dataService.deleteInstructor(instructor.id)
                .subscribe(() => {
                    this.itemsService.removeItemFromArray<IInstructor>(this.instructors, instructor);
                    this.notificationService.printSuccessMessage(instructor.firstMidName + ' ' + instructor.lastName + ' has been deleted.');                  
                },
                error => {                  
                    this.notificationService.printErrorMessage('Failed to delete ' + instructor.firstMidName + instructor.lastName + ' '  + error);
                });
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.loadInstructors();
  };
}