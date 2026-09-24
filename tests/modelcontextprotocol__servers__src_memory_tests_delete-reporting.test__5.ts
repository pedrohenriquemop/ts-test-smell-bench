import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { KnowledgeGraphManager, Entity, Relation } from '../index.js';


describe('delete reporting', () => {
  let manager: KnowledgeGraphManager;
  let testFilePath: string;
  const entities: Entity[] = [
      { name: 'Alice', entityType: 'person', observations: ['works at Acme Corp', 'likes tea'] },
      { name: 'Bob', entityType: 'person', observations: ['likes programming'] },
    ];
  const relations: Relation[] = [{ from: 'Alice', to: 'Bob', relationType: 'works_with' }];
  beforeEach(async () => {
      testFilePath = path.join(
        path.dirname(fileURLToPath(import.meta.url)),
        `test-delete-reporting-${Date.now()}-${Math.random().toString(16).slice(2)}.jsonl`
      );
      manager = new KnowledgeGraphManager(testFilePath);
      await manager.createEntities(entities);
      await manager.createRelations(relations);
    });
  afterEach(async () => {
      try {
        await fs.unlink(testFilePath);
      } catch {
        // the file is gone already
      }
    });

  describe('deleteRelations', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('counts only the relations that matched', async () => {
          const result = await manager.deleteRelations([
            { from: 'Alice', to: 'Bob', relationType: 'works_with' },
            { from: 'Alice', to: 'Bob', relationType: 'never_existed' },
          ]);
          expect(result).toEqual({ deletedCount: 1 });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});