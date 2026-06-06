import { Container } from "@/components/ui";
import { PortalDashboard } from "@/components/portal-dashboard";
import { getPortalOverview } from "@/lib/backend/services";

export const metadata = {
  title: "Homeowner Referral Portal — ABC X-Energy",
};

export default async function HomeownerPortalPage() {
  const overview = await getPortalOverview("homeowner");
  return (
    <Container className="py-10 lg:py-14">
      <PortalDashboard overview={overview} />
    </Container>
  );
}
