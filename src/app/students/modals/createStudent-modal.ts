import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { IStudent } from './../../shared/interfaces';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'createStudent-modal',
  template: `
  <div bsModal #createStudentModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>NEW STUDENT</h4>
          </div>
          <div class="modal-body">
              <form #createStudentForm="ngForm" novalidate>
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
                                         [(ngModel)]="student.firstMidName" 
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
                                         [(ngModel)]="student.lastName" 
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
                                  <label class="control-label">Enrollment Date</label>
                                  <datepicker [(ngModel)]="student.enrollmentDate" name="timeStartDate" [showWeeks]="false"></datepicker>
                              </div>
                          </div>
                      </div>  
                  </div>                    
                  <button type="submit" 
                          class="btn btn-default" 
                          [disabled]="!createStudentForm.form.valid"
                          (click)="addStudent(createStudentForm)">Submit</button>
              </form>  
          </div>
      </div>
  </div>
</div>
  `,
})

export class CreateStudentModalComponent {
  @ViewChild('createStudentModal') public createStudentModal: ModalDirective;
  @Input() student: IStudent;
  @Output() studentCreated = new EventEmitter();

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService) { }  
      
  addStudent(form: NgForm) {   
    this.dataService.createStudent(this.student)
      .subscribe((studentCreated) => {
        this.notificationService.printSuccessMessage(studentCreated.firstMidName + ' ' + studentCreated.lastName + ' has been created');
        this.studentCreated.emit({});
        this.closeModal();
    },
    error => {
      this.notificationService.printErrorMessage('Failed to create a new student. ' + error);
    })

    form.reset();
  }
  
  openModal(){
    this.createStudentModal.show();
  }

  closeModal() {
    this.createStudentModal.hide();
  }
}