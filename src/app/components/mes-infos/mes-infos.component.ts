import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from "../../services/authentification.service";
import {Ressource} from "../../model/Ressource.model";
import {AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators} from "@angular/forms";
import {RessourcesService} from "../../services/ressources.service";
import {AccueilComponent} from "../dashboard/accueil/accueil.component";
import {HttpEventType, HttpResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CustomValidators} from "../../CustomValidator";
declare var $:any;
@Component({
  selector: 'app-mes-infos',
  templateUrl: './mes-infos.component.html',
  styleUrls: ['./mes-infos.component.css']
})
export class MesInfosComponent implements OnInit {

  constructor(private authService:AuthentificationService,private fb:FormBuilder
  ,private ressourceService:RessourcesService) { }
  imageJavaScript()
  {
    $(document).ready(function(){
// Prepare the preview for profile picture
      $("#wizard-picture").change(function(){
        readURL(this);
      });
    });
    function readURL(input) {
      if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = function (e) {
          $('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
        }
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
  javaScriptForm()
  {
    $(document).ready(function() {
      // Test for placeholder support
      $.support.placeholder = (function(){
        var i = document.createElement('input');
        return 'placeholder' in i;
      })();

      // Hide labels by default if placeholders are supported
      if($.support.placeholder) {
        $('.form-label').each(function(){
          $(this).addClass('js-hide-label');
        });

        // Code for adding/removing classes here
        $('.form-group').find('input, textarea').on('keyup blur focus', function(e){

          // Cache our selectors
          var $this = $(this),
            $label = $this.parent().find("label");

          switch(e.type) {
            case 'keyup': {
              $label.toggleClass('js-hide-label', $this.val() == '');
            } break;
            case 'blur': {
              if( $this.val() == '' ) {
                $label.addClass('js-hide-label');
              } else {
                $label.removeClass('js-hide-label').addClass('js-unhighlight-label');
              }
            } break;
            case 'focus': {
              if( $this.val() !== '' ) {
                $label.removeClass('js-unhighlight-label');
              }
            } break;
            default: break;
          }
          // previous implementation with ifs
          /*if (e.type == 'keyup') {
              if( $this.val() == '' ) {
                  $parent.addClass('js-hide-label');
              } else {
                  $parent.removeClass('js-hide-label');
              }
          }
          else if (e.type == 'blur') {
              if( $this.val() == '' ) {
                  $parent.addClass('js-hide-label');
              }
              else {
                  $parent.removeClass('js-hide-label').addClass('js-unhighlight-label');
              }
          }
          else if (e.type == 'focus') {
              if( $this.val() !== '' ) {
                  $parent.removeClass('js-unhighlight-label');
              }
          }*/
        });
      }
    });
  }
  user:Ressource;
  userFormGroup:FormGroup;
  passwordFormGroup:FormGroup;
  selectedFiles;
  currentFileUpload: any;
  progress:number;
  private currentTime: number=0;
  host=environment.host;
  passwords_match:boolean;
  passwordSubmitted:boolean=false;
  mot_de_passe_invalide=false;
   ngOnInit(): void {
    this.javaScriptForm();
    this.imageJavaScript();

     this.loadUser();
    this.userFormGroup = this.fb.group({
        codeRessource: ["", Validators.required],
        nom: ["", Validators.required],
        prenom: ["", Validators.required],
        email: ["", Validators.required],
        tel: ["", Validators.required],
        emploi: ["", Validators.required],
      },
    )
     this.passwordFormGroup = this.fb.group({
         ancien_password: ["", Validators.required],
         nouveau_password: ["", Validators.required],
         confirm_nouveau_password: ["",Validators.required]
       },
     )

  }

  async loadUser(){
    await this.authService.getUserbyEmail(this.authService.getEmail()).toPromise().then(
      user => {
        this.user = user;
      }
    );
    this.userFormGroup = this.fb.group({
        codeRessource: [this.user.codeRessource, Validators.required],
        nom: [this.user.nom, Validators.required],
        prenom: [this.user.prenom, Validators.required],
        email: [this.user.email, [Validators.email,Validators.required]],
        tel: [this.user.tel, Validators.required],
        emploi: [this.user.emploi, Validators.required],
      },
    );


  }
  onSelectedFile(event) {
    this.selectedFiles=event.target.files;

  }

  onSaveUser() {
    if(this.userFormGroup.invalid) return;
    this.ressourceService.updateWithoutRoles(this.userFormGroup.value).subscribe(data=> {
      }
    );
    this.progress = 0;
    this.currentFileUpload = this.selectedFiles.item(0)
    this.ressourceService.uploadPhoto(this.currentFileUpload, this.user.codeRessource).subscribe(event => {
      if (event.type === HttpEventType.UploadProgress) {
        this.progress = Math.round(100 * event.loaded / event.total);
      } else if (event instanceof HttpResponse) {
        //console.log(this.router.url);
        //this.getProducts(this.currentRequest);
        //this.refreshUpdatedProduct();
        this.currentTime=Date.now();
      }
    },err=>{
      alert("Problème de chargement");
    })
    this.selectedFiles = undefined
  }
  onClickInput(){
     this.mot_de_passe_invalide=false;
  }
  onSavePassword(){
  this.passwordSubmitted=true;
  this.passwords_match=this.passwordFormGroup.controls.nouveau_password.value==this.passwordFormGroup.controls.confirm_nouveau_password.value;
    if(this.passwordFormGroup.invalid||!this.passwords_match){
      return;
    }
    else{
      this.ressourceService.changePassword(this.passwordFormGroup.value,this.user.codeRessource).subscribe(
        data=>{
          this.mot_de_passe_invalide=!data;
        }
      )
    }
  }
}
