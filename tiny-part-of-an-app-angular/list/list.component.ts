import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Scene } from '../models/scene.interface';
import { SceneService } from '../scene.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  sceneData: Scene[] = [];
  isLoading: boolean = true;
  displayedColumns: string[] = ['title', 'description'];

  constructor(private sceneSvc: SceneService, private router: Router) {}

  ngOnInit(): void {
    this.sceneSvc.fetch().subscribe((data) => {
      this.sceneData = data;
      this.isLoading = false;
    });
  }

  onEdit(scene: Scene) {
    this.router.navigate(['scenes', 'edit', scene.sceneId]);
    return false;
  }

  onRemove(scene: Scene) {
    this.sceneSvc.delete(scene);
    this.isLoading = true;
    this.sceneSvc.fetch().subscribe((data) => {
      this.sceneData = data;
      this.isLoading = false;
    });
  }

  onCreate() {
    this.router.navigate(['scenes', 'create']);
  }
}
