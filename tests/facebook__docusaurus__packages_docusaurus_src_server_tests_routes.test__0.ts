import {describe, expect, it, vi} from 'vitest';
import {handleDuplicateRoutes} from '../routes';
import type {RouteConfig} from '@docusaurus/types';


describe('handleDuplicateRoutes', () => {
  const routes: RouteConfig[] = [
      {
        path: '/',
        component: '',
        routes: [
          {path: '/search', component: ''},
          {path: '/sameDoc', component: ''},
        ],
      },
      {
        path: '/',
        component: '',
        routes: [
          {path: '/search', component: ''},
          {path: '/sameDoc', component: ''},
          {path: '/uniqueDoc', component: ''},
        ],
      },
      {
        path: '/',
        component: '',
      },
      {
        path: '/',
        component: '',
      },
      {
        path: '/',
        component: '',
      },
    ];

  // ── TARGET TEST ─────────────────────────────────
  it('works', () => {
      expect(() => {
        handleDuplicateRoutes(routes, 'throw');
      }).toThrowErrorMatchingInlineSnapshot(`
        [Error: Duplicate routes found!
        - Attempting to create page at /search, but a page already exists at this route.
        - Attempting to create page at /sameDoc, but a page already exists at this route.
        - Attempting to create page at /, but a page already exists at this route.
        - Attempting to create page at /, but a page already exists at this route.
        This could lead to non-deterministic routing behavior.]
      `);
      using log = vi.spyOn(console, 'log');
      handleDuplicateRoutes(routes, 'ignore');
      expect(log).toHaveBeenCalledTimes(0);
    })
  // ── END TARGET TEST ─────────────────────────────
});