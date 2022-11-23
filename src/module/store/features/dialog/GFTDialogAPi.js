export function fetchOpen(value=false) {
    return new Promise((resolve) =>
      setTimeout(() => resolve({ data: value }), 500)
    );
  }
  