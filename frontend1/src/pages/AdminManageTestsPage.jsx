import { useEffect, useMemo, useState } from "react";
import { Download, Plus } from "lucide-react";
import AccountToast from "../components/account/AccountToast.jsx";
import ConfirmDeleteModal from "../components/account/ConfirmDeleteModal.jsx";
import AdminLayout from "../components/admin/AdminLayout.jsx";
import TestFilters from "../components/admin/tests/TestFilters.jsx";
import TestFormModal from "../components/admin/tests/TestFormModal.jsx";
import TestStatsCards from "../components/admin/tests/TestStatsCards.jsx";
import TestsTable from "../components/admin/tests/TestsTable.jsx";
import ViewTestModal from "../components/admin/tests/ViewTestModal.jsx";
import { createAdminResource, deleteAdminResource, getAdminResource, getTestCategories, updateAdminResource } from "../api/api.js";

const defaultFilters = {
  category: "All Categories",
  maxPrice: "",
  minPrice: "",
  query: "",
  status: "All Status"
};

const formatCount = (value) => new Intl.NumberFormat("en-IN").format(value);

const normalizeAdminTest = (test) => {
  const price = Number(test.price ?? test.originalPrice ?? 0);
  const discountPercent = Number(test.discountPercent ?? 0);
  const finalPrice = Number(test.finalPrice ?? test.discountedPrice ?? Math.max(0, Math.round(price - (price * discountPercent) / 100)));
  const status = test.status || (test.isActive === false ? "Inactive" : "Active");

  return {
    ...test,
    id: String(test.id || test._id || test.testCode || Date.now()),
    testName: test.testName || test.name || "Untitled Test",
    testCode: test.testCode || "",
    category: test.category || "Pathology",
    image: test.image || test.testImage || "",
    testImage: test.testImage || test.image || "",
    price,
    discountPercent,
    finalPrice,
    homeCollection: test.homeCollection === true ? "Yes" : test.homeCollection === false ? "No" : test.homeCollection || "Yes",
    fastingRequired: test.fastingRequired === true ? "Yes" : test.fastingRequired === false ? "No" : test.fastingRequired || "No",
    status
  };
};

function AdminManageTestsPage() {
  const [tests, setTests] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [formTest, setFormTest] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [viewTest, setViewTest] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  useEffect(() => {
    let mounted = true;
    document.title = "Manage Tests | Upchar Admin";

    Promise.allSettled([getAdminResource("tests"), getTestCategories()])
      .then(([testsResult, categoriesResult]) => {
        if (!mounted) return;

        let loadedTests = [];
        if (testsResult.status === "fulfilled" && Array.isArray(testsResult.value)) {
          loadedTests = testsResult.value.map(normalizeAdminTest);
          setError("");
        } else {
          setError(testsResult.reason?.response?.data?.message || "Could not load tests from the backend.");
        }
        setTests(loadedTests);

        const nextCategories = new Set(loadedTests.map((test) => test.category).filter(Boolean));
        if (categoriesResult.status === "fulfilled" && Array.isArray(categoriesResult.value) && categoriesResult.value.length) {
          categoriesResult.value
            .map((item) => item.categoryName || item.name || item.label)
            .filter(Boolean)
            .forEach((category) => nextCategories.add(category));
        }
        setCategories([...nextCategories]);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const showToast = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2600);
  };

  const filteredTests = useMemo(() => {
    const query = filters.query.trim().toLowerCase();
    const minPrice = filters.minPrice === "" ? null : Number(filters.minPrice);
    const maxPrice = filters.maxPrice === "" ? null : Number(filters.maxPrice);

    return tests.filter((test) => {
      const testName = String(test.testName || test.name || "").toLowerCase();
      const testCode = String(test.testCode || "").toLowerCase();
      const price = Number(test.price || 0);
      const matchesQuery = !query || testName.includes(query) || testCode.includes(query);
      const matchesCategory = filters.category === "All Categories" || test.category === filters.category;
      const matchesStatus = filters.status === "All Status" || test.status === filters.status;
      const matchesMin = minPrice === null || price >= minPrice;
      const matchesMax = maxPrice === null || price <= maxPrice;
      return matchesQuery && matchesCategory && matchesStatus && matchesMin && matchesMax;
    });
  }, [filters, tests]);

  const stats = useMemo(() => {
    const total = tests.length;
    const active = tests.filter((test) => test.status === "Active").length;
    const inactive = tests.filter((test) => test.status === "Inactive").length;
    const categoryCount = new Set(tests.map((test) => test.category).filter(Boolean)).size || categories.length;

    return [
      { title: "Total Tests", value: formatCount(total), text: "All time", icon: "flask", color: "green" },
      { title: "Active Tests", value: formatCount(active), text: "Enabled", icon: "clipboard", color: "blue" },
      { title: "Inactive Tests", value: formatCount(inactive), text: "Disabled", icon: "rupee", color: "orange" },
      { title: "Categories", value: formatCount(categoryCount), text: "Total Categories", icon: "tag", color: "purple" }
    ];
  }, [categories.length, tests]);

  const saveTest = async (values) => {
    const recordId = String(values._id || values.id || "");
    const exists = tests.some((test) => String(test._id || test.id) === recordId);
    try {
      const saved = exists ? await updateAdminResource("tests", values._id || values.id, values) : await createAdminResource("tests", values);
      const normalized = normalizeAdminTest(saved);
      setTests((current) => {
        if (exists) return current.map((test) => (String(test._id || test.id) === recordId ? normalized : test));
        return [normalized, ...current];
      });
      if (normalized.category && !categories.includes(normalized.category)) {
        setCategories((current) => [...current, normalized.category]);
      }
      setFormTest(null);
      setShowAddForm(false);
      showToast(exists ? "Test updated successfully." : "Test added successfully.");
    } catch {
      showToast("Could not save test. Please check login and backend connection.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget._id) {
      setTests((current) => current.filter((test) => test.id !== deleteTarget.id));
      setDeleteTarget(null);
      showToast("Test removed from the current list.");
      return;
    }

    try {
      await deleteAdminResource("tests", deleteTarget._id || deleteTarget.id);
      const targetId = String(deleteTarget._id || deleteTarget.id);
      setTests((current) => current.filter((test) => String(test._id || test.id) !== targetId));
      setDeleteTarget(null);
      showToast("Test deleted successfully.");
    } catch {
      showToast("Could not delete test. Please check login and backend connection.");
    }
  };

  return (
    <AdminLayout topbarTitle={null} topbarBadge={null}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-3xl font-black text-navy-950">Manage Tests</h1>
          <p className="mt-3 text-sm font-semibold text-navy-700">
            <span className="font-black text-navy-950">Dashboard</span>
            <span className="px-2 text-navy-400">&gt;</span>
            Manage Tests
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => showToast("Tests export started.")} className="inline-flex h-12 items-center gap-2 rounded-md border border-upchar-green px-6 text-sm font-black text-upchar-green">
            <Download className="h-5 w-5" />
            Export
          </button>
          <button type="button" onClick={() => setShowAddForm(true)} className="inline-flex h-12 items-center gap-2 rounded-md bg-upchar-green px-6 text-sm font-black text-white shadow-sm hover:bg-upchar-greenDark">
            <Plus className="h-5 w-5" />
            Add New Test
          </button>
        </div>
      </div>

      <div className="mt-7">
        <TestStatsCards stats={stats} />
      </div>

      <div className="mt-6">
        <TestFilters
          categories={categories}
          filters={filters}
          onApply={() => showToast("Filters applied.")}
          onChange={setFilters}
          onReset={() => {
            setFilters(defaultFilters);
            showToast("Filters reset.");
          }}
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <section className="rounded-lg border border-blue-100 bg-white p-10 text-center text-sm font-black text-navy-600 shadow-sm">Loading tests...</section>
        ) : (
          <>
            {error ? (
              <section className="mb-4 rounded-lg border border-red-100 bg-red-50 p-4 text-sm font-black text-upchar-red shadow-sm">
                {error}
              </section>
            ) : null}
            <TestsTable
              rows={filteredTests}
              totalCount={tests.length}
              emptyMessage={tests.length ? "No tests found. Try changing your filters." : "No tests found. Add a new test to get started."}
              onDelete={setDeleteTarget}
              onEdit={(test) => setFormTest(test)}
              onView={setViewTest}
            />
          </>
        )}
      </div>

      {(showAddForm || formTest) ? (
        <TestFormModal
          categories={categories}
          test={formTest}
          onClose={() => {
            setFormTest(null);
            setShowAddForm(false);
          }}
          onSave={saveTest}
        />
      ) : null}

      {viewTest ? <ViewTestModal test={viewTest} onClose={() => setViewTest(null)} /> : null}

      {deleteTarget ? (
        <ConfirmDeleteModal
          title="Delete Test"
          message={`Are you sure you want to delete ${deleteTarget.testName}? This action cannot be undone.`}
          onCancel={() => setDeleteTarget(null)}
          onConfirm={confirmDelete}
        />
      ) : null}

      <AccountToast message={toast} />
    </AdminLayout>
  );
}

export default AdminManageTestsPage;
