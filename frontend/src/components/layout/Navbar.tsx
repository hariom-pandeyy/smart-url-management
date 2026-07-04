import "./Navbar.css";
type Props = {
  onCreateClick: () => void;
  title?: string;
  subtitle?: string;
  showCreateButton?: boolean;
};
const Navbar = ({
  onCreateClick,
  title = "Dashboard",
  subtitle = "Welcome back, Hariom 👋",
   showCreateButton = true,
}: Props) => {
  

  return (
    <header className="navbar">
      <div>
        <h1>{title}</h1>
<p>{subtitle}</p>
      </div>

      {showCreateButton && (
  <button onClick={onCreateClick}>
    + Create Link
  </button>
)}
    </header>
  );
};

export default Navbar;