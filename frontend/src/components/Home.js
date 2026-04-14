import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const HomeContainer = styled.div`
  background-color: #fcfcfc;
  min-height: 100vh;
  padding: 40px 80px;
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    padding: 20px;
  }
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 80px;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: 800;
  span {
    color: #ff5e3a;
  }
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;

  .login {
    font-weight: 600;
    cursor: pointer;
  }

  .signup {
    background-color: #fff;
    border: 1px solid #ddd;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }

  .vendor {
    background-color: #ff5e3a;
    color: white;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
  }
`;

const HeroSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 40px;

  @media (max-width: 1024px) {
    flex-direction: column;
  }
`;

const HeroText = styled.div`
  flex: 1;
  h1 {
    font-size: 80px;
    line-height: 1.1;
    margin-bottom: 20px;
    font-weight: 900;
    span {
      color: #ff5e3a;
      display: block;
    }
  }

  p {
    color: #666;
    max-width: 400px;
    line-height: 1.6;
    margin-bottom: 40px;
  }

  .cta-group {
    display: flex;
    gap: 20px;

    .primary {
      background-color: #ff5e3a;
      color: white;
      padding: 15px 30px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }

    .secondary {
      background-color: white;
      border: 1px solid #ddd;
      padding: 15px 30px;
      border-radius: 12px;
      font-weight: 600;
      cursor: pointer;
    }
  }
`;

const ImageGrid = styled.div`
  flex: 1.2;
  display: grid;
  grid-template-columns: 1fr 1.5fr;
  grid-template-rows: 1fr 0.8fr;
  gap: 20px;
  height: 600px;

  @media (max-width: 1024px) {
    width: 100%;
    height: 400px;
  }
`;

const GridImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.05);

  &.main {
    grid-row: span 2;
  }

  &.wide {
    grid-column: span 1;
  }
`;

const Home = () => {
  const navigate = useNavigate();

  return (
    <HomeContainer>
      <Nav>
        <Logo>EVENT<span>HOST</span></Logo>
        <NavLinks>
          <div className="login" onClick={() => navigate('/login')}>Login</div>
          <div className="signup" onClick={() => navigate('/register')}>Sign Up</div>
          <div className="vendor" onClick={() => navigate('/login')}>Admin Portal</div>
        </NavLinks>
      </Nav>

      <HeroSection>
        <HeroText>
          <h1>Effortlessly <span>plan or host your</span> events</h1>
          <p>
            Make event planning easy with our comprehensive platform. From start to finish, we streamline the process and offer dedicated support to make your event a success.
          </p>
          <div className="cta-group">
            <div className="primary" onClick={() => navigate('/register')}>Plan an Event</div>
            <div className="secondary" onClick={() => navigate('/events')}>Host an Event</div>
          </div>
        </HeroText>

        <ImageGrid>
          <GridImage 
            className="main" 
            src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8d2VkZGluZyUyMHJlY2VwdGlvbnxlbnwwfHwwfHx8MA%3D%3D" 
            alt="Wedding Reception" 
          />
          <GridImage 
            src="https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Y29ycG9yYXRlX2NvbmZlcmVuY2VfdGVjaHxlbnwwfHwwfHx8MA%3D%3D" 
            alt="Conference" 
          />
          <GridImage 
            className="wide"
            src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80&w=600" 
            alt="Party" 
          />
          <GridImage 
            src="https://plus.unsplash.com/premium_photo-1681831053618-fddca58afb6e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8b3V0ZG9vciUyMGV2ZW50fGVufDB8fDB8fHww" 
            alt="Outdoor Event" 
          />
        </ImageGrid>
      </HeroSection>
    </HomeContainer>
  );
};

export default Home;
