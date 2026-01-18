// Utility functions for various tests

export const add = (a: number, b: number): number => {
    return a + b;
};

export const multiply = (a: number, b: number): number => {
    return a * b;
};

export const isEven = (num: number): boolean => {
    return num % 2 === 0;
};

export const formatCurrency = (amount: number, currency: string = 'PLN'): string => {
    return `${amount.toFixed(2)} ${currency}`;
};

export const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const capitalize = (text: string): string => {
    if (!text) return '';
    return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const filterAdults = (
    people: { name: string; age: number }[]
): { name: string; age: number }[] => {
    return people.filter(person => person.age >= 18);
};

export class Calculator {
    private history: number[] = [];

    add(a: number, b: number): number {
        const result = a + b;
        this.history.push(result);
        return result;
    }

    getHistory(): number[] {
        return [...this.history];
    }

    clearHistory(): void {
        this.history = [];
    }
}
