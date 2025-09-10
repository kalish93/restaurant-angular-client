import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { RestaurantFacade } from 'src/app/restaurant/facades/restaurant.facade';

@Directive({
  selector: '[appExcludeSubscription]',
})
export class ExcludeSubscriptionDirective implements OnInit, OnDestroy {

  @Input() appExcludeSubscription: string[] = [];

  private restaurantSubscription: Subscription | undefined;
  private viewCreated: boolean = false;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private restaurantFacade: RestaurantFacade
  ) {}

  ngOnInit(): void {
    this.restaurantSubscription = this.restaurantFacade.selectedRestaurant$.subscribe((restaurant) => {
      const subscriptionLevel: string | undefined = restaurant?.subscription;
      const shouldHide: boolean = !!subscriptionLevel && this.appExcludeSubscription.includes(subscriptionLevel);

      if (!shouldHide) {
        if (!this.viewCreated) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.viewCreated = true;
        }
      } else {
        this.viewContainer.clear();
        this.viewCreated = false;
      }
    });
  }

  ngOnDestroy(): void {
    if (this.restaurantSubscription) {
      this.restaurantSubscription.unsubscribe();
    }
  }
}


