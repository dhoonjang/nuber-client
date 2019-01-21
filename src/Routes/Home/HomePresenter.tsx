import React from "react";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "../../typed-components";
import MenuContainer from "src/Components/Menu";

const Container = styled.div``;

const Button = styled.button`
  appearance: none;
  padding: 10px;
  position: absolute;
  top: 10px;
  left: 10px;
  text-align: center;
  font-weight: 800;
  border: 0;
  cursor: pointer;
  font-size: 20px;
  transform: rotate(90deg);
  z-index: 2;
  background-color: transparent;
`;

const Map = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
`;
interface IProps {
  loading: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  mapRef: any;
}

const HomePresenter: React.SFC<IProps> = ({ loading, isMenuOpen, toggleMenu, mapRef }) => (
  <Container>
    <Helmet>
      <title>Home | Number</title>
    </Helmet>
    <Sidebar
      sidebar={<MenuContainer/>}
      open={isMenuOpen}
      onSetOpen={toggleMenu}
      styles={{
        sidebar: {
          backgroundColor: "white",
          width: "80%",
          zIndex: "10"
        }
      }}
    >
      {!loading && <Button onClick={toggleMenu}>|||</Button>}
    </Sidebar>
    <Map ref={mapRef} />
  </Container>
);

export default HomePresenter;