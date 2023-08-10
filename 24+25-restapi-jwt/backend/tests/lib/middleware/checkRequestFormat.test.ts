import { it, expect, describe, vi } from 'vitest';
import sinon from 'sinon';

import { checkRequestFormat } from '../../../src/lib/middleware/checkRequestFormat';

describe('checkRequestFormat()', () => {
  it('should throw error if received request is not valid jsonapi', () => {
    const req = {
      // body: {
      //   data: {
      //     attributes: {},
      //   },
      // },
      something: {},
    };

    expect(() => checkRequestFormat(req, {}, () => {})).toThrow('form data should be sent in JsonApi format');
  });

  it('should call next() if received request is valid jsonapi', () => {
    const req = {
      body: {
        data: {
          attributes: {},
        },
      },
    };

    const methods = {
      next: () => {},
    };
    const spy = vi.spyOn(methods, 'next');

    checkRequestFormat(req, {}, methods.next);
    expect(spy).toHaveBeenCalled();
  });
});
