import * as Raven from 'raven-js';
import { ToastyService } from 'ng2-toasty';
import { ErrorHandler, Inject, NgZone, isDevMode } from "@angular/core";

@Inject(ToastyService) 
export class AppErrorHandler implements ErrorHandler {
    constructor(private ngZone: NgZone, 
                private toastyService: ToastyService) {}

    handleError(error: any): void {
        // Need new patch https://github.com/getsentry/raven-js/issues/1016#issuecomment-328494778
        if (!isDevMode())        
            Raven.captureException(error.originalError || error);
        else
            throw error;

        this.ngZone.run(() => {
            this.toastyService.error({
                title: 'Error',
                msg: 'An unexpected error happened.',
                theme: 'bootstrap',
                showClose: true
            });
        });
    }
}