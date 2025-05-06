<<<<<<< Updated upstream
import { Link } from "react-router-dom";
=======
import { Link } from 'react-router-dom';
>>>>>>> Stashed changes

const Navbar = () => {
  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-4 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
<<<<<<< Updated upstream
        <h1 className="text-xl font-bold"> <Link to="/" >Smart City Portal</Link></h1>
      
=======
        <h1 className="text-xl font-bold">
          <Link to="/">Smart City Portal</Link>
        </h1>

>>>>>>> Stashed changes
        <div className="space-x-4">
          <Link to="/login" className="hover:underline">Login</Link>
          <Link to="/signup" className="hover:underline">Signup</Link>
          <Link to="/complaints" className="hover:underline">Submit</Link>
          <Link to="/my-complaints" className="hover:underline">My Complaints</Link>
<<<<<<< Updated upstream
=======
          <Link to="/official-login" className="hover:underline">Official Login</Link>

>>>>>>> Stashed changes
        </div>
      </div>
    </nav>
  );
};

<<<<<<< Updated upstream
export default Navbar;
=======
export default Navbar;
>>>>>>> Stashed changes
