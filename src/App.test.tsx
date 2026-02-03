import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show setup message when no settings', () => {
    render(<App />);

    expect(screen.getByText('まず設定してください')).toBeInTheDocument();
    expect(screen.getByText('設定を開く')).toBeInTheDocument();
  });

  it('should have settings button in header', () => {
    render(<App />);

    const settingsButtons = screen.getAllByRole('button', { name: '設定' });
    expect(settingsButtons.length).toBeGreaterThan(0);
  });

  it('should show app title', () => {
    render(<App />);

    expect(screen.getByText('Life Countdown')).toBeInTheDocument();
  });

  it('should show privacy notice', () => {
    render(<App />);

    expect(
      screen.getByText('データは端末内（localStorage）に保存され、外部送信しません')
    ).toBeInTheDocument();
  });

  it('should show countdown when settings are saved', () => {
    // Pre-populate localStorage with settings
    localStorage.setItem(
      'life-countdown-settings',
      JSON.stringify({
        birthDate: '2000-05-20',
        targetAge: 80,
      })
    );

    render(<App />);

    expect(screen.getByText('残り時間')).toBeInTheDocument();
    expect(screen.getByText(/目標日:/)).toBeInTheDocument();
  });
});
