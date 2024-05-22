import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SceneService } from '../scene.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss'],
})
export class CreateComponent implements OnInit {
  sceneForm: FormGroup;
  categories: string[] = ['category1', 'category2', 'category3', 'category4'];
  constructor(
    private fb: FormBuilder,
    private sceneSvc: SceneService,
    private router: Router
  ) {
    this.sceneForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.sceneForm = this.fb.group({
      cliSettings: '',
      description: '',
      domain: '',
      linksMap: '',
      optionsMap: '',
      template: ['', Validators.required],
      title: ['', Validators.required]
    });
  }

  get title() {
    return this.sceneForm.get('title');
  }

  get template() {
    return this.sceneForm.get('template');
  }

  submit() {
    this.sceneSvc.post(this.sceneForm.value).subscribe({
      next: () => this.router.navigate(['scenes']),
      error: (err) => {
        alert(err.message);
        console.error(err);
      },
    });
  }

  cancel() {
    this.router.navigate(['scenes']);
  }
}
