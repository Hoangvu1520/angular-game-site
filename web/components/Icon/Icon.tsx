import * as icons from "react-bootstrap-icons";

interface IconProps extends icons.IconProps {
  // Cannot use "name" as it is a valid SVG attribute
  // "iconName", "filename", "icon" will do it instead
  iconName: string; // Change the type to accept any string
  className?: string;

}


export const Icon = ({ iconName, className, ...props }: IconProps) => {
    const SelectedIcon = icons[iconName as keyof typeof icons] || null;

    if (!SelectedIcon) {
      console.error(`Icon '${iconName}' not found`);
      return null;
    }
  
    return <SelectedIcon className={className} {...props} />;
};
