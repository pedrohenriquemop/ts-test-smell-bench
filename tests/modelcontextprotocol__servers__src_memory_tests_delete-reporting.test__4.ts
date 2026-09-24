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

  describe('deleteObservations', () => {

    // ── TARGET TEST ─────────────────────────────────
    it('names an entity that does not exist', async () => {
          const result = await manager.deleteObservations([
            { entityName: 'Carol', observations: ['anything'] },
          ]);
          expect(result).toEqual({ deletedCount: 0, missingEntities: ['Carol'] });
        })
    // ── END TARGET TEST ─────────────────────────────
  });
});