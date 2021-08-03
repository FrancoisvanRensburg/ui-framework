import { InfoButton } from "./InfoButton";

interface IProps {
  key?: any;
  fieldId?: string;
  onClick?: any;
  label?: any;
  labelClassName?: string;
  htmlFor?: string;
  hoverTitle?: string;
  info?: string;
  className?: string;
  id?: string;
  checked?: boolean;
  center?: boolean;
  disabled?: boolean;
  noPadding?: boolean;
  labelLeft?: boolean;
  labelRight?: boolean;
}

function Checkbox(props: IProps) {
  let {
    onClick,
    label,
    labelClassName,
    htmlFor,
    fieldId,
    info,
    className,
    id,
    center,
    checked,
    key,
    labelLeft,
    labelRight,
    hoverTitle,
    noPadding
  } = props;

  const labelEl = (
    <label
      className={
        "text-base flex items-center cursor-pointer " + (labelClassName ? labelClassName : "")
      }
      htmlFor={htmlFor}
    >
      {label}
      {info && <InfoButton>{info}</InfoButton>}
    </label>
  );

  return (
    <div
      id={id}
      onClick={onClick}
      key={key}
      className={
        (noPadding ? "" : "py-2 px-1 ") +
        " items-center flex space-x-4 cursor-pointer " +
        (center ? "justify-center " : "")
      }
    >
      {label && (labelLeft || (!labelLeft && !labelRight)) && labelEl}
      <input
        title={hoverTitle}
        type="checkbox"
        className={"text-primary border-gray-300 rounded " + (className ? className : "")}
        checked={checked}
        id={fieldId}
        onChange={() => {}}
      />

      {label && labelRight && labelEl}
    </div>
  );
}

export { Checkbox };
