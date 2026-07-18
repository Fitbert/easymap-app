// Shared design tokens. Every screen must look identical on iOS and Android,
// so we never use platform-specific components or platform default styling here.

export const colors = {
  background: '#FFFFFF',
  text: '#1A1A1A',
  primary: '#1B5E20', // dark green, ~7.5:1 contrast on white — passes WCAG AA
  primaryText: '#FFFFFF',
  back: '#33475B', // dark slate, ~8.7:1 contrast on white
  backText: '#FFFFFF',
  border: '#D0D0D0',
};

export const spacing = {
  sm: 12,
  md: 20,
  lg: 32,
};

export const fontSize = {
  body: 22, // spec minimum: body text >= 20pt
  button: 26, // spec minimum: buttons >= 24pt
  title: 32,
};

// Minimum touch target per spec: 60x60pt
export const minTouchTarget = 60;
