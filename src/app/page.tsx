import ChatRoom from "@/components/chat-room";
import HomeInfoRail from "@/components/sections/home-info-rail";
import HomeSection from "@/components/sections/home-section";
import AboutSection from "@/components/sections/about-section";
import EducationSkillsSection from "@/components/sections/education-skills-section";
import WorkExperienceSection from "@/components/sections/work-experience-section";
import OrganizationalExperienceSection from "@/components/sections/organizational-experience-section";
import ProjectsSection from "@/components/sections/projects-section";
import AchievementsSection from "@/components/sections/achievements-section";
import CertificationsSection from "@/components/sections/certifications-section";
import ContactSection from "@/components/sections/contact-section";
import { AnimatedNavFramer } from "@/components/ui/navigation-menu";
import { SmoothCursor } from "@/components/ui/smooth-cursor";
import NotificationAlertDialog from "@/components/notification-alert-dialog";

export default function Home() {
  return (
    <main>
      <AnimatedNavFramer />
      <SmoothCursor />
      <ChatRoom />
      <NotificationAlertDialog />
      <HomeSection />
      <HomeInfoRail />
      <AboutSection />
      <EducationSkillsSection />
      <WorkExperienceSection />
      <OrganizationalExperienceSection />
      <ProjectsSection />
      <AchievementsSection />
      <CertificationsSection />
      <div className="section-marquee" aria-hidden="true">
        <div>LET&apos;S CONNECT • CONTACT • LET&apos;S CONNECT • CONTACT • LET&apos;S CONNECT • CONTACT • </div>
      </div>
      <ContactSection />
    </main>
  );
}
