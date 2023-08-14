import { Frame, Navigation, TopBar } from "@shopify/polaris";
import { ArrowLeftMinor, HomeMajor } from "@shopify/polaris-icons";
import { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";

function Layout({ children }) {
  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);
  const location = useLocation();

  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={
        <TopBar.UserMenu
          actions={[
            {
              items: [
                { content: "Support", icon: ArrowLeftMinor },
                { content: "Back to Shopify", icon: ArrowLeftMinor },
                { content: "Log out", icon: ArrowLeftMinor },
              ],
            },
          ]}
          name="Mukesh Purohit"
          detail="Polaris techtic demo"
          initials="M"
          open={userMenuActive}
          onToggle={toggleUserMenuActive}
        />
      }
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        fill
        items={[
          {
            url: "/page1",
            label: "Page1",
            selected: location.pathname === "/page1",
          },
          {
            url: "/page2",
            label: "Page2",
            selected: location.pathname === "/page2",
          },
        ]}
      />

      <Navigation.Section
        items={[
          {
            label: "Help center",
            icon: HomeMajor,
          },
        ]}
      />
    </Navigation>
  );

  return (
    <>
      <Frame
        navigation={navigationMarkup}
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
      >
        {children}
      </Frame>
    </>
  );
}

export default Layout;
