import type { CSSProperties, DOMAttributes } from "react";

type WiredElementProps = DOMAttributes<HTMLElement> & {
  elevation?: string | number;
  disabled?: boolean;
  style?: CSSProperties;
};

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "wired-button": WiredElementProps;
      "wired-card": WiredElementProps;
    }
  }
}

export {};
