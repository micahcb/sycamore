declare namespace JSX {
  interface IntrinsicElements {
    "lord-icon": React.DetailedHTMLProps<
      React.HTMLAttributes<HTMLElement> & {
        src?: string;
        trigger?: "hover" | "click" | "loop" | "in" | "morph" | "boomerang" | "sequence" | "loop-on-hover";
        colors?: string;
        stroke?: "light" | "regular" | "bold";
        state?: string;
        target?: string;
      },
      HTMLElement
    >;
  }
}
