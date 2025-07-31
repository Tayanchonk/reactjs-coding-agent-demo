import AccessTokenLink from "./Content/AccessTokenLink";
import DataRetention from "./Content/DataRetention";
import GeneralSetting from "./Content/GeneralSetting";
import { Button } from "../../../components/CustomComponent";
import { TabNavigation } from "../../../components/CustomComponent";
const ConsentSettings = () => {
  return (
    <TabNavigation
      variant="contained"
      navigateTo={`${localStorage.getItem(
        "moduleSelect"
      )}/consent-setting/${localStorage.getItem("subMenuTab")}`}
    >
      {location.pathname === "/setting/consent-setting/general-consent" && (
        <GeneralSetting />
      )}
      {location.pathname === "/setting/consent-setting/accessed-token-link" && (
        <AccessTokenLink />
      )}
      {location.pathname === "/setting/consent-setting/data-retention" && <DataRetention />}
    </TabNavigation>
  );
};

export default ConsentSettings;
