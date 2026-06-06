import { Container } from "@/components/ui";
import { PortalDashboard } from "@/components/portal-dashboard";
import { getPortalOverview } from "@/lib/backend/services";

export const metadata = {
  title: "Installer Workspace — ABC X-Energy",
};

export default async function InstallerPortalPage() {
  const overview = await getPortalOverview("installer");
  return (
    <Container className="py-10 lg:py-14">
      <PortalDashboard overview={overview} />
    </Container>
  );
}
