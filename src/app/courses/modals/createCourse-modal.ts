import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { ICourse, IDepartment } from './../../shared/interfaces';
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'createCourse-modal',
  template: `
  <div bsModal #createCourseModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>NEW COURSE</h4>
          </div>
          <div class="modal-body">
              <form #createCourseForm="ngForm" novalidate>
                  <div class="form-group">
                      <div class="row">
                          <div class="col-md-12">
                              <div class="col-md-6">
                                  <label class="control-label">Course ID</label>
                                  <input type="text" 
                                         class="form-control" 
                                         id="courseID" 
                                         required 
                                         maxlength="50" 
                                         [(ngModel)]="course.courseID" 
                                         name="courseID" 
                                         #courseID="ngModel">
                                  <div *ngIf="courseID.errors && (courseID.dirty || courseID.touched)" class="alert alert-danger">
                                      <div [hidden]="!courseID.errors.required">
                                          Course ID is required!
                                      </div>  
                                  </div>
                              </div>
                              <div class="col-md-6">
                                  <label class="control-label">Title</label>
                                  <input type="text" 
                                         class="form-control" 
                                         id="title" 
                                         required 
                                         maxlength="20" 
                                         [(ngModel)]="course.title" 
                                         name="title" 
                                         #title="ngModel">
                                  <div *ngIf="title.errors && (title.dirty || title.touched)" class="alert alert-danger">
                                      <div [hidden]="!title.errors.required">
                                          Title is required!
                                      </div>                                     
                                      <div [hidden]="!title.errors.maxlength">
                                          Title cannot be more than 20 characters long.
                                      </div>
                                  </div>
                              </div>
                          </div>                   
                      </div>
                      <br />
                      <div class="row">
                          <div class="col-md-12">
                              <div class="col-md-6">
                                  <label class="control-label">Credits</label>
                                  <input type="text" 
                                         class="form-control" 
                                         id="credits" 
                                         required 
                                         [(ngModel)]="course.credits" 
                                         name="credits" 
                                         #credits="ngModel">
                                  <div *ngIf="credits.errors && (credits.dirty || credits.touched)" class="alert alert-danger">
                                      <div [hidden]="!credits.errors.required">
                                          Credits is required!
                                      </div>  
                                  </div>
                              </div>
                              <div class="col-md-6">
                                  <label class="control-label">Department</label>
                                  <select class="form-control" [(ngModel)]="course.departmentID" name="status">
                                      <option *ngFor="let department of departments" [value]="department.departmentID">{{department.name}}</option>
                                  </select>
                              </div>
                          </div>
                      </div>  
                  </div>                    
                  <button type="submit" 
                          class="btn btn-default" 
                          [disabled]="!createCourseForm.form.valid"
                          (click)="addCourse(createCourseForm)">Submit</button>
              </form>  
          </div>
      </div>
  </div>
</div>
  `,
})

export class CreateCourseModalComponent {
  @ViewChild('createCourseModal') public createCourseModal: ModalDirective;
  @Input() course: ICourse;
  @Input() departments: IDepartment[];
  @Output() courseCreated = new EventEmitter();
  
  constructor(
    private dataService: DataService,
    private notificationService: NotificationService) { }        

    addCourse(form: NgForm) {   
        this.dataService.createCourse(this.course)
            .subscribe((courseCreated) => {
                this.notificationService.printSuccessMessage(courseCreated.title + ' has been created');
                this.courseCreated.emit({});
                this.closeModal();
            },
            error => {
                this.notificationService.printErrorMessage('Failed to create a new course. ' + error);
            })

        form.reset();
        }

  openModal(){
    this.createCourseModal.show();
  }

  closeModal() {
    this.createCourseModal.hide();
  }
}