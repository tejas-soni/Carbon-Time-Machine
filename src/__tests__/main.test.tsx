import { beforeEach, describe, expect, test, vi } from 'vitest';

const renderMock = vi.fn();
const createRootMock = vi.fn(() => ({ render: renderMock }));

vi.mock('react-dom/client', () => ({
  createRoot: createRootMock,
}));

describe('main entrypoint', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    createRootMock.mockClear();
    renderMock.mockClear();
    vi.resetModules();
  });

  test('mounts the app into the root element', async () => {
    document.body.innerHTML = '<div id="root"></div>';

    await import('../main');

    expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
    expect(renderMock).toHaveBeenCalledTimes(1);
  });

  test('throws when the root element is missing', async () => {
    await expect(import('../main')).rejects.toThrow(/root element not found/i);
  });
});
