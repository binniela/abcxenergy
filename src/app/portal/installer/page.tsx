import { Container } from "@/components/ui";
import { PortalDashboard } from "@/components/portal-dashboard";
import { requireUser } from "@/lib/backend/auth";
import { getPortalOverview } from "@/lib/backend/services";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Installer Workspace - ABC X-Energy",
};

export default async function InstallerPortalPage() {
  const profile = await requireUser("/portal/installer");
  if (profile.role !== "installer") redirect(profile.role === "staff" ? "/admin" : "/portal");
  const overview = await getPortalOverview(profile.role);
  return (
    <Container className="py-10 lg:py-14">
      <PortalDashboard overview={overview} />
    </Container>
  );
}
