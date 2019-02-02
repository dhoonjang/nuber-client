import React from "react";
import Helmet from "react-helmet";
import Sidebar from "react-sidebar";
import styled from "../../typed-components";
import MenuContainer from "src/Components/Menu";
import Button from "src/Components/Button";
import AddressBar from "src/Components/AddressBar";
import { userProfile, getRides } from "src/types/api";
import { MutationFn } from "react-apollo";
import RidePopUp from "src/Components/RidePopUp";

const Container = styled.div``;

const MenuButton = styled.button`
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

const ExtendedButton = styled(Button)`
  position: absolute;
  bottom: 50px;
  left: 0;
  right: 0;
  margin: auto;
  z-index: 5;
  height: auto;
  width: 80%;
`;

const RequestButton = styled(ExtendedButton)`
  bottom: 250px;
  z-index: 5;
`;

interface IProps {
  loading: boolean;
  isMenuOpen: boolean;
  toggleMenu: () => void;
  mapRef: any;
  toAddress: string;
  price?: number;
  data?: userProfile;
  onAddressSubmit: () => void;
  onInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  requestRideFn?: MutationFn;
  nearbyRide?: getRides;
  acceptRideFn?: MutationFn;
}

const HomePresenter: React.SFC<IProps> = ({ 
  loading, 
  isMenuOpen, 
  toggleMenu, 
  toAddress,
  mapRef,
  price,
  data: { GetMyProfile: { user = null } = {} } = {},
  nearbyRide: { GetNearbyRide: { ride = null } = {} } = {},
  requestRideFn,
  acceptRideFn,
  onInputChange,
  onAddressSubmit }) => (
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
      {!loading && <MenuButton onClick={toggleMenu}>|||</MenuButton>}
      {user &&
        !user.isDriving && (
          <React.Fragment>
            <AddressBar
              name={"toAddress"}
              onChange={onInputChange}
              value={toAddress}
              onBlur={null}
            />
            <ExtendedButton
              onClick={onAddressSubmit}
              disabled={toAddress === ""}
              value={price ? "Change address" : "Pick Address"}
            />
          </React.Fragment>
        )}
      {price && (
        <RequestButton
          onClick={requestRideFn}
          disabled={toAddress === ""}
          value={`Request Ride ($${price})`}
        />
      )}
      {ride && (
        <RidePopUp
          id={ride.id}
          pickUpAddress={ride.pickUpAddress}
          dropOffAddress={ride.dropOffAddress}
          price={ride.price}
          distance={ride.distance}
          passengerName={ride.passenger.fullName!}
          passengerPhoto={ride.passenger.profilePhoto!}
          acceptRideFn={acceptRideFn}
        />
      )}
    </Sidebar>
    <Map ref={mapRef} />
  </Container>
);

export default HomePresenter;