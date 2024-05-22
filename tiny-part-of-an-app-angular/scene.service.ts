/*
 * Copyright ContentAccess.com. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Scene } from './models/scene.interface';

@Injectable({
  providedIn: 'root',
})
export class SceneService {
  constructor(private http: HttpClient) {}
  baseUrl = `${localStorage.getItem('apiGatewayUrl')}`;

  fetch(): Observable<Scene[]> {
    return this.http.get<Scene[]>(`${this.baseUrl}/scenes`);
  }

  get(sceneId: string): Observable<Scene> {
    const url = `${this.baseUrl}/scene/${sceneId}`;
    return this.http.get<Scene>(url);
  }

  delete(scene: Scene) {
    const url = `${this.baseUrl}/scene/${scene.shardId}:${scene.sceneId}`;
    return this.http.delete<Scene>(url);
  }

  put(scene: Scene) {
    const url = `${this.baseUrl}/scene/${scene.shardId}:${scene.sceneId}`;
    return this.http.put<Scene>(url, scene);
  }

  publish(scene: Scene) {
    const url = `${this.baseUrl}/scene/publish/${scene.shardId}:${scene.sceneId}`;
    return this.http.post<Scene>(url, scene);
  }

  post(scene: Scene) {
    return this.http.post<Scene>(`${this.baseUrl}/scene`, scene);
  }
}
