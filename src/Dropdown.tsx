import { createContext, Fragment, useEffect, useRef, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Manager, Popper, Reference } from "react-popper";

// Interface
interface IDropdown {
  children: any;
  title?: string;
  icon?: IconProp;
  noBackground?: boolean;
  color?: string;
  id?: string;
  style?: string;
  widthClass?: string; // tailwind w-X class e.g. w-56
}

interface IMenuItem {
  title: string;
  icon?: IconProp;
  onClick: any;
  id?: string;
}

interface IMenuHeading {
  title: string;
  icon?: IconProp;
  id?: string;
}

interface IMenuItemContainer {
  children: any;
}

interface DropdownMenuContextType {
  isVisible: boolean;
  showDropdownMenu: () => void;
  hideDropdownMenu: () => void;
}

const DropdownMenuCtx = createContext<DropdownMenuContextType>({
  isVisible: false,
  showDropdownMenu: () => {},
  hideDropdownMenu: () => {}
});

function useDropdownMenuCtx(
  ref: React.MutableRefObject<HTMLElement | undefined>
): DropdownMenuContextType {
  const [isVisible, setVisible] = useState<boolean>(false);

  useEffect(() => {
    function mouseDownListener(e: MouseEvent) {
      let targetAsNode: any = e.target;
      if (ref.current && !ref.current.contains(targetAsNode)) {
        setVisible(false);
      }
    }

    if (isVisible) {
      document.addEventListener("mousedown", mouseDownListener);
    }

    return () => {
      document.removeEventListener("mousedown", mouseDownListener);
    };
  }, [isVisible]);

  return {
    isVisible,
    showDropdownMenu: () => setVisible(true),
    hideDropdownMenu: () => setVisible(false)
  };
}

function DropdownMenu(props: IDropdown) {
  let { title, icon, noBackground, id, widthClass, color } = props;

  const popupNode = useRef<HTMLElement>();
  const ctxValue = useDropdownMenuCtx(popupNode);
  let placement = "bottom-start";

  widthClass = widthClass ? widthClass : "w-72";

  color = color ? color : "gray";

  return (
    <DropdownMenuCtx.Provider value={ctxValue}>
      <Manager>
        <div className="relative inline-block text-left">
          <Reference>
            {({ ref }) => (
              <div
                ref={ref}
                onClick={() => {
                  ctxValue.showDropdownMenu();
                }}
              >
                <div
                  id={id}
                  className={
                    "inline-flex justify-center w-full px-4 py-2 font-medium  focus:outline-none " +
                    ("text-" + color + " ") +
                    (noBackground
                      ? " hover:text-" + color + "-700 font-bold"
                      : " hover:bg-gray-50 border-gray-300 shadow-sm rounded-full border bg-white")
                  }
                >
                  {icon && <FontAwesomeIcon icon={icon} className="h-5 w-5" aria-hidden="true" />}
                  {Boolean(title) && <span className="ml-2">{title}</span>}
                  <FontAwesomeIcon
                    icon="caret-down"
                    className="-mr-1 ml-2 h-5 w-5"
                    aria-hidden="true"
                  />
                </div>
              </div>
            )}
          </Reference>
          {/* @ts-ignore */}
          <Popper placement={placement} innerRef={node => (popupNode.current = node)}>
            {({ ref, style }) =>
              ctxValue.isVisible ? (
                <div
                  onClick={e => {
                    e.stopPropagation();
                    ctxValue.hideDropdownMenu();
                  }}
                  ref={ref}
                  style={style}
                  className={
                    "z-10 origin-top-right absolute right-0 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none " +
                    widthClass
                  }
                >
                  <Menu>{props.children}</Menu>
                </div>
              ) : null
            }
          </Popper>
        </div>
      </Manager>
    </DropdownMenuCtx.Provider>
  );
}

function ContextMenu(props: IDropdown) {
  let { id, widthClass } = props;

  widthClass = widthClass ? widthClass : "w-72";

  return (
    <Menu as="div" id={id ? id : "context_menu"} className="relative inline-block text-left">
      <Transition
        show={true}
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          static
          className={
            "z-10 origin-top-right absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none " +
            widthClass
          }
        >
          {props.children}
        </Menu.Items>
      </Transition>
    </Menu>
  );
}

function MenuItem(props: IMenuItem) {
  let { title, icon, id } = props;

  return (
    <div id={id}>
      <Menu.Item>
        {({ active }) => (
          <div
            className={
              "group flex items-center px-4 py-2 cursor-pointer font-semibold " +
              (active ? "bg-gray-100 text-gray-900" : "text-black")
            }
            onClick={() => {
              document.body.click();
              props.onClick();
            }}
          >
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="mr-3 h-5 w-5 text-black group-hover:text-gray-900"
                aria-hidden="true"
              />
            )}
            {title}
          </div>
        )}
      </Menu.Item>
    </div>
  );
}

function MenuItemContainer(props: IMenuItemContainer) {
  return <Menu.Item>{props.children}</Menu.Item>;
}

function MenuHeading(props: IMenuHeading) {
  let { title, icon, id } = props;

  return (
    <div id={id}>
      <Menu.Item>
        {() => (
          <div
            className={
              "group flex items-center px-4 py-2 cursor-pointer font-semibold text-gray-700"
            }
          >
            {icon && (
              <FontAwesomeIcon
                icon={icon}
                className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-900"
                aria-hidden="true"
              />
            )}
            {title}
          </div>
        )}
      </Menu.Item>
    </div>
  );
}

const Dropdown = {
  MenuItemContainer,
  MenuItem,
  MenuHeading,
  Menu: DropdownMenu,
  ContextMenu
};

export { Dropdown };
