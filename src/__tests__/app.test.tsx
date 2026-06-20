import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';
import App from '../App';
import { getTodayDateString, saveCheckInHistory, saveResultData } from '../utils/storage';
import { calculateResults } from '../utils/scoring';
import { CheckInHistory } from '../types';

function answerQuizWithFirstOptions(): void {
  for (let index = 0; index < 12; index += 1) {
    fireEvent.click(screen.getAllByRole('radio')[0]);
    const isLastQuestion = index === 11;
    fireEvent.click(
      screen.getByRole('button', {
        name: isLastQuestion ? /see my future/i : /next question/i,
      }),
    );
  }
}

describe('App flow', () => {
  test('completes the core quiz flow, commits a pledge, checks in, and resets', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /enter the time machine/i }));
    answerQuizWithFirstOptions();

    expect(await screen.findByText('Quiet Saver')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /read note/i }));
    expect(screen.getByText(/Dear Present Me/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /commit to your recommended habit shift/i }));
    expect(await screen.findByText(/Your Habit Shift Commitment/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /record today's habit shift check-in/i }));
    expect(await screen.findByRole('alert')).toHaveTextContent(/great job/i);

    fireEvent.click(screen.getByRole('button', { name: /view analysis dashboard/i }));
    expect(await screen.findByText(/Estimated Footprint:/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /reset all quiz data and restart/i }));
    expect(await screen.findByRole('button', { name: /enter the time machine/i })).toBeInTheDocument();
  });

  test('restores saved results and caches successful AI note generation', async () => {
    saveResultData(calculateResults({}));
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        candidates: [
          {
            content: {
              parts: [{ text: 'Thank you for changing the pattern.' }],
            },
          },
        ],
      }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<App />);

    expect(await screen.findByText('Quiet Saver')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /personalize with ai/i }));
    expect(await screen.findByText(/AI PERSONALIZED CORRESPONDENCE/i)).toBeInTheDocument();
    expect(screen.getByText(/Thank you for changing the pattern\./i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /personalize with ai/i }));
    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
  });

  test('restores saved pledge history and falls back when AI generation fails', async () => {
    const result = calculateResults({});
    const history: CheckInHistory = {
      pledge: {
        archetype: result.archetype,
        shiftText: result.recommendedShift,
        co2eSaving: 150,
        pledgedAt: new Date().toISOString(),
      },
      checkInDates: [getTodayDateString()],
    };

    saveResultData(result);
    saveCheckInHistory(history);
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network failed')));

    render(<App />);
    expect(await screen.findByText(/Your Habit Shift Commitment/i)).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveTextContent(/come back tomorrow/i);

    fireEvent.click(screen.getByRole('button', { name: /view analysis dashboard/i }));
    fireEvent.click(screen.getByRole('button', { name: /personalize with ai/i }));

    expect(await screen.findByText(/GEMINI_API_KEY/i)).toBeInTheDocument();
  });

  test('keeps the current screen when reset is cancelled', async () => {
    saveResultData(calculateResults({}));
    vi.mocked(window.confirm).mockReturnValue(false);

    render(<App />);
    expect(await screen.findByText('Quiet Saver')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /reset all quiz data and restart/i }));
    expect(screen.getByText('Quiet Saver')).toBeInTheDocument();
  });

  test('falls back to the local note when AI returns an invalid payload', async () => {
    saveResultData(calculateResults({}));
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ candidates: [] }),
      }),
    );

    render(<App />);
    expect(await screen.findByText('Quiet Saver')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /personalize with ai/i }));
    expect(await screen.findByText(/GEMINI_API_KEY/i)).toBeInTheDocument();
  });
});
