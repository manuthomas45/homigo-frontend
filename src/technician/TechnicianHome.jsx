import TechnicianNavbarSidebar from './TechnicianNavbarSidebar';
import TechnicianDashboard from './TechnicianDashboard';

const TechnicianHome = () => {
  return (
    <TechnicianNavbarSidebar>
      <TechnicianDashboard />
    </TechnicianNavbarSidebar>
  );
};

export default TechnicianHome;