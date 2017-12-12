import { DateFormatPipe } from './../../shared/pipes/date-format.pipe';
import { ItemsService } from './../../shared/utils/items.service';
import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { ICourse, IDepartment } from './../../shared/interfaces';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'editCourse-modal',
  template: `
  <div bsModal #editCourseModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" *ngIf="selectedCourseLoaded">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                  <span aria-hidden="true">&times;</span>
              </button>
              <h4>EDIT COURSE</h4>
          </div>
          <div class="modal-body">
                  <form #editCourseForm="ngForm" novalidate>
                      <div class="form-group">
                          <div class="row">
                              <div class="col-md-12">
                                  <div class="col-md-6">
                                      <label class="control-label">Title</label>
                                      <input type="text" 
                                             class="form-control" 
                                             id="title" 
                                             required 
                                             maxlength="50" 
                                             [(ngModel)]="course.title" 
                                             name="title" 
                                             #title="ngModel">
                                      <div *ngIf="title.errors && (title.dirty || title.touched)" class="alert alert-danger">
                                          <div [hidden]="!title.errors.required">
                                              Title is required!
                                          </div>                                  
                                          <div [hidden]="!title.errors.maxlength">
                                              Title cannot be more than 50 characters long.
                                          </div>
                                      </div>
                                  </div>
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
                              </div>                   
                          </div>
                          <br />
                          <div class="row">
                              <div class="col-md-12">
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
                              [disabled]="!editCourseForm.form.valid"
                              (click)="updateCourse(editCourseForm)">Update</button>
                  </form>  
              </div>
      </div>
  </div>
</div>
  `,
})

export class EditCourseModalComponent {    
  @ViewChild('editCourseModal') public editCourseModal: ModalDirective;
  @Input() departments: IDepartment[];
  @Output() courseUpdated = new EventEmitter();
  @Output() loadCourse = new EventEmitter();
  selectedCourseLoaded: boolean = false;
  course: ICourse;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private itemsService: ItemsService) { }  

    loadCourseForUpdate(id: number) {
        this.dataService.getCourse(id)
          .subscribe((course: ICourse) => {
              this.course = this.itemsService.getSerialized<ICourse>(course);
              this.selectedCourseLoaded = true;
              this.loadCourse.emit({});
          },
          error => {
              this.notificationService.printErrorMessage('Failed to load course. ' + error);
          });
    }
  
    updateCourse(editCourseForm: NgForm) {
        this.course = this.itemsService.getSerialized<ICourse>(this.course);
        this.dataService.updateCourse(this.course)
            .subscribe(() => {
                this.notificationService.printSuccessMessage('Course has been updated');
                this.courseUpdated.emit({});
                this.closeModal();
            },
            error => {
                this.notificationService.printErrorMessage('Failed to update course. ' + error);
            });
        }

  openModal(id: number){
    this.loadCourseForUpdate(id);  
    this.editCourseModal.show();
  }

  closeModal() {
    this.editCourseModal.hide();
  }
}