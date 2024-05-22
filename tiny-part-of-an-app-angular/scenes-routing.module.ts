/*
 * Copyright ContentAccess.com. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'prefix',
  },
  {
    path: 'list',
    data: {
      title: 'Scene List',
    },
    component: ListComponent,
  },
  {
    path: 'create',
    data: {
      title: 'Create new Scene',
    },
    component: CreateComponent,
  },
  {
    path: 'edit/:sceneId',
    data: {
      title: 'Edit Scene',
    },
    component: EditComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScenesRoutingModule {}
