import { Component,OnInit } from '@angular/core';
import { User } from './models/user';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  providers:[UserService]
})
export class AppComponent implements OnInit {
  public title = 'Musify';
  public user:User;
  public identity=false;
  public token;
  public errorMessage;
    constructor(private _userService:UserService){
      this.user=new User('','','','','','ROLE_USER','');
    }
    ngOnInit(){
      // var text = this._userService.signup();
      // console.log(text);
    }

    public onSumit(){
      console.log(this.user);
      this._userService.signup(this.user).subscribe(
        response =>{
          console.log(response);
        },
        error => {
          var errorMessage = <any>error;
          if(errorMessage != null){
            var body = JSON.parse(error._body);
            this.errorMessage = body.message;
            console.log(error);
          }
        }
      );
    }
}
