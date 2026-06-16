import { Link } from "react-router-dom";
import Footer from "../Footer.jsx";
import Header from "../Header.jsx";
import AccountSidebar from "./AccountSidebar.jsx";
import { fallbackHomeData } from "../../data/homeData.js";

function AccountLayout({ active, breadcrumbCurrent, title, subtitle, actions, children }) {
  return (
    <div className="min-h-screen overflow-x-hidden bg-gradient-to-b from-blue-50/70 via-white to-white">
      <Header data={fallbackHomeData} />
      <main className="pt-[68px] md:pt-[104px] lg:pt-[108px]">
        <section className="container-page py-8 lg:py-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div>
              <p className="text-sm font-black text-navy-800">
                <Link to="/" className="text-upchar-blue">Home</Link>
                <span className="mx-2 text-navy-400">&gt;</span>
                <Link to="/my-account" className="text-upchar-blue">My Account</Link>
                <span className="mx-2 text-navy-400">&gt;</span>
                {breadcrumbCurrent}
              </p>
              <h1 className="mt-5 text-4xl font-black text-navy-900 sm:text-5xl">{title}</h1>
              <p className="mt-4 text-base font-semibold text-navy-700">{subtitle}</p>
            </div>
            {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
            <AccountSidebar active={active} />
            <div className="grid min-w-0 content-start gap-6">{children}</div>
          </div>
        </section>
      </main>
      <Footer data={fallbackHomeData} />
    </div>
  );
}

export default AccountLayout;
