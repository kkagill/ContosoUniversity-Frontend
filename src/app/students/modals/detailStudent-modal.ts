import { DateFormatPipe } from './../../shared/pipes/date-format.pipe';
import { ItemsService } from './../../shared/utils/items.service';
import { NotificationService } from './../../shared/utils/notification.service';
import { DataService } from './../../shared/services/data.service';
import { IStudent, IStudentDetails } from './../../shared/interfaces';
import { Component, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'detailStudent-modal',
  template: `
  <div bsModal #detailStudentModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="mySmallModalLabel" aria-hidden="true">
  <div class="modal-dialog modal-lg" *ngIf="selectedStudentLoaded">
      <div class="modal-content">
          <div class="modal-header">
              <button type="button" class="close" aria-label="Close" (click)="closeModal()">
                   <span aria-hidden="true">&times;</span>
              </button>
              <h4>STUDENT DETAILS</h4>
          </div>
          <div class="modal-body">
              <form ngNoForm method="post">
                  <div class="form-group">
                      <div class="row">
                          <div class="col-md-12">
                               <div class="col-md-6">
                                   <label class="control-label">First Name</label>
                                   <input type="text" class="form-control" [(ngModel)]="studentDetails.firstMidName" disabled />
                               </div>        
                               <div class="col-md-6">                                    
                                   <label class="control-label">Last Name</label>
                                   <input type="text" class="form-control" [(ngModel)]="studentDetails.lastName" disabled />
                               </div>
                          </div>
                      </div>
                      <br />
                      <div class="row">
                          <div class="col-md-12">
                               <div class="col-md-6">
                                   <label class="control-label">Enrollment Date</label>
                                   <input type="text" class="form-control" [(ngModel)]="studentDetails.enrollmentDate" disabled />
                               </div>
                          </div>
                      </div>                       
                  </div>          
                  <hr/>
                  <div class="panel panel-info">
                      <div class="panel-heading">Enrollments</div>
                      <table class="table table-hover">
                          <thead>
                              <tr>                                 
                                  <th>Course Title</th>
                                  <th>Grade</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr *ngFor="let enrollment of studentDetails.enrollments">                                  
                                  <td>{{enrollment.title}}</td>
                                  <td>{{enrollment.grade}}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
              </form>
          </div>
      </div>
  </div>
</div>
  `,
})

export class DetailStudentModalComponent {    
  @ViewChild('detailStudentModal') public detailStudentModal: ModalDirective;
  studentDetails: IStudentDetails;    
  selectedStudentLoaded: boolean = false;

  constructor(
    private dataService: DataService,
    private notificationService: NotificationService,
    private itemsService: ItemsService) { }  

   viewStudentDetails(id: number) {
    this.dataService.getStudentDetails(id)
        .subscribe((student: IStudentDetails) => {
            this.studentDetails = this.itemsService.getSerialized<IStudentDetails>(student);
            // Convert date times to readable format           
            this.studentDetails.enrollmentDate = new DateFormatPipe().transform(student.enrollmentDate, ['local']);
            this.selectedStudentLoaded = true;
            this.detailStudentModal.show();//.open('lg');
        },
        error => {
            this.notificationService.printErrorMessage('Failed to load student. ' + error);
        });
  }
  
  openModal(id: number){
    this.viewStudentDetails(id);  
    this.detailStudentModal.show();
  }

  closeModal() {
    this.detailStudentModal.hide();
  }
}