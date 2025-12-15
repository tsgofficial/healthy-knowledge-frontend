"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import logo from "../assets/logo.png";
import {
  getUser,
  removeToken,
  isAuthenticated,
  fetchWithAuth,
} from "../utils/auth";

export default function AskQuestionPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
      return;
    }

    const userData = getUser();
    setUser(userData);
    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    removeToken();
    router.push("/login");
  };

  // Tags removed: asking without tags

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    setMessage("");

    try {
      const response = await fetchWithAuth("http://localhost:5001/questions", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          description: form.description,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Асуулт амжилттай илгээгдлээ!");
        // Optionally clear the form
        setForm({ title: "", description: "" });
        // Navigate back to questions
        setTimeout(() => {
          router.push("/questions");
        }, 1000);
      } else {
        setMessage(data.message || "Илгээхэд алдаа гарлаа.");
      }
    } catch (error) {
      console.error("Submit error:", error);
      setMessage("Алдаа гарлаа. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-black/60">Уншиж байна...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-black/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src={logo}
                alt="Health Overflow Logo"
                width={32}
                height={32}
                className="w-8 h-8"
                style={{
                  filter:
                    "brightness(0) saturate(100%) invert(52%) sepia(98%) saturate(1827%) hue-rotate(192deg) brightness(100%) contrast(93%)",
                }}
              />
              <span className="text-lg font-semibold">Health Overflow</span>
            </Link>
            <nav className="flex items-center gap-6">
              <Link
                href="/questions"
                className="text-sm hover:text-primary transition-colors"
              >
                Асуултууд
              </Link>
              <Link
                href="/ask"
                className="text-sm text-primary font-medium transition-colors"
              >
                Асуулт асуух
              </Link>
              <Link
                href="/profile"
                className="text-sm hover:text-primary transition-colors"
              >
                Профайл
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder="Хайх..."
                className="w-64 pl-9 pr-3 py-2 border border-black/10 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <div className="relative group">
              <button className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                {user?.firstname?.[0]?.toUpperCase() ||
                  user?.email?.[0]?.toUpperCase() ||
                  "U"}
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white border border-black/10 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <div className="p-3 border-b border-black/10">
                  <p className="text-sm font-medium">
                    {user?.firstname} {user?.lastname}
                  </p>
                  <p className="text-xs text-black/60">{user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm hover:bg-black/5 transition-colors"
                >
                  Профайл
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  Гарах
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold mb-2">
            Шинэ эрүүл мэндийн асуулт асуух
          </h1>
          <p className="text-black/60">
            Өөрийн шинж тэмдэг эсвэл эрүүл мэндийн асуултаа бичиж, баталгаат
            хэрэглэгчдээс хариулт аваарай.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Question Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Асуултын гарчиг
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Жишээ нь: Улирлын харшлын нийтлэг шинж тэмдгүүд юу вэ?"
              className="w-full px-4 py-2.5 border border-black/10 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Detailed Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium mb-2"
            >
              Дэлгэрэнгүй тайлбар
            </label>

            {/* Toolbar */}
            <div className="border border-black/10 rounded-t-md bg-black/5 px-3 py-2 flex gap-2">
              <button
                type="button"
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Тод бичиг"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 4h8a4 4 0 014 4 4 4 0 01-4 4H6z M6 12h8"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Налуу бичиг"
              >
                <svg
                  className="w-4 h-4 italic"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Холбоос"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  />
                </svg>
              </button>
              <button
                type="button"
                className="p-1.5 hover:bg-white rounded transition-colors"
                title="Жагсаалт"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </div>

            <textarea
              id="description"
              required
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Шинж тэмдэг, үргэлжлэх хугацаа болон холбогдох бүх дэлгэрэнгүй мэдээллээ бичнэ үү. (Markdown дэмжинэ)"
              rows={10}
              className="w-full px-4 py-3 border border-t-0 border-black/10 rounded-b-md focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            />
          </div>

          {/* Tags removed: questions can be asked without tags */}

          {/* Message */}
          {message && (
            <div
              className={`p-3 rounded-md text-sm ${
                message.includes("амжилттай")
                  ? "bg-emerald-50 text-emerald-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {message}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Link
              href="/questions"
              className="px-6 py-2.5 border border-black/10 rounded-md text-sm font-medium hover:bg-black/5 transition-colors"
            >
              Цуцлах
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-primary text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Илгээж байна..." : "Асуулт илгээх"}
            </button>
          </div>
        </form>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/10 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-black/60">
          <p>© 2025 Health Overflow. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="flex gap-6">
            <Link
              href="/about"
              className="hover:text-primary transition-colors"
            >
              Бидний тухай
            </Link>
            <Link
              href="/privacy"
              className="hover:text-primary transition-colors"
            >
              Нууцлалын бодлого
            </Link>
            <Link
              href="/terms"
              className="hover:text-primary transition-colors"
            >
              Үйлчилгээний нөхцөл
            </Link>
            <Link
              href="/contact"
              className="hover:text-primary transition-colors"
            >
              Холбоо барих
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
