import {
    add,
    multiply,
    isEven,
    formatCurrency,
    validateEmail,
    capitalize,
    filterAdults,
    Calculator,
} from '../src/utils';

describe('Math Functions', () => {
    describe('add', () => {
        test('should add two positive numbers', () => {
            expect(add(2, 3)).toBe(5);
        });

        test('should add negative numbers', () => {
            expect(add(-1, -2)).toBe(-3);
        });

        test('should add positive and negative numbers', () => {
            expect(add(5, -3)).toBe(2);
        });

        test('should handle zero', () => {
            expect(add(0, 5)).toBe(5);
            expect(add(5, 0)).toBe(5);
        });
    });

    describe('multiply', () => {
        test('should multiply positive numbers', () => {
            expect(multiply(3, 4)).toBe(12);
        });

        test('should multiply by zero', () => {
            expect(multiply(5, 0)).toBe(0);
        });

        test('should multiply negative numbers', () => {
            expect(multiply(-2, -3)).toBe(6);
            expect(multiply(-2, 3)).toBe(-6);
        });
    });

    describe('isEven', () => {
        test('should return true for even numbers', () => {
            expect(isEven(2)).toBe(true);
            expect(isEven(4)).toBe(true);
            expect(isEven(0)).toBe(true);
        });

        test('should return false for odd numbers', () => {
            expect(isEven(1)).toBe(false);
            expect(isEven(3)).toBe(false);
            expect(isEven(5)).toBe(false);
        });
    });
});

describe('String Functions', () => {
    describe('formatCurrency', () => {
        test('should format currency with default PLN', () => {
            expect(formatCurrency(123.45)).toBe('123.45 PLN');
        });

        test('should format currency with custom currency', () => {
            expect(formatCurrency(100, 'USD')).toBe('100.00 USD');
        });

        test('should format whole numbers with decimals', () => {
            expect(formatCurrency(50)).toBe('50.00 PLN');
        });

        test('should round to 2 decimal places', () => {
            expect(formatCurrency(123.456)).toBe('123.46 PLN');
        });
    });

    describe('validateEmail', () => {
        test('should return true for valid emails', () => {
            expect(validateEmail('test@example.com')).toBe(true);
            expect(validateEmail('user.name@domain.co.uk')).toBe(true);
            expect(validateEmail('admin@test.org')).toBe(true);
        });

        test('should return false for invalid emails', () => {
            expect(validateEmail('invalid-email')).toBe(false);
            expect(validateEmail('test@')).toBe(false);
            expect(validateEmail('@domain.com')).toBe(false);
            expect(validateEmail('test.domain.com')).toBe(false);
            expect(validateEmail('')).toBe(false);
        });
    });

    describe('capitalize', () => {
        test('should capitalize first letter', () => {
            expect(capitalize('hello')).toBe('Hello');
            expect(capitalize('WORLD')).toBe('World');
        });

        test('should handle empty string', () => {
            expect(capitalize('')).toBe('');
        });

        test('should handle single character', () => {
            expect(capitalize('a')).toBe('A');
        });

        test('should handle mixed case', () => {
            expect(capitalize('hELLo WoRLd')).toBe('Hello world');
        });
    });
});

describe('Array Functions', () => {
    describe('filterAdults', () => {
        const testPeople = [
            { name: 'Jan', age: 25 },
            { name: 'Anna', age: 16 },
            { name: 'Piotr', age: 18 },
            { name: 'Maria', age: 17 },
            { name: 'Tomasz', age: 30 },
        ];

        test('should filter only adults (age >= 18)', () => {
            const adults = filterAdults(testPeople);
            expect(adults).toHaveLength(3);
            expect(adults).toEqual([
                { name: 'Jan', age: 25 },
                { name: 'Piotr', age: 18 },
                { name: 'Tomasz', age: 30 },
            ]);
        });

        test('should return empty array when no adults', () => {
            const minors = [
                { name: 'Ala', age: 15 },
                { name: 'Kasia', age: 17 },
            ];
            expect(filterAdults(minors)).toEqual([]);
        });

        test('should handle empty array', () => {
            expect(filterAdults([])).toEqual([]);
        });
    });
});

describe('Calculator Class', () => {
    let calculator: Calculator;

    beforeEach(() => {
        calculator = new Calculator();
    });

    describe('add method', () => {
        test('should add numbers and return result', () => {
            expect(calculator.add(2, 3)).toBe(5);
        });

        test('should store results in history', () => {
            calculator.add(2, 3);
            calculator.add(5, 7);

            expect(calculator.getHistory()).toEqual([5, 12]);
        });
    });

    describe('history management', () => {
        test('should start with empty history', () => {
            expect(calculator.getHistory()).toEqual([]);
        });

        test('should clear history', () => {
            calculator.add(1, 2);
            calculator.add(3, 4);
            expect(calculator.getHistory()).toHaveLength(2);

            calculator.clearHistory();
            expect(calculator.getHistory()).toEqual([]);
        });

        test('should return copy of history (immutable)', () => {
            calculator.add(1, 2);
            const history1 = calculator.getHistory();
            const history2 = calculator.getHistory();

            expect(history1).toEqual(history2);
            expect(history1).not.toBe(history2); // Different objects
        });
    });
});
