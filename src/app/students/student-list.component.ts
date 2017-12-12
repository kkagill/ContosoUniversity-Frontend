import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { IStudent, IStudentDetails, Pagination, PaginatedResult } from './../shared/interfaces';
import { ConfigService } from './../shared/utils/config.service';
import { NotificationService } from './../shared/utils/notification.service';
import { ItemsService } from './../shared/utils/items.service';
import { DataService } from './../shared/services/data.service';
import { DateFormatPipe } from '../shared/pipes/date-format.pipe';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-students',
  templateUrl: './student-list.component.html'
})
export class StudentListComponent implements OnInit {
  public itemsPerPage: number = 8;
  public totalItems: number = 0;
  public currentPage: number = 1;
  students: IStudent[];
  apiHost: string; 
  student: IStudent;

  constructor(
    private dataService: DataService,
    private itemsService: ItemsService,
    private notificationService: NotificationService,
    private configService: ConfigService) { }

  ngOnInit() {
    this.apiHost = this.configService.getApiHost();
    this.loadStudents();
    this.initializeCreateStudent();    
  }

  loadStudents() {
    this.dataService.getStudents(this.currentPage, this.itemsPerPage)
        .subscribe((res: PaginatedResult<IStudent[]>) => {
            this.students = res.result;
            this.totalItems = res.pagination.TotalItems;         
        },
        error => {           
            this.notificationService.printErrorMessage('Failed to load schedules. ' + error);
        });
  }

  initializeCreateStudent() {
    const obj = { lastName: '', firstMidName: '' };
    this.student = this.itemsService.getSerialized<IStudent>(obj);
  }

  removeStudent(student: IStudent) {
    this.notificationService.openConfirmationDialog('Are you sure you want to delete this student?',
        () => {           
            this.dataService.deleteStudent(student.id)
                .subscribe(() => {
                    this.itemsService.removeItemFromArray<IStudent>(this.students, student);
                    this.notificationService.printSuccessMessage(student.firstMidName + ' ' + student.lastName + ' has been deleted.');                  
                },
                error => {                  
                    this.notificationService.printErrorMessage('Failed to delete ' + student.firstMidName + student.lastName + ' '  + error);
                });
        });
  }

  pageChanged(event: any): void {
    this.currentPage = event.page;
    this.loadStudents();
  };
}