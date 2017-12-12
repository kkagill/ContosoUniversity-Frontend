import { DateFormatPipe } from './../../shared/pipes/date-format.pipe';
import { ItemsService } from './../../shared/utils/items.service';
import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { IInstructor, IInstructorDetails, IInstructorEdit } from './../../shared/interfaces';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editInstructor-modal',
  template: `
  <div bsModal #editInstructorModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" *ngIf="selectedInstructorUpdateLoaded">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>EDIT INSTRUCTOR</h4>
          </div>
          <div class="modal-body">
                  <form #editInstructorForm="ngForm" novalidate>
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
                                             [(ngModel)]="instructorEdit.firstMidName" 
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
                                             [(ngModel)]="instructorEdit.lastName" 
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
                                      <datepicker [(ngModel)]="instructorEdit.hireDate" name="hireDate" [showWeeks]="false"></datepicker>
                                  </div>
                                  <div class="col-md-6">
                                      <label class="control-label">Office</label>
                                      <input type="text" 
                                             class="form-control" 
                                             id="office" 
                                             [(ngModel)]="instructorEdit.office" 
                                             name="office" />
                                  </div>
                              </div>
                          </div>  
                          <div class="row">
                              <div class="col-md-12">  
                                  <label class="control-label">Courses</label>  
                                  <br />                                         
                                  <div *ngFor="let course of instructorEdit.assignedCourses" class="col-md-4">
                                      <input type="checkbox"
                                              [id]="course.courseID"
                                              [checked]="course.assigned"
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
                              [disabled]="!editInstructorForm.form.valid"
                              (click)="updateInstructor(editInstructorForm)">Update</button>
              </form>  
          </div>
      </div>
  </div>
</div>
  `,
})

export class EditInstructorModalComponent {    
  @ViewChild('editInstructorModal') public editInstructorModal: ModalDirective;
  @Output() instructorUpdated = new EventEmitter();
  instructorEdit: IInstructorEdit;    
  instructor: IInstructor;
  selectedInstructorUpdateLoaded: boolean = false;
  selectedCourses: string[] = []; // Initialize

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private itemsService: ItemsService) { }  

    loadInstructorForUpdate(id: number) {
        this.dataService.getInstructor(id)
          .subscribe((instructor: IInstructorEdit) => {
              this.instructorEdit = this.itemsService.getSerialized<IInstructorEdit>(instructor);
              this.instructorEdit.hireDate = new Date(this.instructorEdit.hireDate.toString());
              this.selectedInstructorUpdateLoaded = true;
              this.editInstructorModal.show();
          },
          error => {
              this.notificationService.printErrorMessage('Failed to load instructor. ' + error);
          });
    }
  
    updateInstructor(editInstructorForm: NgForm) {
        // Find checkbox(es) that are checked and add to an array
       this.instructorEdit.assignedCourses.forEach(item => {
         if (item.assigned)
             this.selectedCourses.push(item.courseID.toString());
         });
       this.instructor = this.itemsService.getSerialized<IInstructor>(this.instructorEdit);
       this.instructor.selectedCourses = this.selectedCourses;
       
       this.dataService.updateInstructor(this.instructor)
           .subscribe(() => {
               this.notificationService.printSuccessMessage('Instructor has been updated');
               this.closeModal();
               this.instructorUpdated.emit({});
           },
           error => {
               this.notificationService.printErrorMessage('Failed to update instructor. ' + error);
           });
   
          this.selectedCourses = []; // Reset, so it will not add up the previously selected courses
       }
   

  openModal(id: number){
    this.loadInstructorForUpdate(id);  
    this.editInstructorModal.show();
  }

  closeModal() {
    this.editInstructorModal.hide();
  }
}