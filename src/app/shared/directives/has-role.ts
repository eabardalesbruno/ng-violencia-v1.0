import { Directive, inject, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasRole]'
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
    if (this.authService.hasAnyRole(this.roles)) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }
}
