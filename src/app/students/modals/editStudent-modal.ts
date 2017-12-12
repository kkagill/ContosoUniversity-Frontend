import { DateFormatPipe } from './../../shared/pipes/date-format.pipe';
import { ItemsService } from './../../shared/utils/items.service';
import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { IStudent, IStudentDetails } from './../../shared/interfaces';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editStudent-modal',
  template: `
  <div bsModal #editStudentModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" *ngIf="selectedStudentLoaded">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>EDIT STUDENT</h4>
          </div>
          <div class="modal-body">
                  <form #editStudentForm="ngForm" novalidate>
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
                                             [(ngModel)]="studentDetails.firstMidName" 
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
                                             [(ngModel)]="studentDetails.lastName" 
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
                                      <datepicker [(ngModel)]="studentDetails.enrollmentDate" name="enrollmentDate" [showWeeks]="false"></datepicker>
                                  </div>
                              </div>
                          </div>  
                      </div>                    
                      <button type="submit" 
                              class="btn btn-default" 
                              [disabled]="!editStudentForm.form.valid"
                              (click)="updateStudent(editStudentForm)">Update</button>
                  </form>  
              </div>
      </div>
  </div>
</div>
  `,
})

export class EditStudentModalComponent {    
  @ViewChild('editStudentModal') public editStudentModal: ModalDirective;
  @Output() studentUpdated = new EventEmitter();
  studentDetails: IStudentDetails;    
  selectedStudentLoaded: boolean = false;
  student: IStudent;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private itemsService: ItemsService) { }  

    loadStudentForUpdate(id: number) {
        this.dataService.getStudentDetails(id)
          .subscribe((student: IStudentDetails) => {
              this.studentDetails = this.itemsService.getSerialized<IStudentDetails>(student);
              this.studentDetails.enrollmentDate = new Date(this.studentDetails.enrollmentDate.toString());
              this.selectedStudentLoaded = true;
          },
          error => {
              this.notificationService.printErrorMessage('Failed to load student. ' + error);
          });
    }
  
    updateStudent(editScheduleForm: NgForm) {
        this.student = this.itemsService.getSerialized<IStudent>(this.studentDetails);
        this.dataService.updateStudent(this.student)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Student has been updated');
                this.closeModal();
                this.studentUpdated.emit({});
            },
            error => {
                this.notificationService.printErrorMessage('Failed to update student. ' + error);
            });
        }

  openModal(id: number){
    this.loadStudentForUpdate(id);  
    this.editStudentModal.show();
  }

  closeModal() {
    this.editStudentModal.hide();
  }
}