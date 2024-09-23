// import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
// import { jwtDecode } from "jwt-decode";
// import { AuthFacade } from 'src/app/auth/facade/auth.facade';
// import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';
// @Directive({
//   selector: '[appHasRole]',
// })
// export class HasRoleDirective implements OnInit{

//   restaurant: any;
//   constructor(
//     private authFacade: AuthFacade,
//     private templateRef: TemplateRef<any>,
//     private viewContainer: ViewContainerRef,
//     private restaurantFacade: RestaurantFacade
//   ) {}

//   @Input() appHasRole: string[] = [];
//   private hasRole: boolean = false;
//   private token: string | undefined = undefined;
//   ngOnInit(): void {
//     this.authFacade.accessToken$.subscribe((token)=>{
//       this.token = token;
//     });
//     this.updateRole();
//   }

//   private updateRole() {
//     if (this.token) {
//       const decodedToken: { role: any } = jwtDecode(this.token);
//       const userRole = decodedToken.role.name;

//       if (this.appHasRole.includes(userRole)) {
//         this.viewContainer.createEmbeddedView(this.templateRef);
//         this.hasRole = true;
//       } else {
//         this.viewContainer.clear();
//         this.hasRole = false;
//       }
//     }
//   }
// }
import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import {jwtDecode }from 'jwt-decode';  // Correct import for jwt-decode
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit, OnDestroy {

  @Input() appHasRole: string[] = [];

  private token: string | undefined;
  private hasRole: boolean = false;
  private tokenSubscription: Subscription | undefined;
  private restaurantSubscription: Subscription | undefined;
  private viewCreated: boolean = false;  // Track if the view is created

  constructor(
    private authFacade: AuthFacade,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private restaurantFacade: RestaurantFacade
  ) {}

  ngOnInit(): void {
    this.tokenSubscription = this.authFacade.accessToken$.subscribe((token) => {
      this.token = token;
      this.updateRole();  // Call updateRole here after token is received
    });
  }

  private updateRole() {
    if (this.token) {
      try {
        const decodedToken: { role: { name: string }, restaurantId?: string } = jwtDecode(this.token);
        const userRole = decodedToken.role.name;

        if (this.appHasRole.includes(userRole)) {
          if (decodedToken?.restaurantId) {
            // Dispatch action to get the restaurant by ID
            this.restaurantFacade.dispatchGetRestaurant(decodedToken?.restaurantId);

            // Unsubscribe from the previous restaurant subscription if any
            if (this.restaurantSubscription) {
              this.restaurantSubscription.unsubscribe();
            }

            // Subscribe to the selected restaurant observable
            this.restaurantSubscription = this.restaurantFacade.selectedRestaurant$.subscribe((restaurant) => {
              if (restaurant && restaurant.isOpen) {
                if (!this.viewCreated) {
                  this.viewContainer.createEmbeddedView(this.templateRef);
                  this.viewCreated = true;  // Set the flag to true when the view is created
                }
              } else {
                this.viewContainer.clear();
                this.viewCreated = false;  // Set the flag to false if the view is cleared
              }
            });
          } else {
            // No restaurant ID, but user role matches
            if (!this.viewCreated) {
              this.viewContainer.createEmbeddedView(this.templateRef);
              this.viewCreated = true;  // Set the flag to true when the view is created
            }
          }
        } else {
          // Role doesn't match, clear the view
          this.viewContainer.clear();
          this.viewCreated = false;  // Ensure flag is reset
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        this.viewContainer.clear();
        this.viewCreated = false;  // Ensure flag is reset
      }
    } else {
      this.viewContainer.clear();
      this.viewCreated = false;  // Ensure flag is reset
    }
  }

  ngOnDestroy(): void {
    if (this.tokenSubscription) {
      this.tokenSubscription.unsubscribe();  // Cleanup token subscription
    }
    if (this.restaurantSubscription) {
      this.restaurantSubscription.unsubscribe();  // Cleanup restaurant subscription
    }
  }
}
