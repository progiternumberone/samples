/*
 * Copyright ContentAccess.com. All Rights Reserved.
 * SPDX-License-Identifier: MIT-0
 */
export interface Scene {
  key: string;
  shardId: string;
  sceneId: string;
  
  cliSettings: string;
  description: string;
  domain: string;
  linksMap: string;
  optionsMap: string;
  template: string;
  title: string;
}
