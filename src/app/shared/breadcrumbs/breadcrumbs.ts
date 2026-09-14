import { Component, inject } from '@angular/core';
import {CommonModule} from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink} from '@angular/router';
import { filter, map } from 'rxjs';
import { MatIconModule} from '@angular/material/icon';

interface Breadcrumb {
  label: string;
  url: string;
}
@Component({
  selector: 'app-breadcrumbs',
  standalone: true,
  imports: [
     CommonModule,
     MatIconModule,
     RouterLink 
  ],
  templateUrl: './breadcrumbs.html',
  styleUrl: './breadcrumbs.scss',
})


export class Breadcrumbs {
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
   breadcrumbs: Breadcrumb [] =[];
    constructor(){
      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(
          this.activatedRoute.root
        );
      });
    }

    private createBreadcrumbs(route: ActivatedRoute, url:string ='',
      breadcrumbs:Breadcrumb[]=[]): Breadcrumb[]{
        const children = route.children

        if(children.length === 0){
          return breadcrumbs;
        }
        for (const child of children){
          const routeURL  = child.snapshot.url
               .map(segment => segment.path)
               .filter(path => path)
               .join('/');
          if(routeURL !== ''){
            url += `/${routeURL}`;
          }
          const label = child.snapshot.data['breadcrumb'];
          if(label !== undefined){
            breadcrumbs.push({label, url});
          }
          return this.createBreadcrumbs(child, url, breadcrumbs);
        }
        return breadcrumbs;
      }
}

