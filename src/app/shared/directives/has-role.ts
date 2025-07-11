import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]',
  standalone: true
})
export class HasRole {

  private readonly authService = inject(AuthService);
  private readonly viewContainerRef = inject(ViewContainerRef);
  private readonly templateRef = inject(TemplateRef<any>);

  private roles: string[] = [];

  @Input()
  set appHasRole(value: string | string[]) {
    this.roles = Array.isArray(value) ? value : [value];
    this.updateView();
  }

  private updateView() {
    // ADMIN puede ver ABSOLUTAMENTE TODO
    if (this.authService.isAdmin()) {
      console.log('🔐 ADMIN detected - showing ALL content');
      this.viewContainerRef.createEmbeddedView(this.templateRef);
      return;
    }
    
    // Para otros roles, verificar si tiene CUALQUIER rol de los requeridos
    if (this.authService.hasAnyRole(this.roles)) {
      console.log('🔐 User has required role - showing content');
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      console.log('🔐 User does not have required role - hiding content');
      this.viewContainerRef.clear();
    }
  }
}
