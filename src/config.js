export const API_URL = 'https://dummyjson.com/todos';
export const NAME = "Novo";
export const CATEGORIES = [
  'Work',
  'Personal',
  'Shopping',
  'Health',
  'Education'
];
export function getApiUrl(count) {
  return `${API_URL}?limit=${count}`;
}
document.title = NAME;

