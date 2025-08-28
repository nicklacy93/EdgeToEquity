export const bloombergTheme = {
  colors: {
    dark: {
      background: '#0a0a0a',
      surface: '#141414',
      primary: '#00d4ff',
      secondary: '#ff6b35',
      success: '#00ff87',
      warning: '#ffb800',
      error: '#ff4757',
      text: {
        primary: '#ffffff',
        secondary: '#a0a0a0',
        muted: '#666666'
      },
      border: '#2a2a2a',
      accent: '#1a1a1a'
    },
    light: {
      background: '#ffffff',
      surface: '#f8f9fa',
      primary: '#0066cc',
      secondary: '#ff6b35',
      success: '#28a745',
      warning: '#ffc107',
      error: '#dc3545',
      text: {
        primary: '#212529',
        secondary: '#6c757d',
        muted: '#999999'
      },
      border: '#e9ecef',
      accent: '#f1f3f6'
    }
  },
  typography: {
    fonts: {
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      sans: ['Inter', 'system-ui', 'sans-serif']
    },
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem'
    }
  },
  animations: {
    transition: {
      fast: '150ms ease-in-out',
      normal: '300ms ease-in-out',
      slow: '500ms ease-in-out'
    }
  }
};

export type BloombergTheme = typeof bloombergTheme;
