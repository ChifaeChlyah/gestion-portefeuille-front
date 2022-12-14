import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ProjetsService} from "../../../../services/projets.service";
import {PortefeuilleService} from "../../../../services/portefeuille.service";
import {Router} from "@angular/router";
declare var $:any;
@Component({
  selector: 'app-nouveau-portefeuille',
  templateUrl: './nouveau-portefeuille.component.html',
  styleUrls: ['./nouveau-portefeuille.component.css']
})
export class NouveauPortefeuilleComponent implements OnInit {
  portefeuilleFormGroup!:FormGroup;
  submitted: boolean;
  codeExistant;
  constructor(private fb:FormBuilder,private portefeuilleService:PortefeuilleService,
              private router:Router) { }

  ngOnInit(): void {
    this.portefeuilleFormGroup=this.fb.group({
        codeFamille: ["",Validators.required],
        titreFamille: ["", Validators.required],
        description: ["", Validators.required],
    }
    )
    this.javaScriptForm();
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
  onSavePortefeuille() {
    this.submitted=true;
    if(this.portefeuilleFormGroup?.invalid) return;
    this.portefeuilleService.save(this.portefeuilleFormGroup.value).subscribe(
      data=>{
        if(data==false)
        {
          this.codeExistant=true;
          return;
        }
        this.router.navigateByUrl("/projets/liste-portefeuilles");
      }
    );
  }
}
