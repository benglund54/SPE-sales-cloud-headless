interface FieldRowBaseProps {
  label: string;
}

interface TextFieldProps extends FieldRowBaseProps {
  type: 'text';
  value: string;
  onChange: (value: string) => void;
}

interface BadgeFieldProps extends FieldRowBaseProps {
  type: 'badge';
  value: string;
  variant: 'purple' | 'orange' | 'green' | 'blue' | 'gray';
}

interface TextareaFieldProps extends FieldRowBaseProps {
  type: 'textarea';
  value: string;
  onChange: (value: string) => void;
}

interface CheckboxFieldProps extends FieldRowBaseProps {
  type: 'checkbox';
  value: boolean;
  onChange: (value: boolean) => void;
}

interface DropdownFieldProps extends FieldRowBaseProps {
  type: 'dropdown';
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

interface NumberFieldProps extends FieldRowBaseProps {
  type: 'number';
  value: number;
  onChange: (value: number) => void;
}

type FieldRowProps =
  | TextFieldProps
  | BadgeFieldProps
  | TextareaFieldProps
  | CheckboxFieldProps
  | DropdownFieldProps
  | NumberFieldProps;

export function FieldRow(props: FieldRowProps) {
  return (
    <div className="field-row">
      <div className="field-row-label">{props.label}</div>
      <div className="field-row-value">
        {props.type === 'text' && (
          <input
            type="text"
            className="field-input"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          />
        )}

        {props.type === 'badge' && (
          <span className={`field-badge field-badge-${props.variant}`}>
            {props.value}
          </span>
        )}

        {props.type === 'textarea' && (
          <textarea
            className="field-textarea"
            value={props.value}
            rows={3}
            onChange={(e) => props.onChange(e.target.value)}
          />
        )}

        {props.type === 'checkbox' && (
          <input
            type="checkbox"
            className="field-checkbox"
            checked={props.value}
            onChange={(e) => props.onChange(e.target.checked)}
          />
        )}

        {props.type === 'dropdown' && (
          <select
            className="field-dropdown"
            value={props.value}
            onChange={(e) => props.onChange(e.target.value)}
          >
            <option value="">Select option</option>
            {props.options.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {props.type === 'number' && (
          <input
            type="number"
            className="field-input field-input-number"
            value={props.value}
            onChange={(e) => props.onChange(Number(e.target.value))}
          />
        )}
      </div>
    </div>
  );
}
