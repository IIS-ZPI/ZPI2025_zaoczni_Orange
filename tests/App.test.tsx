import { render, screen, fireEvent } from '@testing-library/react';
import App from '../src/App';

describe('App Component', () => {
  test('renders Vite + React heading', () => {
    render(<App />);
    const heading = screen.getByText('Vite + React');
    expect(heading).toBeInTheDocument();
  });

  test('renders count button with initial value 0', () => {
    render(<App />);
    const button = screen.getByText('count is 0');
    expect(button).toBeInTheDocument();
  });

  test('increments count when button is clicked', () => {
    render(<App />);
    const button = screen.getByText('count is 0');
    
    fireEvent.click(button);
    expect(screen.getByText('count is 1')).toBeInTheDocument();
    
    fireEvent.click(button);
    expect(screen.getByText('count is 2')).toBeInTheDocument();
  });

  test('renders Vite and React logos', () => {
    render(<App />);
    const viteLogo = screen.getByAltText('Vite logo');
    const reactLogo = screen.getByAltText('React logo');
    
    expect(viteLogo).toBeInTheDocument();
    expect(reactLogo).toBeInTheDocument();
  });

  test('renders edit instruction text', () => {
    render(<App />);
    const codeElement = screen.getByText('src/App.tsx');
    const hmrText = screen.getByText(/and save to test HMR/);
    
    expect(codeElement).toBeInTheDocument();
    expect(hmrText).toBeInTheDocument();
    
    // Check if the paragraph containing the instruction exists
    const instructionParagraph = screen.getByText((_, element) => {
      return element?.textContent === 'Edit src/App.tsx and save to test HMR';
    });
    expect(instructionParagraph).toBeInTheDocument();
  });
});