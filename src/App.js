import Layout from './components/Layout';
import Missing from './components/Missing';
import Unauthorized from './components/Unauthorized';
import NavBar from './components/NavBar';
import LinkPage from './views/LinkPage';
import Register from './views/Register';
import JobPlanning from './views/JobPlanning';
import Login from './views/Login';
import Admin from './views/Admin';
import PosteReferent from './views/PosteReferent';
import FestivalInfo from './views/FestivalInfo';
import UsersSearch from './views/UsersSearch';
import ContactReferent from './views/ContactReferent';
import Home from './views/Home';
import RequireAuth from './components/RequireAuth';
import PersistLogin from './components/PersistLogin';
import { Routes, Route } from 'react-router-dom';
import Profile from './views/Profile';
import ChangePassword from './views/ChangePassword';
import OtherUserProfile from './views/OtherUserProfile';
import Messages from './views/Messages';
import Contact from './views/Contact';
import ContactMesBenevoles from './views/ContactMesBenevoles';
import ContactEveryone from './views/ContactEveryone';

const ROLES = {
  'User': 'User',
  'Admin': 'Admin',
  'Referent': 'Referent',
  'Super': 'Super'
}

function App() {

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />

        <Route path="/" element={<NavBar />}>


          <Route path="linkpage" element={<LinkPage />} />
          <Route path="unauthorized" element={<Unauthorized />} />
          <Route path="/" element={<Home />} />

          {/* we want to protect these routes */}
          <Route element={<PersistLogin />}>
            <Route element={<RequireAuth allowedRoles={[ROLES.User]} />}>
              <Route path="job-planning" element={<JobPlanning />} />
              <Route path="profile" element={<Profile />} />
              <Route path="change-password" element={<ChangePassword />} />
              <Route path="messages" element={<Messages />} />
              {/*dynamic route for profile*/}
              <Route path="profile/:user_id" element={<OtherUserProfile />} />
              <Route path="contact-referent/:id/:posteName" element={<ContactReferent />} />
              <Route path="contact/:username/:user_id" element={<Contact />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Referent]} />}>
              <Route path="contact/mes-benevoles" element={<ContactMesBenevoles />} />

            </Route>


            <Route element={<RequireAuth allowedRoles={[ROLES.Admin]} />}>
              <Route path="admin" element={<Admin />} />
              <Route path="festival-info/:id" element={<FestivalInfo />}/>
              <Route path="festival-info/:id/animation-referent/:posteId" element={<PosteReferent />} />
              <Route path="users-search" element={<UsersSearch />} />
              <Route path="contact/everyone" element={<ContactEveryone />} />
            </Route>

            <Route element={<RequireAuth allowedRoles={[ROLES.Super, ROLES.Admin]} />}>

            </Route>
          </Route>

          {/* catch all */}
          <Route path="*" element={<Missing />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;