type ErrorKey = Exclude<keyof ValidityState, 'valid'>;
type Message = string | ((input: HTMLInputElement) => string);
type FieldMessages = Partial<Record<ErrorKey, Message>>;

const messages: Record<string, FieldMessages> = {
  email: {
    valueMissing: 'Please enter your email',
    typeMismatch: 'Please enter a valid email address',
    patternMismatch: 'Please enter a valid email address',
  },
  password: {
    valueMissing: 'Please enter your password',
    tooShort: 'Password must be at least 6 characters',
    patternMismatch: (input) => {
      const value = input.value;
      if (!/[A-Z]/.test(value))
        return 'Add at least one uppercase English letter';
      if (!/\d/.test(value)) return 'Add at least one digit';
      return /[^A-Za-z0-9]/.test(value)
        ? 'Use English letters, digits and special characters only (no spaces).'
        : 'Add at least one special character.';
    },
  },
  confirmPassword: {
    valueMissing: 'Please confirm your password',
    customError: 'Passwords do not match',
  },
  username: {
    valueMissing: 'Username is required.',
    tooShort: 'Username must be at least 2 characters',
    tooLong: 'Username must be at most 30 characters',
    patternMismatch: (input) =>
      /^[A-Z]/.test(input.value)
        ? 'Use English letters and digits only'
        : 'Must start with an uppercase English letter',
  },
};

const getErrorMessage = (input: HTMLInputElement): string => {
  const { validity } = input;
  if (validity.valid) return '';

  const errorPriority: ErrorKey[] = [
    'valueMissing',
    'typeMismatch',
    'tooShort',
    'tooLong',
    'patternMismatch',
    'customError',
  ];

  const messagesForInput = messages[input.name] ?? {};

  for (const key of errorPriority) {
    if (!validity[key]) continue;
    const errorMessage = messagesForInput[key];
    if (errorMessage)
      return typeof errorMessage === 'function'
        ? errorMessage(input)
        : errorMessage;
  }
  return input.validationMessage;
};

export const formValidation = (form: HTMLFormElement) => {
  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  const inputs = [...form.querySelectorAll<HTMLInputElement>('input')];
  const passwordInput = form.elements.namedItem('password') as HTMLInputElement;
  const confirmPasswordInput = form.elements.namedItem(
    'confirmPassword',
  ) as HTMLInputElement | null;
  const touched = new Set<HTMLInputElement>();

  const errorElement = new Map<HTMLInputElement, HTMLElement>();
  for (const input of inputs) {
    const element = form.querySelector<HTMLElement>(
      `[data-error-for="${CSS.escape(input.name)}"]`,
    )!;
    errorElement.set(input, element);

    for (const type of ['input', 'change', 'blur'] as const) {
      input.addEventListener(type, () => {
        touched.add(input);
        check();
      });
    }
  }

  const check = () => {
    if (confirmPasswordInput) {
      confirmPasswordInput.setCustomValidity(
        confirmPasswordInput.value &&
          confirmPasswordInput.value !== passwordInput.value
          ? 'mismatch'
          : '',
      );
    }
    for (const input of inputs) {
      const errorMessage = touched.has(input) ? getErrorMessage(input) : '';
      errorElement.get(input)!.textContent = errorMessage;
    }
    submitButton.disabled = !form.checkValidity();
  };

  form.addEventListener('submit', (event) => {
    if (form.checkValidity()) return;
    event.preventDefault();
    for (const input of inputs) touched.add(input);
    check();
  });

  const reset = () => {
    form.reset();
    touched.clear();
    check();
  };

  check();
  return reset;
};
