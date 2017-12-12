import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { IInstructor } from './../../shared/interfaces';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'createInstructor-modal',
  template: `
  <div bsModal #createInstructorModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>NEW INSTRUCTOR</h4>
          </div>
          <div class="modal-body">
              <form #createInstructorForm="ngForm" novalidate>
                  <div class="form-group">
                      <div class="row">
                          <div class="col-md-12">
                              <div class="col-md-6">
                                  <label class="control-label">First Name</label>
                                  <input type="text" 
                                         class="form-control" 
                                         id="firstMidName" 
                                         required 
                                         maxlength="50" 
                                         [(ngModel)]="instructor.firstMidName" 
                                         name="firstMidName" 
                                         #firstMidName="ngModel">
                                  <div *ngIf="firstMidName.errors && (firstMidName.dirty || firstMidName.touched)" class="alert alert-danger">
                                      <div [hidden]="!firstMidName.errors.required">
                                          First Name is required!
                                      </div>                                  
                                      <div [hidden]="!firstMidName.errors.maxlength">
                                          First Name cannot be more than 50 characters long.
                                      </div>
                                  </div>
                              </div>
                              <div class="col-md-6">
                                  <label class="control-label">Last Name</label>
                                  <input type="text" 
                                         class="form-control" 
                                         id="lastName" 
                                         required 
                                         maxlength="50" 
                                         [(ngModel)]="instructor.lastName" 
                                         name="lastName" 
                                         #lastName="ngModel">
                                  <div *ngIf="lastName.errors && (lastName.dirty || lastName.touched)" class="alert alert-danger">
                                      <div [hidden]="!lastName.errors.required">
                                          Last Name is required!
                                      </div>                                     
                                      <div [hidden]="!lastName.errors.maxlength">
                                          Last Name cannot be more than 50 characters long.
                                      </div>
                                  </div>
                              </div>
                          </div>                   
                      </div>
                      <br />
                      <div class="row">
                          <div class="col-md-12">
                              <div class="col-md-6">
                                  <label class="control-label">Hire Date</label>
                                  <datepicker [(ngModel)]="instructor.hireDate" name="timeStartDate" [showWeeks]="false"></datepicker>
                              </div>
                              <div class="col-md-6">
                                  <label class="control-label">Office Location</label>
                                  <input type="text" 
                                  class="form-control" 
                                  id="office" 
                                  [(ngModel)]="instructor.office" 
                                  name="office" 
                                  #office="ngModel">
                              </div>
                          </div>
                      </div>  
                      <div class="row">
                          <div class="col-md-12">  
                              <label class="control-label">Courses</label>  
                              <br />                                         
                              <div *ngFor="let course of instructor.courses" class="col-md-4">
                                  <input type="checkbox"
                                         [id]="course.courseID"                                          
                                         (change)="course.assigned = !course.assigned" />
                                  <label [for]="course.courseID">
                                      {{course.courseID}}: {{course.title}}   
                                  </label>   
                              </div>  
                          </div>
                      </div>                 
                  </div>                    
                  <button type="submit" 
                          class="btn btn-default" 
                          [disabled]="!createInstructorForm.form.valid"
                          (click)="addInstructor(createInstructorForm)">Submit
                  </button>
              </form>  
          </div>
      </div>
  </div>
</div>
  `,
})

export class CreateInstructorModalComponent {
  @ViewChild('createInstructorModal') public createInstructorModal: ModalDirective;
  @Input() instructor: IInstructor;
  @Output() instructorCreated = new EventEmitter();
  selectedCourses: string[] = []; // Initialize

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService) { }  
      
    addInstructor(form: NgForm) {
        // Find checkbox(es) that are checked and add to an array
        this.instructor.courses.forEach(item => {
        if (item.assigned)
            this.selectedCourses.push(item.courseID.toString());
        });
        this.instructor.selectedCourses = this.selectedCourses;
        
        this.dataService.createInstructor(this.instructor)
            .subscribe((instructorCreated) => {
                this.notificationService.printSuccessMessage(instructorCreated.firstMidName + ' ' + instructorCreated.lastName + ' has been created');
                this.instructorCreated.emit({});
                this.closeModal();                
            },
            error => {
                this.notificationService.printErrorMessage('Failed to create a new instructor. ' + error);
            })
    
        this.selectedCourses = []; // Reset, so it will not add up the previously selected courses
        form.reset();
      }
      
  openModal(){
    this.createInstructorModal.show();
  }

  closeModal() {
    this.createInstructorModal.hide();
  }
}