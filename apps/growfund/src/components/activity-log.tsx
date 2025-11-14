const ActivityLog = ({
  icon,
  created_at,
  message,
}: {
  icon: React.ReactNode;
  message: React.ReactNode;
  created_at: string;
}) => {
  return (
    <div className="gf-flex gf-items-start gf-gap-3">
      {icon}
      <div className="gf-grid gf-gap-2">
        {message}
        <div className="gf-typo-tiny gf-font-medium gf-text-fg-muted">{created_at}</div>
      </div>
    </div>
  );
};

export default ActivityLog;
