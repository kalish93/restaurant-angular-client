// import {
//   Directive,
//   Input,
//   OnInit,
//   TemplateRef,
//   ViewContainerRef,
// } from '@angular/core';
// import { AuthFacade } from 'src/app/auth/facade/auth.facade';
// import { IS_DEVELOPMENT } from 'src/app/core/constants/api-endpoints';

// @Directive({
//   selector: '[appHasPermissions]',
// })
// export class HasPermissionsDirective {
//   constructor(
//     private authFacade: AuthFacade,
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef
//   ) {}

//   @Input() appHasPermissions: string[] = [];
//   private hasPermission: boolean = false;
//   private permissions: string | undefined = undefined;
//   private isDevelopment: boolean = IS_DEVELOPMENT;
//   ngOnInit(): void {
//     this.authFacade.permissions$.subscribe((data) => {
//       this.permissions = data;
//     });
//     this.checkPermissions();
//   }

//   private checkPermissions() {
//     if (this.permissions) {
//       if (this.isDevelopment || this.appHasPermissions.includes(this.permissions)) {
//         this.viewContainer.createEmbeddedView(this.templateRef);
//         this.hasPermission = true;
//       } else {
//         this.viewContainer.clear();
//         this.hasPermission = false;
//       }
//     }
//   }
// }

import {
  Directive,
  Input,
  OnInit,
  TemplateRef,
  ViewContainerRef,
  OnDestroy,
} from '@angular/core';
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import { IS_DEVELOPMENT } from 'src/app/core/constants/api-endpoints';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appHasPermissions]',
})
export class HasPermissionsDirective implements OnInit, OnDestroy {
  @Input() appHasPermissions: string[] = [];

  private hasPermission: boolean = false;
  private permissions: any[] = [];
  private isDevelopment: boolean = IS_DEVELOPMENT;
  private subscription: Subscription | undefined;

  constructor(
    private authFacade: AuthFacade,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  ngOnInit(): void {
    this.subscription = this.authFacade.permissions$.subscribe((data) => {
      this.permissions = data;
      this.checkPermissions();
    });
  }

  private checkPermissions() {
    if (this.isDevelopment || this.appHasPermissions.some(permission => this.permissions.includes(permission))) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasPermission = true;
    } else {
      this.viewContainer.clear();
      this.hasPermission = false;
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
