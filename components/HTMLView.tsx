import { HTMLViewProps as DefautlHTMLViewProps } from "react-native-htmlview";
import DefaultHTMLView from "react-native-htmlview";
import { useThemeColor } from "./Themed";

export type HTMLViewProps = {
  value?: string;
} & Omit<DefautlHTMLViewProps, "value" | "stylesheet">;

export default function HTMLView({ value, ...rest }: HTMLViewProps) {
  const paragraphColor = useThemeColor({}, "text");

  if (value) {
    return (
      <DefaultHTMLView
        stylesheet={{ p: { color: paragraphColor } }}
        value={value.replaceAll("\n", "")}
        paragraphBreak={"\n"}
        {...rest}
      />
    );
  }
}
