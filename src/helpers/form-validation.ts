type ErrorKey = Exclude<keyof ValidityState, 'valid'>;
type FieldMessages = Partial<Record<ErrorKey, string>>;

const messages: Record<string, FieldMessages> = {
  email: {
    valueMissing: 'Please enter your email',
    typeMismatch: 'Please enter a valid email address',
    patternMismatch: 'Please enter a valid email address',
  },
  password: {
    valueMissing: 'Please enter your password',
    tooShort: 'Password must be at least 6 characters',
  },
};

const getErrorMessage = (input: HTMLInputElement): string => {
  const { validity } = input;
  if (validity.valid) return '';

  const errorPriority: ErrorKey[] = [
    'valueMissing',
    'typeMismatch',
    'tooShort',
    'patternMismatch',
  ];

  const messagesForInput = messages[input.name] ?? {};

  for (const key of errorPriority) {
    if (!validity[key]) continue;
    const errorMessage = messagesForInput[key];
    if (errorMessage) return errorMessage;
  }
  return input.validationMessage;
};

export const formValidation = (form: HTMLFormElement) => {
  console.log('hi');

  const submitButton = form.querySelector<HTMLButtonElement>(
    'button[type="submit"]',
  )!;
  const inputs = [...form.querySelectorAll<HTMLInputElement>('input')];
  const touched = new Set<HTMLInputElement>();

  const errorElement = new Map<HTMLInputElement, HTMLElement>();
  for (const input of inputs) {
    const element = form.querySelector<HTMLElement>(
      `[data-error-for="${CSS.escape(input.type)}"]`,
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
