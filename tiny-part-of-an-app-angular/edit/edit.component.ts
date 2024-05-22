/*
 * Copyright ContentAccess.com. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Scene } from '../models/scene.interface';
import { SceneService } from '../scene.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit {
  sceneForm: FormGroup;
  categories: string[] = ['category1', 'category2', 'category3', 'category4'];
  scene$: Observable<Scene | undefined> | undefined;
  sceneId$: Observable<string> | undefined;
  sceneTitle$: Observable<string | undefined> | undefined;

  constructor(
    private fb: FormBuilder,
    private sceneSvc: SceneService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.sceneForm = this.fb.group({});
  }

  ngOnInit(): void {
    this.sceneForm = this.fb.group({
      shardId: [],
      sceneId: [],
      cliSettings: '',
      description: '',
      domain: '',
      linksMap: '',
      optionsMap: '',
      template: ['', Validators.required],
      title: ['', Validators.required]
    });

    this.sceneId$ = this.route.params.pipe(map((p) => p['sceneId']));
    this.scene$ = this.sceneId$.pipe(
      switchMap((p) => this.sceneSvc.get(p))
    );
    this.sceneTitle$ = this.scene$.pipe(map((p) => p?.title));

    this.scene$.subscribe((val) => {
      this.sceneForm?.patchValue({
        ...val,
      });
    });
  }

  get title() {
    return this.sceneForm?.get('title');
  }

  get template() {
    return this.sceneForm?.get('template');
  }

  submit() {
    this.sceneSvc.put(this.sceneForm?.value).subscribe({
      next: () => this.router.navigate(['scenes']),
      error: (err) => console.error(err),
    });
  }

  publish() {
    this.sceneSvc.publish(this.sceneForm?.value).subscribe({
      //TODO: need to make this stay on the page
      next: () => this.router.navigate(['scenes']),
      error: (err) => console.error(err),
    });
  }

  delete() {
    this.sceneSvc.delete(this.sceneForm?.value).subscribe({
      next: () => this.router.navigate(['scenes']),
      error: (err) => {
        alert(err);
        console.error(err);
      },
    });
  }

  cancel() {
    this.router.navigate(['scenes']);
  }
}
