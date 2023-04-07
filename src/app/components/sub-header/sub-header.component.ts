import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime } from "rxjs/operators";
import { Router } from '@angular/router';

@Component({
  selector: 'app-sub-header',
  templateUrl: './sub-header.component.html',
  styleUrls: ['./sub-header.component.css']
})
export class SubHeaderComponent {
  constructor(private auth:AuthService, private fb: FormBuilder, private api: ApiService, private router: Router) {}

  username:string|null='';
  user:any;
  searchList: Array<any> = [];
  inputValue?: string;
  searchForm!: FormGroup;

  ngOnInit() {
    this.username = this.auth.getUsername();

    this.auth.getUserDetail(this.username)
    .subscribe({
      next: (res) => {
        this.user=res;
      }
    })

    this.searchForm = this.fb.group({
      search: ['']
    })
    
    this.searchForm.valueChanges
    .pipe(debounceTime(1000))
    .subscribe(data => {
      if (data.search) {
        this.api.searchFriend(data.search)
        .subscribe({
          next: (res) => {
            this.searchList = res;
          }
        })
      } else {
        this.searchList = []
      }
    })
  }

  handleClickPersonel(id:number) {
    this.router.navigate([`personal`, id])
  }
}
