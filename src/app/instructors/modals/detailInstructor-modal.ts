import { DateFormatPipe } from './../../shared/pipes/date-format.pipe';
import { ItemsService } from './../../shared/utils/items.service';
import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { IInstructorDetails } from './../../shared/interfaces';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'detailInstructor-modal',
  template: `
  <div bsModal #detailInstructorModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" *ngIf="selectedInstructorLoaded">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                   <span aria-hidden="true">&times;</span>
              </button>
              <h4>COURSE(S) TAUGHT BY SELECTED INSTRUCTOR</h4>
          </div>
          <div class="modal-body">
               <div class="form-group">
                   <div class="row">
                       <table class="table table-hover">
                           <thead>
                               <tr>
                                   <th>Number</th>
                                   <th>Title</th>
                                   <th>Department</th>
                                   <th></th>
                               </tr>
                           </thead>
                           <tbody>
                               <tr *ngFor="let course of instructorCourseDetails.courses">
                                   <td>{{course.courseID}}</td>
                                   <td>{{course.title}}</td>
                                   <td>{{course.department}}</td>                                          
                                   <td>
                                       <button class="btn btn-primary" (click)="viewInstructorCourseStudentDetails(course.courseID)"> 
                                       <i class="fa fa-info-circle" aria-hidden="true"></i> Select</button>
                                   </td> 
                               </tr>                                  
                           </tbody>
                       </table>      
                   </div>                
               </div> 
               <div *ngIf="selectedStudentDetailsLoaded">
                   <h4>STUDENT(S) ENROLLED IN SELECTED COURSE</h4>
                   <table class="table table-hover">                    
                       <thead>
                           <tr>
                               <th>Name</th>
                               <th>Grade</th>   
                           </tr>
                       </thead>
                       <tbody>
                           <tr *ngFor="let student of instructorCourseStudentDetails.enrollments">
                               <td>{{student.fullName}}</td>
                               <td>{{student.grade}}</td>  
                           </tr>                                                    
                       </tbody>
                   </table>  
               </div>                          
          </div>
      </div>
  </div>
</div>
  `,
})

export class DetailInstructorModalComponent {    
  @ViewChild('detailInstructorModal') public detailInstructorModal: ModalDirective;
  instructorCourseDetails: IInstructorDetails;   
  instructorCourseStudentDetails: IInstructorDetails;   
  selectedInstructorLoaded: boolean = false;  
  selectedStudentDetailsLoaded: boolean = false;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private itemsService: ItemsService) { }  

    viewInstructorCourseDetails(id: number) {
        this.selectedStudentDetailsLoaded = false;
    
        this.dataService.getInstructorCourseDetails(id)
            .subscribe((instructor: IInstructorDetails) => {          
                this.instructorCourseDetails = this.itemsService.getSerialized<IInstructorDetails>(instructor);
                this.selectedInstructorLoaded = true;
                this.detailInstructorModal.show();
            },
            error => {
                this.notificationService.printErrorMessage('Failed to load course details. ' + error);
            });
      }

      viewInstructorCourseStudentDetails(id: number) {    
        this.dataService.getInstructorCourseStudentDetails(id)
            .subscribe((instructor: IInstructorDetails) => {          
                this.instructorCourseStudentDetails = this.itemsService.getSerialized<IInstructorDetails>(instructor);
                console.log(this.instructorCourseStudentDetails)
                this.selectedStudentDetailsLoaded = true;
            },
            error => {
                this.notificationService.printErrorMessage('Failed to load student details. ' + error);
            });
      }
  
  openModal(id: number){
    this.viewInstructorCourseDetails(id);  
    this.detailInstructorModal.show();
  }

  closeModal() {
    this.detailInstructorModal.hide();
  }
}