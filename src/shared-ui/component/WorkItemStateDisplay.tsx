export interface WorkItemStateDisplayProps {
  color: string;
  text: string;
}

export const WorkItemStateDisplay = ({
  color,
  text
}: WorkItemStateDisplayProps): React.ReactElement => {
  return (
    <div className="flex-row flex-center">
      <div
        style={{
          backgroundColor: `#${color}`,
          width: '10px',
          height: '10px',
          borderRadius: '50%'
        }}
      ></div>
      <span className="margin-left-16">{text}</span>
    </div>
  );
};
