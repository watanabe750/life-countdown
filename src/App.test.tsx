import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

describe('App', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should show setup message when no settings', () => {
    render(<App />);

    expect(screen.getByText('始めましょう')).toBeInTheDocument();
    expect(screen.getByText(/あなたの/)).toBeInTheDocument();
  });

  it('should have add target button when targets exist', () => {
    localStorage.setItem(
      'life-countdown-targets',
      JSON.stringify([{ id: 't1', type: 'age', label: '人生の目標', birthDate: '2000-05-20', targetAge: 80 }])
    );
    localStorage.setItem('life-countdown-active-target', JSON.stringify('t1'));

    render(<App />);

    expect(screen.getByRole('button', { name: /目標を追加/ })).toBeInTheDocument();
  });

  it('should show app title', () => {
    render(<App />);

    const titles = screen.getAllByText('Life Countdown');
    expect(titles.length).toBeGreaterThan(0);
  });

  it('should show privacy notice', () => {
    render(<App />);

    expect(
      screen.getByText('データはローカルに保存され、外部送信されません')
    ).toBeInTheDocument();
  });

  it('should show countdown when targets are saved', () => {
    localStorage.setItem(
      'life-countdown-targets',
      JSON.stringify([{ id: 't1', type: 'age', label: '人生の目標', birthDate: '2000-05-20', targetAge: 80 }])
    );
    localStorage.setItem('life-countdown-active-target', JSON.stringify('t1'));

    render(<App />);

    expect(screen.getByText('Time Remaining')).toBeInTheDocument();
    expect(screen.getByText(/目標:/)).toBeInTheDocument();
  });
});
