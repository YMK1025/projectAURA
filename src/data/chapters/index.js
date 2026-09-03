import { chapter1 } from './ch1.js';
import { chapter2 } from './ch2.js';
import { chapter3 } from './ch3.js';
import { chapter4 } from './ch4.js';
import { chapter4_aura } from './ch4_aura.js';
import { chapter4_nexus } from './ch4_nexus.js';
import { chapter5_aura } from './ch5_aura.js';
import { chapter5_nexus } from './ch5_nexus.js';

export const CHAPTERS = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter4_aura,
  chapter4_nexus,
  chapter5_aura,
  chapter5_nexus,
];

/* 전체 노드 맵: id → node (빠른 검색용) */
export const NODE_MAP = {};
for (const ch of CHAPTERS) {
  for (const node of ch.nodes) {
    NODE_MAP[node.id] = node;
  }
}

export function getNode(id) {
  return NODE_MAP[id] ?? null;
}
