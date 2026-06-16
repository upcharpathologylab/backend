import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AccountLayout from "../components/account/AccountLayout.jsx";
import AccountToast from "../components/account/AccountToast.jsx";
import CommonQuestions from "../components/account/support/CommonQuestions.jsx";
import ConversationList from "../components/account/support/ConversationList.jsx";
import HelpHero from "../components/account/support/HelpHero.jsx";
import TrustStrip from "../components/account/TrustStrip.jsx";
import Icon from "../components/Icon.jsx";
import { getUserFaqs, getUserSupportTickets } from "../api/api.js";
import { clearAuthSession } from "../components/auth/authStorage.js";
import { commonQuestions, supportActions, supportConversations } from "../data/accountPagesData.js";
import useAccountResource from "../hooks/useAccountResource.js";

function AccountHelpSupportPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState("");
  const { data: conversations } = useAccountResource(getUserSupportTickets, supportConversations, []);
  const { data: faqs } = useAccountResource(getUserFaqs, commonQuestions, []);

  useEffect(() => {
    document.title = "Help & Support | Upchar Pathology";
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const logout = () => {
    clearAuthSession();
    showToast("Logged out successfully");
    window.setTimeout(() => navigate("/"), 700);
  };

  return (
    <AccountLayout
      active="help"
      breadcrumbCurrent="Help & Support"
      title="Help & Support"
      subtitle="We're here to help! Get answers or connect with our support team."
      actions={
        <button type="button" onClick={logout} className="inline-flex h-12 items-center gap-3 rounded-lg border border-blue-100 bg-white px-6 text-sm font-black text-upchar-red shadow-sm transition hover:bg-red-50">
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      }
    >
      <HelpHero query={query} onQueryChange={setQuery} onAction={(label) => showToast(`${label} selected.`)} />

      <div className="grid gap-5 xl:grid-cols-2">
        <ConversationList conversations={conversations} onOpen={(ticket) => showToast(`${ticket.title} opened.`)} />
        <CommonQuestions questions={faqs} onSelect={(question) => showToast(question)} />
      </div>

      <section className="rounded-lg border border-blue-100 bg-white p-5 shadow-sm lg:p-6">
        <h2 className="text-xl font-black text-navy-900">Quick Support Actions</h2>
        <p className="mt-1 text-sm font-semibold text-navy-600">Helpful tools to resolve issues quickly</p>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {supportActions.map((action) => (
            <button
              type="button"
              className="flex items-center gap-3 rounded-md border border-blue-100 p-4 text-left transition hover:bg-blue-50"
              key={action.title}
              onClick={() => showToast(`${action.title} selected.`)}
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-upchar-blue">
                <Icon name={action.icon} className="h-6 w-6" />
              </span>
              <span className="text-sm font-black text-navy-900">{action.title}</span>
            </button>
          ))}
        </div>
      </section>

      <TrustStrip />
      <AccountToast message={toast} />
    </AccountLayout>
  );
}

export default AccountHelpSupportPage;
