import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import ShareCard from '../components/ShareCard';
import { APP_LINK } from '../components/shareCardUtils';
import { calculateResults } from '../utils/scoring';

const result = calculateResults({});

function setNavigatorProperty<T>(key: 'clipboard' | 'share', value: T): void {
  Object.defineProperty(window.navigator, key, {
    value,
    configurable: true,
    writable: true,
  });
}

describe('ShareCard', () => {
  beforeEach(() => {
    setNavigatorProperty('clipboard', undefined);
    setNavigatorProperty('share', undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('copies share text with the clipboard API', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorProperty('clipboard', { writeText });

    render(<ShareCard result={result} />);

    fireEvent.click(screen.getByRole('button', { name: /copy share card/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));
    expect(writeText).toHaveBeenCalledWith(expect.stringContaining(APP_LINK));
    expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
  });

  test('falls back to document.execCommand when the clipboard API is unavailable', async () => {
    const execCommand = vi.fn().mockReturnValue(true);
    Object.defineProperty(document, 'execCommand', {
      value: execCommand,
      configurable: true,
    });

    render(<ShareCard result={result} />);

    fireEvent.click(screen.getByRole('button', { name: /copy share card/i }));
    await waitFor(() => expect(execCommand).toHaveBeenCalledWith('copy'));
    expect(screen.getByRole('status')).toHaveTextContent(/copied to clipboard/i);
  });

  test('shows a failure toast when copying throws', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('copy failed'));
    setNavigatorProperty('clipboard', { writeText });

    render(<ShareCard result={result} />);

    fireEvent.click(screen.getByRole('button', { name: /copy share card/i }));
    expect(await screen.findByRole('status')).toHaveTextContent(/failed to copy/i);
  });

  test('uses the native share API and exposes social share links', async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    const writeText = vi.fn().mockResolvedValue(undefined);
    setNavigatorProperty('share', share);
    setNavigatorProperty('clipboard', { writeText });

    render(<ShareCard result={result} />);

    fireEvent.click(screen.getByRole('button', { name: /share future/i }));
    await waitFor(() => expect(share).toHaveBeenCalledWith(expect.objectContaining({
      title: 'Carbon Time Machine Result',
      url: APP_LINK,
    })));

    fireEvent.click(screen.getByRole('button', { name: /copy share text to clipboard/i }));
    await waitFor(() => expect(writeText).toHaveBeenCalledTimes(1));

    expect(screen.getByRole('link', { name: /share results on x/i })).toHaveAttribute('href', expect.stringContaining('twitter.com/intent/tweet'));
    expect(screen.getByRole('link', { name: /share results on linkedin/i })).toHaveAttribute('href', expect.stringContaining(encodeURIComponent(APP_LINK)));
    expect(screen.getByRole('link', { name: /share results on facebook/i })).toHaveAttribute('href', expect.stringContaining('facebook.com/sharer'));
  });

  test('logs a warning when the native share API rejects', async () => {
    const share = vi.fn().mockRejectedValue(new Error('cancelled'));
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => undefined);
    setNavigatorProperty('share', share);

    render(<ShareCard result={result} />);

    fireEvent.click(screen.getByRole('button', { name: /share future/i }));
    await waitFor(() => expect(share).toHaveBeenCalledTimes(1));
    expect(warnSpy).toHaveBeenCalled();
  });
});
