import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { jwtDecode } from "jwt-decode";
import { AuthFacade } from 'src/app/auth/facade/auth.facade';
@Directive({
  selector: '[appHasRole]',
})
export class HasRoleDirective implements OnInit{

  constructor(
    private authFacade: AuthFacade,
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
  ) {}

  @Input() appHasRole: string[] = [];
  private hasRole: boolean = false;
  private token: string | undefined = undefined;
  ngOnInit(): void {
    this.authFacade.accessToken$.subscribe((token)=>{
      this.token = token;
    });
    this.updateRole();
  }

  private updateRole() {
    if (this.token) {
      const decodedToken: { role: any } = jwtDecode(this.token);
      const userRole = decodedToken.role.name;

      if (this.appHasRole.includes(userRole)) {
        this.viewContainer.createEmbeddedView(this.templateRef);
        this.hasRole = true;
      } else {
        this.viewContainer.clear();
        this.hasRole = false;
      }
    }
  }
}
