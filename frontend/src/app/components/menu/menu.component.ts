import {
  Component,
  HostListener,
  ElementRef,
  OnInit,
  OnDestroy,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import {
  Router,
  NavigationEnd,
  RouterModule,
  NavigationStart,
} from "@angular/router";
import { filter, map, Observable, Subscription } from "rxjs";
import { LoginService } from "../../services/login/login.service";

@Component({
  selector: "app-menu",
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: "./menu.component.html",
  styleUrls: ["./menu.component.css"],
})
export class MenuComponent implements OnInit, OnDestroy {
  isMenuOpen = false;
  currentSection$: Observable<string>;
  private routerSubscription!: Subscription;

  constructor(
    private router: Router,
    private elementRef: ElementRef,
    private loginService: LoginService,
  ) {
    this.currentSection$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getSectionFromUrl(this.router.url)),
    );
  }

  ngOnInit() {
    this.routerSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart && this.isMenuOpen) {
        this.closeMenu();
      }
    });
  }

  ngOnDestroy() {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  logout() {
    const sessao = this.loginService.obterDadosDaSessao();
    if (sessao) {
      this.loginService.logout();
    }

    this.router.navigate(["/auth/login"]);
  }

  @HostListener("document:click", ["$event"])
  onClick(event: MouseEvent) {
    const menucont = this.elementRef.nativeElement.querySelector("#mainMenu");
    const btnHamburguer = this.elementRef.nativeElement.querySelector(".btnHamburguer");

    if (
      menucont &&
      !menucont.contains(event.target) &&
      (!btnHamburguer || !btnHamburguer.contains(event.target))
    ) {
      this.closeMenu();
    }
  }

  private getSectionFromUrl(url: string): string {
    if (url.includes("public") || url.includes("auth")) return "auth";
    if (url.includes("client")) return "cliente";
    if (url.includes("adm")) return "empregado";
    return "desconhecido";
  }
}
