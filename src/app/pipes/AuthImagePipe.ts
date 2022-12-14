import {Pipe, PipeTransform} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {AuthentificationService} from "../services/authentification.service";

@Pipe({
  name: 'authImage'
})
export class AuthImagePipe implements PipeTransform {

  constructor(
    private http: HttpClient,
    private auth: AuthentificationService, // our service that provides us with the authorization token
  ) {}


  async transform(src: string): Promise<string> {
    const token = this.auth.getToken();
    const headers = new HttpHeaders({'Authorization': this.auth.getToken()});
    const imageBlob = await this.http.get(src, {headers, responseType: 'blob'}).toPromise();
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(imageBlob);
    });
  }

}
