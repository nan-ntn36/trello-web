import { useCallback } from 'react';
import { debounce } from 'lodash';

export const useDebounceHookFn = (fnDebounced, delay = 500) => {
  if (isNaN(delay)) throw new Error('Delay must be a positive number');

  if (!fnDebounced || typeof fnDebounced !== 'function') {
    throw new Error('fnDebounced must be a function');
  }

  // useCallback sẽ giúp chúng ta tránh việc mỗi lần render lại thì debounce lại bị tạo ra 1 cái mới, mà debounce nó cần phải giữ nguyên cái reference của nó để nó có thể clearTimeout được.
  return useCallback(debounce(fnDebounced, delay), [fnDebounced, delay]);
};
