const Ticker = ({ label, ticked }: { label: string; ticked: boolean }) => {
  return (
    <div className="ticker">
      <span>{ticked ? "✅" : "☑️"}</span>
      {label}
    </div>
  );
};

export default Ticker;
